package com.finbrain.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "cartoes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cartao {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;
    
    @Column(name = "numero_mascarado")
    private String numeroMascarado;
    
    @Column(name = "limite_total")
    private BigDecimal limiteTotal;
    
    @Column(name = "limite_disponivel")
    private BigDecimal limiteDisponivel;
    
    @Column(name = "dia_fechamento")
    private Integer diaFechamento;
    
    @Column(name = "dia_vencimento")
    private Integer diaVencimento;
    
    private Boolean ativo = true;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    
    @Temporal(TemporalType.DATE)
    private Date dataCriacao;
    
    @Temporal(TemporalType.DATE)
    private Date dataAtualizacao;
}