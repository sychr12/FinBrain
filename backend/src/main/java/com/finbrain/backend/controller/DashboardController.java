package com.finbrain.backend.controller;

import com.finbrain.backend.dto.DashboardResumoResponse;
import com.finbrain.backend.model.Transacao;
import com.finbrain.backend.model.Usuario;
import com.finbrain.backend.repository.CartaoRepository;
import com.finbrain.backend.repository.TransacaoRepository;
import com.finbrain.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final TransacaoRepository transacaoRepository;
    private final CartaoRepository cartaoRepository;
    private final UsuarioRepository usuarioRepository;

    @GetMapping("/resumo")
    public ResponseEntity<DashboardResumoResponse> getResumo(Authentication authentication) {
        Usuario usuario = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));

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
