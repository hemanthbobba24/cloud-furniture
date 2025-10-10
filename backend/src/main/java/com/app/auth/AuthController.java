package com.app.auth;

import com.app.user.Role;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
  private final AuthService svc;
  public AuthController(AuthService s){ this.svc = s; }

  @PostMapping("/signup")
  public ResponseEntity<?> signup(@RequestBody AuthDtos.SignupRequest req){
    svc.signup(req.email, req.password, req.role == null ? Role.USER : req.role);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/login")
  public ResponseEntity<AuthDtos.AuthResponse> login(@RequestBody AuthDtos.LoginRequest req){
    String token = svc.login(req.email, req.password);
    return ResponseEntity.ok(new AuthDtos.AuthResponse(token, req.email, "role-in-/me"));
  }

  @GetMapping("/me")
  public ResponseEntity<?> me(@AuthenticationPrincipal UserDetails user){
    if (user == null) return ResponseEntity.status(401).build();
    return ResponseEntity.ok(java.util.Map.of(
      "email", user.getUsername(),
      "roles", user.getAuthorities().stream().map(a->a.getAuthority()).toList()
    ));
  }
}
