package com.app.security;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
  private final JwtService jwt; private final DbUserDetailsService uds;
  public JwtAuthFilter(JwtService jwt, DbUserDetailsService uds){ this.jwt = jwt; this.uds = uds; }
  @Override protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
      throws ServletException, IOException {
    String auth = req.getHeader("Authorization");
    if (auth != null && auth.startsWith("Bearer ") && SecurityContextHolder.getContext().getAuthentication()==null){
      String token = auth.substring(7);
      try {
        var claims = jwt.parse(token).getBody();
        var user = uds.loadUserByUsername(claims.getSubject());
        var authToken = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
        SecurityContextHolder.getContext().setAuthentication(authToken);
      } catch(Exception ignored){}
    }
    chain.doFilter(req,res);
  }
}
