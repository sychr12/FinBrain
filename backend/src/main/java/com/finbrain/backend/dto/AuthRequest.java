package com.finbrain.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AuthRequest {

    @Email(message = "Email invalido")
    @NotBlank(message = "Email e obrigatorio")
    private String email;

    @NotBlank(message = "Senha e obrigatoria")
    private String senha;  // ← mudou de "password" para "senha"
}