package com.finbrain.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "cartoes")
public class Cartao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(name = "numero_mascarado",nullable = false)
    private String numeroMascarado;
    
    @Column(name = "limite_total", nullable = false)
    private BigDecimal limiteTotal;
    
     @Column(name = "limite_disponivel", nullable = false)
    private BigDecimal limiteDisponivel;

    @Column(name = "dia_fechamento", nullable = false)
    private Integer diaFechamento;

    @Column(name = "dia_vencimento", nullable = false)
    private Integer diaVencimento;

    @Column(nullable = false)
    private Boolean ativo;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    @Column(name = "data_atualizado")
    private LocalDateTime dataAtualizado;

     @PrePersist
    public void prePersist() {
        this.dataCriacao = LocalDateTime.now();
        this.dataAtualizado = LocalDateTime.now();

        if (limiteDisponivel == null) {
            this.limiteDisponivel = limiteTotal;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.dataAtualizado = LocalDateTime.now();
    }
}
