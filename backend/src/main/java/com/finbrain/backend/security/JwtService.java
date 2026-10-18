package com.finbrain.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    // IMPORTANTE: este valor precisa ser FIXO em application.properties
    // (ou em variavel de ambiente JWT_SECRET) e nao pode mudar entre
    // reinicios do backend, ou todos os tokens emitidos antes da troca
    // passam a ser rejeitados com "signature does not match".
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    @PostConstruct
    private void validarSecret() {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException(
                "jwt.secret nao configurado. Defina um valor fixo em application.properties (ex: jwt.secret=...)"
            );
        }
        // HS256 exige no minimo 256 bits (32 bytes)
        if (secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException(
                "jwt.secret e muito curto para HS256 (minimo 32 bytes). Gere um valor maior, ex: openssl rand -base64 32"
            );
        }
    }

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String gerarToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extrairEmail(String token) {
        return getClaims(token).getSubject();
    }

    public boolean isTokenValido(String token) {
        try {
            getClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}