package com.finbrain.backend.controller;

import com.finbrain.backend.dto.PerfilResponse;
import com.finbrain.backend.model.Usuario;
import com.finbrain.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UsuarioRepository repository;

    @GetMapping("/perfil")
    public ResponseEntity<PerfilResponse> getPerfil() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            throw new RuntimeException("Usuário não autenticado");
        }

        String email = auth.getName();

        Usuario user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return ResponseEntity.ok(new PerfilResponse(
            user.getId(),
            user.getNome(),
            user.getEmail()
        ));
    }
}