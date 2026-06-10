package com.finbrain.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CartaoRequest {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotBlank(message = "Número é obrigatório")
    private String numeroMascarado;

    @NotNull(message = "Limite total é obrigatório")
    @Positive(message = "Limite deve ser positivo")
    private BigDecimal limiteTotal;

    @NotNull(message = "Dia de fechamento é obrigatório")
    private Integer diaFechamento;

    @NotNull(message = "Dia de vencimento é obrigatório")
    private Integer diaVencimento;
}