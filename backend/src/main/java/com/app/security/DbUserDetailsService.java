package com.app.security;
import com.app.user.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DbUserDetailsService implements UserDetailsService {
  private final UserRepository repo;
  public DbUserDetailsService(UserRepository repo){ this.repo = repo; }
  @Override public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    var u = repo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("not found"));
    return new org.springframework.security.core.userdetails.User(
      u.getEmail(), u.getPasswordHash(), List.of(new SimpleGrantedAuthority("ROLE_"+u.getRole().name()))
    );
  }
}
