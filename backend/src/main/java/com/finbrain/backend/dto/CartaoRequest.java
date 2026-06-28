package com.finbrain.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CartaoRequest {

    @NotBlank(message = "Nome e obrigatorio")
    private String nome;

    @NotBlank(message = "Numero e obrigatorio")
    private String numeroMascarado;

    @NotNull(message = "Limite total e obrigatorio")
    @Positive(message = "Limite deve ser positivo")
    private BigDecimal limiteTotal;

    @NotNull(message = "Dia de fechamento e obrigatorio")
    @Min(value = 1, message = "Dia de fechamento deve estar entre 1 e 31")
    @Max(value = 31, message = "Dia de fechamento deve estar entre 1 e 31")
    private Integer diaFechamento;

    @NotNull(message = "Dia de vencimento e obrigatorio")
    @Min(value = 1, message = "Dia de vencimento deve estar entre 1 e 31")
    @Max(value = 31, message = "Dia de vencimento deve estar entre 1 e 31")
    private Integer diaVencimento;
}
