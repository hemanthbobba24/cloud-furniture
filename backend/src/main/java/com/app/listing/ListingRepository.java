package com.app.listing;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, Long> {
  // Add this method:
  List<Listing> findBySellerEmail(String sellerEmail);
}