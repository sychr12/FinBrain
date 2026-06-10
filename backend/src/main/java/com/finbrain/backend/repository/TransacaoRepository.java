package com.finbrain.backend.repository;

import com.finbrain.backend.model.Transacao;
import com.finbrain.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
    List<Transacao> findByUsuarioOrderByDataDesc(Usuario usuario);
}