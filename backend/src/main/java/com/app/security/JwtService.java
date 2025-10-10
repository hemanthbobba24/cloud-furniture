package com.app.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {
  private final Key key;
  private final long expiryMillis;

  public JwtService(@Value("${app.jwt.secret}") String secret,
                    @Value("${app.jwt.expirySeconds:86400}") long expirySeconds) {
    // use raw UTF-8 bytes; requires secret length >= 32 chars for HS256
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.expiryMillis = expirySeconds * 1000L;
  }

  public String generate(String subject, Map<String, Object> claims) {
    long now = System.currentTimeMillis();
    return Jwts.builder()
            .setSubject(subject)
            .addClaims(claims)
            .setIssuedAt(new Date(now))
            .setExpiration(new Date(now + expiryMillis))
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();
  }

  // (optional) add a parse method if your filter uses it
  public io.jsonwebtoken.Jws<io.jsonwebtoken.Claims> parse(String token) {
    return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
  }
}
