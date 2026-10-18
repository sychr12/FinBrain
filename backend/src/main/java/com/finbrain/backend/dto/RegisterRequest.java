package com.finbrain.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Nome e obrigatorio")
    private String nome;

    @Email(message = "Email invalido")
    @NotBlank(message = "Email e obrigatorio")
    private String email;

    @NotBlank(message = "Senha e obrigatoria")
    @Size(min = 6, message = "Senha deve ter no minimo 6 caracteres")
    private String password;

    @NotBlank(message = "Confirmacao de senha e obrigatoria")
    private String confirmPassword;
}
