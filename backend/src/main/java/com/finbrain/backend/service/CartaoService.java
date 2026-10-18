package com.finbrain.backend.service;

import com.finbrain.backend.dto.CartaoRequest;
import com.finbrain.backend.dto.CartaoResponse;
import com.finbrain.backend.model.Cartao;
import com.finbrain.backend.model.Usuario;
import com.finbrain.backend.repository.CartaoRepository;
import com.finbrain.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartaoService {

    private final CartaoRepository cartaoRepository;
    private final UsuarioRepository usuarioRepository;

    private Usuario getUsuarioLogado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));
    }

    public CartaoResponse criar(CartaoRequest request) {
        validarDias(request.getDiaFechamento(), request.getDiaVencimento());

        Usuario usuario = getUsuarioLogado();

        Cartao cartao = new Cartao();
        cartao.setNome(request.getNome().trim());
        cartao.setNumeroMascarado(request.getNumeroMascarado().trim());
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
                .toList();
    }

    private void validarDias(Integer diaFechamento, Integer diaVencimento) {
        if (diaFechamento < 1 || diaFechamento > 31) {
            throw new RuntimeException("Dia de fechamento deve estar entre 1 e 31");
        }

        if (diaVencimento < 1 || diaVencimento > 31) {
            throw new RuntimeException("Dia de vencimento deve estar entre 1 e 31");
        }
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
