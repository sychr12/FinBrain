package com.finbrain.backend.controller;

import com.finbrain.backend.dto.TransacaoRequest;
import com.finbrain.backend.dto.TransacaoResponse;
import com.finbrain.backend.service.TransacaoService;
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
@RequestMapping("/api/transacoes")
@RequiredArgsConstructor
public class TransacaoController {

    private final TransacaoService service;

    @PostMapping
    public ResponseEntity<TransacaoResponse> criar(@RequestBody @Valid TransacaoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(request));
    }

    @GetMapping
    public ResponseEntity<List<TransacaoResponse>> listar() {
        return ResponseEntity.ok(service.listar());
    }
}
