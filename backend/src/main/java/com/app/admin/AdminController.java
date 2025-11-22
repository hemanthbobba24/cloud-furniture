package com.app.admin;

import com.app.listing.Listing;
import com.app.listing.ListingRepository;
import com.app.sellerrequest.SellerRequest;
import com.app.sellerrequest.SellerRequestRepository;
import com.app.sellerrequest.RequestStatus;
import com.app.user.Role;
import com.app.user.User;
import com.app.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

  private final UserRepository userRepository;
  private final ListingRepository listingRepository;
  private final SellerRequestRepository sellerRequestRepository;
  private final PasswordEncoder passwordEncoder;

  public AdminController(UserRepository userRepository,
                         ListingRepository listingRepository,
                         SellerRequestRepository sellerRequestRepository,
                         PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.listingRepository = listingRepository;
    this.sellerRequestRepository = sellerRequestRepository;
    this.passwordEncoder = passwordEncoder;
  }

  // ============================================
  // USER MANAGEMENT
  // ============================================

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

  // Create new admin user
  @PostMapping("/users/create-admin")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> createAdminUser(@RequestBody Map<String, String> request) {
    String email = request.get("email");
    String password = request.get("password");

    if (email == null || password == null) {
      return ResponseEntity.badRequest().body(Map.of("message", "Email and password required"));
    }

    try {
      // Check if user already exists
      if (userRepository.findByEmail(email).isPresent()) {
        return ResponseEntity.badRequest().body(Map.of("message", "User already exists"));
      }

      // Create new admin user
      User admin = new User();
      admin.setEmail(email);
      admin.setPasswordHash(passwordEncoder.encode(password));
      admin.setRole(Role.ADMIN);

      userRepository.save(admin);

      System.out.println("[AdminController] Created new admin: " + email);
      return ResponseEntity.ok(Map.of("message", "Admin user created successfully"));

    } catch (Exception e) {
      System.err.println("[AdminController] Error creating admin: " + e.getMessage());
      return ResponseEntity.status(500).body(Map.of("message", "Failed to create admin"));
    }
  }

  // ============================================
  // LISTING MANAGEMENT
  // ============================================

  // Delete any listing (admin power)
  @DeleteMapping("/listings/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> deleteListing(@PathVariable Long id) {
    listingRepository.deleteById(id);
    System.out.println("[AdminController] Deleted listing: " + id);
    return ResponseEntity.ok(Map.of("message", "Listing deleted"));
  }

  // ============================================
  // SELLER REQUEST MANAGEMENT
  // ============================================

  // Get all pending seller requests
  @GetMapping("/seller-requests")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<SellerRequest>> getSellerRequests() {
    List<SellerRequest> requests = sellerRequestRepository.findByStatus(RequestStatus.PENDING);
    System.out.println("[AdminController] Returning " + requests.size() + " pending seller requests");
    return ResponseEntity.ok(requests);
  }

  // Approve seller request
  @PostMapping("/approve-seller/{requestId}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> approveSeller(@PathVariable Long requestId) {
    SellerRequest request = sellerRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Request not found"));

    if (request.getStatus() != RequestStatus.PENDING) {
      return ResponseEntity.badRequest()
              .body(Map.of("message", "Request already processed"));
    }

    // Update user role to SELLER
    User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));

    user.setRole(Role.SELLER);
    userRepository.save(user);

    // Mark request as approved
    request.setStatus(RequestStatus.APPROVED);
    sellerRequestRepository.save(request);

    System.out.println("[AdminController] Approved seller request for: " + user.getEmail());
    return ResponseEntity.ok(Map.of("message", "Seller request approved"));
  }

  // Reject seller request
  @PostMapping("/reject-seller/{requestId}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> rejectSeller(@PathVariable Long requestId) {
    SellerRequest request = sellerRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Request not found"));

    if (request.getStatus() != RequestStatus.PENDING) {
      return ResponseEntity.badRequest()
              .body(Map.of("message", "Request already processed"));
    }

    request.setStatus(RequestStatus.REJECTED);
    sellerRequestRepository.save(request);

    System.out.println("[AdminController] Rejected seller request for: " + request.getUserEmail());
    return ResponseEntity.ok(Map.of("message", "Seller request rejected"));
  }
}