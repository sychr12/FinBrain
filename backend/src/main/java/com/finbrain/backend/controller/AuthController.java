package com.finbrain.backend.controller;

import com.finbrain.backend.dto.AuthRequest;
import com.finbrain.backend.dto.AuthResponse;
import com.finbrain.backend.dto.RegisterRequest;
import com.finbrain.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        System.out.println("🏥 Health check chamado");
        return ResponseEntity.ok("OK");
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody @Valid RegisterRequest request) {
        System.out.println("📝 Registro recebido: " + request.getEmail());
        service.registrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("Usuário registrado com sucesso");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        System.out.println("🔐 Login recebido: " + request.getEmail());
        AuthResponse response = service.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/confirmar")
    public ResponseEntity<String> confirmar(
            @RequestParam("email") String email,
            @RequestParam("codigo") String codigo) {
        System.out.println("✅ Confirmando conta: " + email);
        System.out.println("🔑 Código: " + codigo);
        String resultado = service.confirmar(email, codigo);
        return ResponseEntity.ok(resultado);
    }
}