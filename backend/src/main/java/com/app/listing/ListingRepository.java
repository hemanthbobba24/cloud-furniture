package com.app.listing;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ListingRepository extends MongoRepository<Listing, String> {
  // search helpers
  List<Listing> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String t, String d);
  Page<Listing> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String t, String d, Pageable pageable);

  // used by /api/v1/seller/my-listings
  List<Listing> findBySellerEmail(String sellerEmail);
}
