package com.finbrain.backend.controller;

import com.finbrain.backend.dto.DashboardResumoResponse;
import com.finbrain.backend.model.Transacao;
import com.finbrain.backend.model.Usuario;
import com.finbrain.backend.repository.CartaoRepository;
import com.finbrain.backend.repository.TransacaoRepository;
import com.finbrain.backend.repository.UsuarioRepository;
import com.finbrain.backend.service.DashboardService;
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
    private DashboardService dashboardService;

    @GetMapping("/resumo")
    public ResponseEntity<DashboardResumoResponse> getResumo() {
        return ResponseEntity.ok(dashboardService.getResumo());
    }
}