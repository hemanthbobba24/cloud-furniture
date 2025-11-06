package com.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

  /**
   * Single, global CORS configuration used by Spring Security.
   * EDIT the allowed origins if your frontend runs somewhere else.
   */
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration cfg = new CorsConfiguration();

    // Frontend dev server
    cfg.setAllowedOrigins(List.of("http://localhost:5173"));
    // If you prefer patterns (e.g., different ports), use:
    // cfg.setAllowedOriginPatterns(List.of("http://localhost:*"));

    cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
    cfg.setAllowedHeaders(List.of(
            "Content-Type",
            "Authorization",
            "X-Role",
            "X-User-Email"
    ));
    cfg.setExposedHeaders(List.of("Location"));
    cfg.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", cfg);
    return source;
  }
}
