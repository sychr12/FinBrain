package com.finbrain.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PerfilUpdateRequest {

    @NotBlank(message = "Nome e obrigatorio")
    private String nome;

    @Email(message = "Email invalido")
    @NotBlank(message = "Email e obrigatorio")
    private String email;

    private String fotoPerfil;

    private Boolean fotoValidada;

    @Size(max = 500, message = "Reconhecimento facial deve ter no maximo 500 caracteres")
    private String reconhecimentoFacial;
}
