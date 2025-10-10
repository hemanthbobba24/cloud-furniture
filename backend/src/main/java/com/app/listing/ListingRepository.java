package com.app.listing;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ListingRepository extends MongoRepository<Listing, String> {
  // Very simple "search": contains in title or description (case-insensitive)
  List<Listing> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String t, String d);
  List<Listing> findBySellerEmail(String sellerEmail);
}
