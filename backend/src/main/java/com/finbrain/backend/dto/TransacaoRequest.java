package com.finbrain.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransacaoRequest {

    @NotBlank(message = "Descricao e obrigatoria")
    private String descricao;

    @NotNull(message = "Valor e obrigatorio")
    @Positive(message = "Valor deve ser positivo")
    private BigDecimal valor;

    @NotBlank(message = "Tipo e obrigatorio")
    @Pattern(regexp = "(?i)RECEITA|DESPESA", message = "Tipo deve ser RECEITA ou DESPESA")
    private String tipo;

    private String categoria;

    @NotNull(message = "Data e obrigatoria")
    private LocalDate data;

    private Long cartaoId;
}
