package com.finbrain.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class CartaoResponse {
    private Long id;
    private String nome;
    private String numeroMascarado;
    private BigDecimal limiteTotal;
    private BigDecimal limiteDisponivel;
    private Integer diaFechamento;
    private Integer diaVencimento;
    private Boolean ativo;
}