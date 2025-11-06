package com.app.seller;

import com.app.listing.Listing;
import com.app.listing.ListingRepository;
import com.app.user.User;
import com.app.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/seller")
@CrossOrigin(origins = "http://localhost:5173")
public class SellerController {

  private final ListingRepository listingRepository;
  private final UserRepository userRepository;

  public SellerController(ListingRepository listingRepository, UserRepository userRepository) {
    this.listingRepository = listingRepository;
    this.userRepository = userRepository;
  }

  /**
   * GET /api/v1/seller/my
   * Returns all listings created by the currently authenticated seller
   */
  @GetMapping("/my")
  public ResponseEntity<List<Listing>> getMyListings(@AuthenticationPrincipal UserDetails userDetails) {
    if (userDetails == null) {
      return ResponseEntity.status(401).build();
    }

    String email = userDetails.getUsername();
    List<Listing> listings = listingRepository.findBySellerEmail(email);

    System.out.println("[SellerController] Found " + listings.size() + " listings for " + email);

    return ResponseEntity.ok(listings);
  }

  /**
   * DELETE /api/v1/seller/listings/{id}
   * Deletes a listing owned by the current seller
   */
  @DeleteMapping("/listings/{id}")
  public ResponseEntity<?> deleteListing(
          @PathVariable Long id,
          @AuthenticationPrincipal UserDetails userDetails) {

    if (userDetails == null) {
      return ResponseEntity.status(401).build();
    }

    Listing listing = listingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Listing not found"));

    // Check if the listing belongs to the current seller
    if (!listing.getSellerEmail().equals(userDetails.getUsername())) {
      return ResponseEntity.status(403).body("Not authorized to delete this listing");
    }

    listingRepository.deleteById(id);
    System.out.println("[SellerController] Deleted listing " + id);

    return ResponseEntity.ok().build();
  }

  /**
   * PUT /api/v1/seller/listings/{id}
   * Updates a listing owned by the current seller
   */
  @PutMapping("/listings/{id}")
  public ResponseEntity<Listing> updateListing(
          @PathVariable Long id,
          @RequestBody Listing updatedListing,
          @AuthenticationPrincipal UserDetails userDetails) {

    if (userDetails == null) {
      return ResponseEntity.status(401).build();
    }

    Listing existing = listingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Listing not found"));

    // Check ownership
    if (!existing.getSellerEmail().equals(userDetails.getUsername())) {
      return ResponseEntity.status(403).build();
    }

    // Update fields
    existing.setTitle(updatedListing.getTitle());
    existing.setDescription(updatedListing.getDescription());
    existing.setCategory(updatedListing.getCategory());
    existing.setPrice(updatedListing.getPrice());
    if (updatedListing.getImages() != null) {
      existing.setImages(updatedListing.getImages());
    }

    Listing saved = listingRepository.save(existing);
    System.out.println("[SellerController] Updated listing " + id);

    return ResponseEntity.ok(saved);
  }
}