package com.app.auth;

import com.app.user.Role;
import com.app.user.User;
import com.app.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
  private final AuthService svc;
  private final UserRepository userRepository;

  public AuthController(AuthService s, UserRepository userRepository) {
    this.svc = s;
    this.userRepository = userRepository;
  }

  @PostMapping("/signup")
  public ResponseEntity<?> signup(@RequestBody AuthDtos.SignupRequest req){
    svc.signup(req.email, req.password, req.role == null ? Role.USER : req.role);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/login")
  public ResponseEntity<AuthDtos.AuthResponse> login(@RequestBody AuthDtos.LoginRequest req){
    // Authenticate and get token
    String token = svc.login(req.email, req.password);

    // Fetch user to get actual role
    User user = userRepository.findByEmail(req.email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // Return response with actual role (not hardcoded string)
    return ResponseEntity.ok(new AuthDtos.AuthResponse(token, req.email, user.getRole().name()));
  }

  @GetMapping("/me")
  public ResponseEntity<?> me(@AuthenticationPrincipal UserDetails user){
    if (user == null) return ResponseEntity.status(401).build();

    // Fetch full user to get role
    User fullUser = userRepository.findByEmail(user.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));

    return ResponseEntity.ok(java.util.Map.of(
            "email", user.getUsername(),
            "role", fullUser.getRole().name(),
            "roles", user.getAuthorities().stream().map(a->a.getAuthority()).toList()
    ));
  }
}