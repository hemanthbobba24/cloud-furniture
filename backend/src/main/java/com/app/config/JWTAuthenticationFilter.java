package com.app.config;

import com.app.auth.JwtService;
import com.app.security.DbUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final DbUserDetailsService userDetailsService;

    // List of public paths that don't require JWT
    private static final List<String> PUBLIC_PATHS = Arrays.asList(
            "/api/v1/auth/signup",
            "/api/v1/auth/login",
            "/api/v1/health"
    );

    public JWTAuthenticationFilter(JwtService jwtService, DbUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        System.out.println("[JWT Filter] Processing: " + method + " " + path);

        // Skip JWT validation for OPTIONS requests (CORS preflight)
        if ("OPTIONS".equals(method)) {
            System.out.println("[JWT Filter] Skipping OPTIONS request");
            filterChain.doFilter(request, response);
            return;
        }

        // Skip JWT validation for public auth endpoints
        if (path.startsWith("/api/v1/auth/")) {
            System.out.println("[JWT Filter] Skipping public auth endpoint: " + path);
            filterChain.doFilter(request, response);
            return;
        }

        // Skip JWT validation for health endpoint
        if (path.equals("/api/v1/health")) {
            System.out.println("[JWT Filter] Skipping health endpoint");
            filterChain.doFilter(request, response);
            return;
        }

        // Skip JWT validation for public GET listing endpoints
        if ((path.equals("/api/v1/listings") || path.startsWith("/api/v1/listings/"))
                && "GET".equals(method)) {
            System.out.println("[JWT Filter] Skipping public listing GET endpoint: " + path);
            filterChain.doFilter(request, response);
            return;
        }

        // For all other requests, validate JWT
        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("[JWT Filter] No Bearer token found for: " + path);
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String jwt = authHeader.substring(7);
            final String userEmail = jwtService.extractUsername(jwt);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    System.out.println("[JWT Filter] Successfully authenticated: " + userEmail);
                } else {
                    System.err.println("[JWT Filter] Invalid token for: " + userEmail);
                }
            }
        } catch (Exception e) {
            System.err.println("[JWT Filter] Error processing JWT: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}