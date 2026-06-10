package com.finbrain.backend.repository;

import com.finbrain.backend.model.Cartao;
import com.finbrain.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartaoRepository extends JpaRepository<Cartao, Long> {
    List<Cartao> findByUsuario(Usuario usuario);
}