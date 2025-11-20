package com.app.listing;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/listings")
@CrossOrigin(origins = "http://localhost:5173")
public class ListingController {

  private final ListingRepository listingRepository;

  public ListingController(ListingRepository listingRepository) {
    this.listingRepository = listingRepository;
  }

  // GET all listings (public)
  @GetMapping
  public ResponseEntity<List<Listing>> getAllListings() {
    List<Listing> listings = listingRepository.findAll();
    System.out.println("[ListingController] Returning " + listings.size() + " listings");
    return ResponseEntity.ok(listings);
  }

  // GET single listing (public)
  @GetMapping("/{id}")
  public ResponseEntity<Listing> getListingById(@PathVariable Long id) {
    Listing listing = listingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Listing not found"));
    return ResponseEntity.ok(listing);
  }

  // POST create listing - ADD THIS METHOD
  @PostMapping
  public ResponseEntity<Listing> createListing(
          @RequestBody Listing listing,
          @AuthenticationPrincipal UserDetails userDetails) {

    if (userDetails == null) {
      return ResponseEntity.status(401).build();
    }

    // Set the seller email from authenticated user
    listing.setSellerEmail(userDetails.getUsername());

    System.out.println("[ListingController] Creating listing: " + listing.getTitle() + " for " + userDetails.getUsername());

    Listing saved = listingRepository.save(listing);
    return ResponseEntity.ok(saved);
  }
}