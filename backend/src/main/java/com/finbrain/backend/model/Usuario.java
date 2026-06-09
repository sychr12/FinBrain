package com.finbrain.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario implements UserDetails{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(nullable = false)
    // 🔥 começa como FALSE (precisa confirmar email)
    private Boolean enabled = false;

    @Column(name = "codigo_verificacao")
    // 🔥 código enviado por email (ex: #A1B2C)
    private String codigoVerificacao;

    @Column(name = "codigo_expiracao")
    // 🔥 define validade do código (ex: 10 minutos)
    private LocalDateTime codigoExpiracao;

    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm;


    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
       return List.of();
    }

    @Override
    public String getPassword() {
       return this.senha;
    }

    @Override
    public String getUsername() {
        return this.email;
    }
}