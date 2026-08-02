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
    @Min(value = 1, message = "Dia de fechamento deve estar entre 1 e 31")
    @Max(value = 31, message = "Dia de fechamento deve estar entre 1 e 31")
    private Integer diaFechamento;

    @NotNull(message = "Dia de vencimento é obrigatório")
    @Min(value = 1, message = "Dia de vencimento deve estar entre 1 e 31")
    @Max(value = 31, message = "Dia de vencimento deve estar entre 1 e 31")
    private Integer diaVencimento;
}
