package com.app.seller;

import com.app.listing.Listing;
import com.app.listing.ListingRepository;
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

  public SellerController(ListingRepository listingRepository) {
    this.listingRepository = listingRepository;
  }

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

  @DeleteMapping("/listings/{id}")
  public ResponseEntity<?> deleteListing(
          @PathVariable Long id,
          @AuthenticationPrincipal UserDetails userDetails) {

    if (userDetails == null) {
      return ResponseEntity.status(401).build();
    }

    Listing listing = listingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Listing not found"));

    if (!listing.getSellerEmail().equals(userDetails.getUsername())) {
      return ResponseEntity.status(403).body("Not authorized");
    }

    listingRepository.deleteById(id);
    return ResponseEntity.ok().build();
  }

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

    if (!existing.getSellerEmail().equals(userDetails.getUsername())) {
      return ResponseEntity.status(403).build();
    }

    existing.setTitle(updatedListing.getTitle());
    existing.setDescription(updatedListing.getDescription());
    existing.setCategory(updatedListing.getCategory());
    existing.setPrice(updatedListing.getPrice());

    if (updatedListing.getImages() != null) {
      existing.setImages(updatedListing.getImages());
    }

    Listing saved = listingRepository.save(existing);
    return ResponseEntity.ok(saved);
  }
}