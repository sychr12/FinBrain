package com.finbrain.backend.controller;

import com.finbrain.backend.dto.DashboardResumoResponse;
import com.finbrain.backend.model.Transacao;
import com.finbrain.backend.model.Usuario;
import com.finbrain.backend.repository.CartaoRepository;
import com.finbrain.backend.repository.TransacaoRepository;
import com.finbrain.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private TransacaoRepository transacaoRepository;

    @Autowired
    private CartaoRepository cartaoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/resumo")
    public ResponseEntity<DashboardResumoResponse> getResumo() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        List<Transacao> transacoes = transacaoRepository.findByUsuarioOrderByDataDesc(usuario);

        BigDecimal totalReceitas = transacoes.stream()
                .filter(t -> "RECEITA".equals(t.getTipo()))
                .map(Transacao::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDespesas = transacoes.stream()
                .filter(t -> "DESPESA".equals(t.getTipo()))
                .map(Transacao::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal saldo = totalReceitas.subtract(totalDespesas);

        long totalCartoes = cartaoRepository.findByUsuario(usuario).size();

        return ResponseEntity.ok(new DashboardResumoResponse(
            totalReceitas,
            totalDespesas,
            saldo,
            (long) transacoes.size(),
            totalCartoes
        ));
    }
}