package com.finbrain.backend.controller;

import com.finbrain.backend.dto.CartaoRequest;
import com.finbrain.backend.dto.CartaoResponse;
import com.finbrain.backend.service.CartaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cartoes")
public class CartaoController {

    @Autowired
    private CartaoService service;

    @PostMapping
    public ResponseEntity<CartaoResponse> criar(@RequestBody @Valid CartaoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(request));
    }

    @GetMapping
    public ResponseEntity<List<CartaoResponse>> listar() {
        return ResponseEntity.ok(service.listar());
    }
}