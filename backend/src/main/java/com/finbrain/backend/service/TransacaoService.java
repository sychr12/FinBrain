package com.finbrain.backend.service;

import com.finbrain.backend.dto.TransacaoRequest;
import com.finbrain.backend.dto.TransacaoResponse;
import com.finbrain.backend.model.Cartao;
import com.finbrain.backend.model.Transacao;
import com.finbrain.backend.model.Usuario;
import com.finbrain.backend.repository.CartaoRepository;
import com.finbrain.backend.repository.TransacaoRepository;
import com.finbrain.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransacaoService {

    @Autowired
    private TransacaoRepository transacaoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CartaoRepository cartaoRepository;

    private Usuario getUsuarioLogado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public TransacaoResponse criar(TransacaoRequest request) {
        Usuario usuario = getUsuarioLogado();

        Transacao transacao = new Transacao();
        transacao.setDescricao(request.getDescricao());
        transacao.setValor(request.getValor());
        transacao.setTipo(request.getTipo().toUpperCase());
        transacao.setCategoria(request.getCategoria());
        transacao.setData(request.getData());
        transacao.setUsuario(usuario);

        if (request.getCartaoId() != null) {
            Cartao cartao = cartaoRepository.findById(request.getCartaoId())
                    .orElseThrow(() -> new RuntimeException("Cartão não encontrado"));
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
                .collect(Collectors.toList());
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