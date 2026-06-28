package com.finbrain.backend.service;

import com.finbrain.backend.dto.TransacaoRequest;
import com.finbrain.backend.dto.TransacaoResponse;
import com.finbrain.backend.model.Cartao;
import com.finbrain.backend.model.Transacao;
import com.finbrain.backend.model.Usuario;
import com.finbrain.backend.repository.CartaoRepository;
import com.finbrain.backend.repository.TransacaoRepository;
import com.finbrain.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TransacaoService {

    private static final Set<String> TIPOS_VALIDOS = Set.of("RECEITA", "DESPESA");

    private final TransacaoRepository transacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final CartaoRepository cartaoRepository;

    private Usuario getUsuarioLogado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));
    }

    public TransacaoResponse criar(TransacaoRequest request) {
        Usuario usuario = getUsuarioLogado();
        String tipo = request.getTipo().trim().toUpperCase();

        if (!TIPOS_VALIDOS.contains(tipo)) {
            throw new RuntimeException("Tipo deve ser RECEITA ou DESPESA");
        }

        Transacao transacao = new Transacao();
        transacao.setDescricao(request.getDescricao().trim());
        transacao.setValor(request.getValor());
        transacao.setTipo(tipo);
        transacao.setCategoria(request.getCategoria() != null ? request.getCategoria().trim() : null);
        transacao.setData(request.getData());
        transacao.setUsuario(usuario);

        if (request.getCartaoId() != null) {
            Cartao cartao = cartaoRepository.findByIdAndUsuario(request.getCartaoId(), usuario)
                    .orElseThrow(() -> new RuntimeException("Cartao nao encontrado"));
            transacao.setCartao(cartao);
        }

        Transacao salvo = transacaoRepository.save(transacao);
        return toResponse(salvo);
    }

    public List<TransacaoResponse> listar() {
        Usuario usuario = getUsuarioLogado();
        return transacaoRepository.findByUsuarioOrderByDataDesc(usuario)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private TransacaoResponse toResponse(Transacao t) {
        return new TransacaoResponse(
                t.getId(),
                t.getDescricao(),
                t.getValor(),
                t.getTipo(),
                t.getCategoria(),
                t.getData(),
                t.getCartao() != null ? t.getCartao().getId() : null
        );
    }
}
