package com.finbrain.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PerfilResponse {
    private Long id;
    private String nome;
    private String email;
}