package com.app.auth;

import com.app.user.Role;
import com.app.user.User;
import com.app.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;

  public AuthService(
          UserRepository userRepository,
          PasswordEncoder passwordEncoder,
          JwtService jwtService,
          AuthenticationManager authenticationManager) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.authenticationManager = authenticationManager;
  }

  public void signup(String email, String password, Role role) {
    if (userRepository.findByEmail(email).isPresent()) {
      throw new RuntimeException("User already exists");
    }

    User user = new User();
    user.setEmail(email);
    // Use setPasswordHash instead of setPassword
    user.setPasswordHash(passwordEncoder.encode(password));
    user.setRole(role);

    userRepository.save(user);
    System.out.println("[AuthService] User created: " + email + " with role: " + role);
  }

  public String login(String email, String password) {
    // Authenticate WITHOUT the role - just email and password
    authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, password)
    );

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // Create UserDetails for JWT generation
    UserDetails userDetails = org.springframework.security.core.userdetails.User
            .withUsername(user.getEmail())
            .password(user.getPasswordHash())
            .authorities("ROLE_" + user.getRole().name())
            .build();

    String token = jwtService.generateToken(userDetails);
    System.out.println("[AuthService] Token generated for: " + email + " with role: " + user.getRole());

    return token;
  }
}