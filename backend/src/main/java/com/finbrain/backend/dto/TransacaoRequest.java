package com.finbrain.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransacaoRequest {

    @NotBlank(message = "Descrição é obrigatória")
    private String descricao;

    @NotNull(message = "Valor é obrigatório")
    @Positive(message = "Valor deve ser positivo")
    private BigDecimal valor;

    @NotBlank(message = "Tipo é obrigatório")
    private String tipo; // RECEITA ou DESPESA

    private String categoria;

    @NotNull(message = "Data é obrigatória")
    private LocalDate data;

    private Long cartaoId;
}