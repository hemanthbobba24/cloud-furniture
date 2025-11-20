package com.app.admin;

import com.app.listing.Listing;
import com.app.listing.ListingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

  private final ListingRepository listingRepository;

  public AdminController(ListingRepository listingRepository) {
    this.listingRepository = listingRepository;
  }

  @GetMapping("/seller-requests")
  public ResponseEntity<List<Map<String, Object>>> getSellerRequests(
          @AuthenticationPrincipal UserDetails userDetails) {

    if (userDetails == null) {
      return ResponseEntity.status(401).build();
    }

    // Return empty list for now - implement seller approval logic later
    return ResponseEntity.ok(List.of());
  }

  @PostMapping("/approve-seller/{id}")
  public ResponseEntity<?> approveSeller(
          @PathVariable Long id,
          @AuthenticationPrincipal UserDetails userDetails) {

    if (userDetails == null) {
      return ResponseEntity.status(401).build();
    }

    // Implement seller approval logic here
    return ResponseEntity.ok().build();
  }
}
