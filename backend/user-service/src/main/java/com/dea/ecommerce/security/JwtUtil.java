package com.dea.ecommerce.security;

import com.dea.ecommerce.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    // A secure, 256-bit secret key for OmniCart
    private final SecretKey key = Keys.hmacShaKeyFor("OmniCartSuperSecretKeyForDEAModule2026!@#".getBytes());

    public String generateToken(User user) {
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("id", user.getId())
                .claim("role", user.getRole())
                .claim("name", user.getName())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 86400000)) // Token expires in 24 hours
                .signWith(key)
                .compact();
    }
}