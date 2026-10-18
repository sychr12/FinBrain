package com.finbrain.backend.controller;

import com.finbrain.backend.dto.PerfilResponse;
import com.finbrain.backend.dto.PerfilUpdateRequest;
import com.finbrain.backend.model.Usuario;
import com.finbrain.backend.repository.UsuarioRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UsuarioRepository repository;

    @GetMapping("/perfil")
    public ResponseEntity<PerfilResponse> getPerfil(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Usuario nao autenticado");
        }

        Usuario user = repository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));

        return ResponseEntity.ok(toResponse(user));
    }

    @PutMapping("/perfil")
    public ResponseEntity<PerfilResponse> atualizarPerfil(
            Authentication authentication,
            @RequestBody @Valid PerfilUpdateRequest request
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Usuario nao autenticado");
        }

        Usuario user = repository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));

        String novoEmail = request.getEmail().toLowerCase().trim();
        repository.findByEmail(novoEmail)
                .filter(outro -> !outro.getId().equals(user.getId()))
                .ifPresent(outro -> {
                    throw new RuntimeException("Email ja cadastrado");
                });

        user.setNome(request.getNome().trim());
        user.setEmail(novoEmail);
        user.setFotoPerfil(request.getFotoPerfil());
        user.setFotoValidada(Boolean.TRUE.equals(request.getFotoValidada()));
        user.setReconhecimentoFacial(request.getReconhecimentoFacial());

        return ResponseEntity.ok(toResponse(repository.save(user)));
    }

    private PerfilResponse toResponse(Usuario user) {
        return new PerfilResponse(
                user.getId(),
                user.getNome(),
                user.getEmail(),
                user.getFotoPerfil(),
                user.getFotoValidada(),
                user.getReconhecimentoFacial()
        );
    }
}
