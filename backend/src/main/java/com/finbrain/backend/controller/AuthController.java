package com.finbrain.backend.controller;

import com.finbrain.backend.dto.AuthRequest;
import com.finbrain.backend.dto.AuthResponse;
import com.finbrain.backend.dto.RedefinicaoSenha;
import com.finbrain.backend.dto.RegisterRequest;
import com.finbrain.backend.service.AuthService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService service;

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody @Valid RegisterRequest request) {
        logger.info("Registro recebido para {}", request.getEmail());
        service.registrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("Usuario registrado com sucesso");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid AuthRequest request) {
        AuthResponse response = service.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/confirmar")
    public ResponseEntity<String> confirmar(
            @RequestParam("email") String email,
            @RequestParam("codigo") String codigo
    ) {
        String resultado = service.confirmar(email, codigo);
        return ResponseEntity.ok(resultado);
    }

    @PostMapping("/esqueceuSenha")
    public ResponseEntity<?> esqueceuSenha(
            @RequestParam("email") String email) {
        service.esqueceuSenha(email);
        return ResponseEntity.ok("E-mail de recuperacao enviado com sucesso");
    }

    @PostMapping("/resetSenha")
    public ResponseEntity<?> redefinirSenha(
            @RequestBody RedefinicaoSenha redefinicaoSenha,
            @RequestParam("token") String token) {
        service.redefinirSenha(redefinicaoSenha, token);
        return ResponseEntity.ok("Senha redefinida com sucesso!");
    }
}
