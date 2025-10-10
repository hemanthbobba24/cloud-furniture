package com.app.auth;

import com.app.user.Role;

public class AuthDtos {
  public static class SignupRequest { public String email; public String password; public Role role = Role.USER; }
  public static class LoginRequest { public String email; public String password; }
  public static class AuthResponse { public String accessToken; public String email; public String role;
    public AuthResponse(String t, String e, String r) { accessToken=t; email=e; role=r; }
  }
}
