package com.finbrain.backend.service;

import com.finbrain.backend.dto.AuthRequest;
import com.finbrain.backend.dto.AuthResponse;
import com.finbrain.backend.dto.RegisterRequest;
import com.finbrain.backend.model.Usuario;
import com.finbrain.backend.repository.UsuarioRepository;
import com.finbrain.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository repository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    public void registrar(RegisterRequest request) {
        if (request == null) {
            throw new RuntimeException("Dados inválidos");
        }

        String nome = request.getNome() != null ? request.getNome().trim() : null;
        String email = request.getEmail() != null ? request.getEmail().toLowerCase().trim() : null;
        String password = request.getPassword();
        String confirmPassword = request.getConfirmPassword();

        if (nome == null || nome.isBlank()) {
            throw new RuntimeException("Nome é obrigatório");
        }

        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email é obrigatório");
        }

        if (password == null || password.isBlank() || password.length() < 6) {
            throw new RuntimeException("Senha deve ter pelo menos 6 caracteres");
        }

        if (confirmPassword == null || confirmPassword.isBlank()) {
            throw new RuntimeException("Confirmação de senha é obrigatória");
        }

        if (repository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }

        if (!password.equals(confirmPassword)) {
            throw new RuntimeException("Senhas não coincidem");
        }

        String codigo = gerarCodigo();

        Usuario usuario = new Usuario();
        usuario.setNome(nome);
        usuario.setEmail(email);
        usuario.setSenha(encoder.encode(password));
        usuario.setEnabled(false);
        usuario.setCodigoVerificacao(codigo);
        usuario.setCodigoExpiracao(LocalDateTime.now().plusMinutes(30));

        repository.save(usuario);
        emailService.enviarCodigo(email, codigo);
        
        System.out.println("✅ Usuário registrado: " + email);
        System.out.println("🔐 Código de verificação: " + codigo);
    }

    public String confirmar(String email, String codigo) {
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email é obrigatório");
        }

        if (codigo == null || codigo.isBlank()) {
            throw new RuntimeException("Código é obrigatório");
        }

        Usuario user = repository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (Boolean.TRUE.equals(user.getEnabled())) {
            return "Conta já confirmada";
        }

        if (user.getCodigoVerificacao() == null ||
            !user.getCodigoVerificacao().equalsIgnoreCase(codigo.trim())) {
            throw new RuntimeException("Código inválido");
        }

        if (user.getCodigoExpiracao() == null ||
            user.getCodigoExpiracao().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Código expirado");
        }

        user.setEnabled(true);
        user.setCodigoVerificacao(null);
        user.setCodigoExpiracao(null);
        repository.save(user);

        System.out.println("✅ Conta confirmada: " + email);
        return "Conta confirmada com sucesso!";
    }

    public AuthResponse login(AuthRequest request) {
        if (request == null) {
            throw new RuntimeException("Dados inválidos");
        }

        String email = request.getEmail() != null
                ? request.getEmail().toLowerCase().trim()
                : null;

        String password = request.getPassword();

        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email é obrigatório");
        }

        if (password == null || password.isBlank()) {
            throw new RuntimeException("Senha é obrigatória");
        }

        Usuario user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!Boolean.TRUE.equals(user.getEnabled())) {
            throw new RuntimeException("Conta não verificada");
        }

        if (!encoder.matches(password, user.getSenha())) {
            throw new RuntimeException("Senha inválida");
        }

        String token = jwtService.gerarToken(user.getEmail());
        System.out.println("✅ Login realizado: " + email);
        return new AuthResponse(token);
    }

    private String gerarCodigo() {
        return "#" + UUID.randomUUID()
                .toString()
                .substring(0, 6)
                .toUpperCase();
    }
}