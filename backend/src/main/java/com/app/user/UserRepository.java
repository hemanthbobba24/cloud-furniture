package com.app.user;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);

  // <-- this is the method AuthService needs
  boolean existsByEmail(String email);
}
