package com.app.admin;

import com.app.listing.Listing;
import com.app.listing.ListingRepository;
import com.app.user.Role;
import com.app.user.User;
import com.app.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

  private final UserRepository userRepository;
  private final ListingRepository listingRepository;

  public AdminController(UserRepository userRepository, ListingRepository listingRepository) {
    this.userRepository = userRepository;
    this.listingRepository = listingRepository;
  }

  // Get all users
  @GetMapping("/users")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<User>> getAllUsers() {
    List<User> users = userRepository.findAll();
    System.out.println("[AdminController] Returning " + users.size() + " users");
    return ResponseEntity.ok(users);
  }

  // Upgrade user to seller
  @PostMapping("/users/{id}/upgrade-to-seller")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> upgradeToSeller(@PathVariable Long id) {
    User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

    user.setRole(Role.SELLER);
    userRepository.save(user);

    System.out.println("[AdminController] Upgraded " + user.getEmail() + " to SELLER");
    return ResponseEntity.ok(Map.of("message", "User upgraded to seller"));
  }

  // Delete user
  @DeleteMapping("/users/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> deleteUser(@PathVariable Long id) {
    User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (user.getRole() == Role.ADMIN) {
      return ResponseEntity.status(403).body("Cannot delete admin users");
    }

    userRepository.deleteById(id);
    System.out.println("[AdminController] Deleted user: " + user.getEmail());
    return ResponseEntity.ok(Map.of("message", "User deleted"));
  }

  // Delete any listing (admin power)
  @DeleteMapping("/listings/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> deleteListing(@PathVariable Long id) {
    listingRepository.deleteById(id);
    System.out.println("[AdminController] Deleted listing: " + id);
    return ResponseEntity.ok(Map.of("message", "Listing deleted"));
  }

  // Get seller requests (placeholder - implement based on your needs)
  @GetMapping("/seller-requests")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<Map<String, Object>>> getSellerRequests() {
    // Return empty list for now - you can implement a pending sellers table later
    return ResponseEntity.ok(List.of());
  }

  // Approve seller request (placeholder)
  @PostMapping("/approve-seller/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> approveSeller(@PathVariable Long id) {
    // Implement seller approval logic here
    return ResponseEntity.ok(Map.of("message", "Seller approved"));
  }
}