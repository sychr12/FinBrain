package com.finbrain.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class TransacaoResponse {
    private Long id;
    private String descricao;
    private BigDecimal valor;
    private String tipo;
    private String categoria;
    private LocalDate data;
    private Long cartaoId;
}