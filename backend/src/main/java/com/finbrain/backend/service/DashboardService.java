package com.finbrain.backend.service;

import com.finbrain.backend.dto.DashboardResumoResponse;
import com.finbrain.backend.model.Transacao;
import com.finbrain.backend.model.Usuario;
import com.finbrain.backend.repository.CartaoRepository;
import com.finbrain.backend.repository.TransacaoRepository;
import com.finbrain.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DashboardService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TransacaoRepository transacaoRepository;

    @Autowired
    private CartaoRepository cartaoRepository;

    public DashboardResumoResponse getResumo() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        List<Transacao> transacoes = transacaoRepository.findByUsuarioOrderByDataDesc(usuario);

        BigDecimal totalReceitas = transacoes.stream()
                .filter(t -> "RECEITA".equals(t.getTipo()))
                .map(t -> t.getValor() != null ? t.getValor() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, (a, b) -> a.add(b));

        BigDecimal totalDespesas = transacoes.stream()
                .filter(t -> "DESPESA".equals(t.getTipo()))
                .map(t -> t.getValor() != null ? t.getValor() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, (a, b) -> a.add(b));

        BigDecimal saldo = totalReceitas.subtract(totalDespesas);

        long totalCartoes = cartaoRepository.findByUsuario(usuario).size();

        return new DashboardResumoResponse(
                totalReceitas,
                totalDespesas,
                saldo,
                (long) transacoes.size(),
                totalCartoes
        );
    }
}
