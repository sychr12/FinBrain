package com.finbrain.backend.controller;

import com.finbrain.backend.dto.CartaoRequest;
import com.finbrain.backend.dto.CartaoResponse;
import com.finbrain.backend.service.CartaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cartoes")
@RequiredArgsConstructor
public class CartaoController {

    private final CartaoService service;

    @PostMapping
    public ResponseEntity<CartaoResponse> criar(@RequestBody @Valid CartaoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(request));
    }

    @GetMapping
    public ResponseEntity<List<CartaoResponse>> listar() {
        return ResponseEntity.ok(service.listar());
    }
}
