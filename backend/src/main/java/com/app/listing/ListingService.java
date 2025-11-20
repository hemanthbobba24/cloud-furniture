package com.app.listing;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
public class ListingService {

  private final ListingRepository listingRepository;

  public ListingService(ListingRepository listingRepository) {
    this.listingRepository = listingRepository;
  }

  public List<Listing> getAllListings() {
    return listingRepository.findAll();
  }

  public Listing getListingById(Long id) {
    return listingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Listing not found"));
  }

  public Listing createListing(Listing listing) {
    // Remove any setUpdatedAt or setCreatedAt calls
    return listingRepository.save(listing);
  }

  public Listing updateListing(Long id, Listing updatedListing) {
    Listing existing = getListingById(id);

    existing.setTitle(updatedListing.getTitle());
    existing.setDescription(updatedListing.getDescription());
    existing.setCategory(updatedListing.getCategory());
    existing.setPrice(updatedListing.getPrice());

    if (updatedListing.getImages() != null) {
      existing.setImages(updatedListing.getImages());
    }

    return listingRepository.save(existing);
  }

  public void deleteListing(Long id) {
    listingRepository.deleteById(id);
  }

  public List<Listing> getListingsBySellerEmail(String email) {
    return listingRepository.findBySellerEmail(email);
  }
}
