package com.finbrain.backend.controller;

import com.finbrain.backend.dto.AuthRequest;
import com.finbrain.backend.dto.AuthResponse;
import com.finbrain.backend.dto.RegisterRequest;
import com.finbrain.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
}
