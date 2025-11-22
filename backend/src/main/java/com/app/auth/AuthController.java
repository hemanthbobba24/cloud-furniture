package com.app.auth;

import com.app.user.Role;
import com.app.user.User;
import com.app.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
  private final AuthService svc;
  private final UserRepository userRepository;


  public AuthController(AuthService s, UserRepository userRepository) {
    this.svc = s;
    this.userRepository = userRepository;
  }

  @PostMapping("/signup")
  public ResponseEntity<?> signup(@RequestBody AuthDtos.SignupRequest req) {
    System.out.println("[AuthController] Signup request for: " + req.email + " with role: " + req.role);
    try {
      svc.signup(req.email, req.password, req.role == null ? Role.USER : req.role);
      return ResponseEntity.ok().build();
    } catch (Exception e) {
      System.err.println("[AuthController] Signup error: " + e.getMessage());
      return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody AuthDtos.LoginRequest req) {
    System.out.println("[AuthController] Login attempt for: " + req.email);

    try {
      // Authenticate and get token (role is fetched from database)
      String token = svc.login(req.email, req.password);

      // Fetch user to get actual role from database
      User user = userRepository.findByEmail(req.email)
              .orElseThrow(() -> new RuntimeException("User not found"));

      System.out.println("[AuthController] Login successful for: " + req.email + " with role: " + user.getRole());

      // Return response with actual role from database
      return ResponseEntity.ok(new AuthDtos.AuthResponse(token, req.email, user.getRole().name()));
    } catch (Exception e) {
      System.err.println("[AuthController] Login error for " + req.email + ": " + e.getMessage());
      e.printStackTrace();
      return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
    }
  }

  @GetMapping("/me")
  public ResponseEntity<?> me(@AuthenticationPrincipal UserDetails user) {
    if (user == null) {
      System.err.println("[AuthController] /me called without authentication");
      return ResponseEntity.status(401).build();
    }

    System.out.println("[AuthController] /me called for: " + user.getUsername());

    // Fetch full user to get role
    User fullUser = userRepository.findByEmail(user.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));

    return ResponseEntity.ok(Map.of(
            "email", user.getUsername(),
            "role", fullUser.getRole().name(),
            "roles", user.getAuthorities().stream().map(a -> a.getAuthority()).toList()
    ));
  }
}