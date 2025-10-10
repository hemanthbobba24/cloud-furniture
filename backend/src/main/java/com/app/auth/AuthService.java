package com.app.auth;

import com.app.security.JwtService;
import com.app.user.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {
  private final UserRepository users;
  private final PasswordEncoder enc;
  private final JwtService jwt;

  public AuthService(UserRepository users, PasswordEncoder enc, JwtService jwt) {
    this.users = users; this.enc = enc; this.jwt = jwt;
  }

  public void signup(String email, String raw, Role role){
    if (users.existsByEmail(email)) throw new RuntimeException("Email exists");
    var u = new User();
    u.setEmail(email);
    u.setPasswordHash(enc.encode(raw));
    u.setRole(role == null ? Role.USER : role);
    users.save(u);
  }

  public String login(String email, String raw){
    var u = users.findByEmail(email).orElseThrow(() -> new RuntimeException("Invalid credentials"));
    if (!enc.matches(raw, u.getPasswordHash())) throw new RuntimeException("Invalid credentials");
    return jwt.generate(u.getEmail(), Map.of("role", u.getRole().name()));
  }
}
