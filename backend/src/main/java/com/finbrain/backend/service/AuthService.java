package com.finbrain.backend.service;

import com.finbrain.backend.dto.AuthRequest;
import com.finbrain.backend.dto.AuthResponse;
import com.finbrain.backend.dto.RegisterRequest;
import com.finbrain.backend.model.Usuario;
import com.finbrain.backend.repository.UsuarioRepository;
import com.finbrain.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UsuarioRepository repository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    public void registrar(RegisterRequest request) {
        String nome = request.getNome().trim();
        String email = request.getEmail().toLowerCase().trim();
        String password = request.getPassword();
        String confirmPassword = request.getConfirmPassword();

        if (repository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email ja cadastrado");
        }

        if (!password.equals(confirmPassword)) {
            throw new RuntimeException("Senhas nao coincidem");
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

        logger.info("Usuario registrado: {}", email);
    }

    public String confirmar(String email, String codigo) {
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email e obrigatorio");
        }

        if (codigo == null || codigo.isBlank()) {
            throw new RuntimeException("Codigo e obrigatorio");
        }

        Usuario user = repository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));

        if (Boolean.TRUE.equals(user.getEnabled())) {
            return "Conta ja confirmada";
        }

        if (user.getCodigoVerificacao() == null ||
                !user.getCodigoVerificacao().equalsIgnoreCase(codigo.trim())) {
            throw new RuntimeException("Codigo invalido");
        }

        if (user.getCodigoExpiracao() == null ||
                user.getCodigoExpiracao().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Codigo expirado");
        }

        user.setEnabled(true);
        user.setCodigoVerificacao(null);
        user.setCodigoExpiracao(null);
        repository.save(user);

        return "Conta confirmada com sucesso";
    }

    public AuthResponse login(AuthRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        String password = request.getSenha();  // ← CORRIGIDO: getSenha() em vez de getPassword()

        Usuario user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));

        if (!Boolean.TRUE.equals(user.getEnabled())) {
            throw new RuntimeException("Conta nao verificada");
        }

        if (!encoder.matches(password, user.getSenha())) {
            throw new RuntimeException("Senha invalida");
        }

        String token = jwtService.gerarToken(user.getEmail());
        return new AuthResponse(token);
    }

    private String gerarCodigo() {
        return "#" + UUID.randomUUID()
                .toString()
                .substring(0, 6)
                .toUpperCase();
    }
}