package com.finbrain.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor // 🔥 importante pra serialização
public class AuthResponse {

    private String token;

}