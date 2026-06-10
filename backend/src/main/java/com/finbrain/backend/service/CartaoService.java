package com.finbrain.backend.service;

import com.finbrain.backend.dto.CartaoRequest;
import com.finbrain.backend.dto.CartaoResponse;
import com.finbrain.backend.model.Cartao;
import com.finbrain.backend.model.Usuario;
import com.finbrain.backend.repository.CartaoRepository;
import com.finbrain.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartaoService {

    @Autowired
    private CartaoRepository cartaoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario getUsuarioLogado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public CartaoResponse criar(CartaoRequest request) {
        Usuario usuario = getUsuarioLogado();

        Cartao cartao = new Cartao();
        cartao.setNome(request.getNome());
        cartao.setNumeroMascarado(request.getNumeroMascarado());
        cartao.setLimiteTotal(request.getLimiteTotal());
        cartao.setLimiteDisponivel(request.getLimiteTotal());
        cartao.setDiaFechamento(request.getDiaFechamento());
        cartao.setDiaVencimento(request.getDiaVencimento());
        cartao.setAtivo(true);
        cartao.setUsuario(usuario);

        Cartao salvo = cartaoRepository.save(cartao);
        return toResponse(salvo);
    }

    public List<CartaoResponse> listar() {
        Usuario usuario = getUsuarioLogado();
        return cartaoRepository.findByUsuario(usuario)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private CartaoResponse toResponse(Cartao c) {
        return new CartaoResponse(
            c.getId(),
            c.getNome(),
            c.getNumeroMascarado(),
            c.getLimiteTotal(),
            c.getLimiteDisponivel(),
            c.getDiaFechamento(),
            c.getDiaVencimento(),
            c.getAtivo()
        );
    }
}