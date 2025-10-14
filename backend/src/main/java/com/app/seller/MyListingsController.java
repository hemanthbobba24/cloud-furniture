package com.app.seller;

import com.app.listing.Listing;
import com.app.listing.ListingRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/seller")
public class MyListingsController {
  private final ListingRepository repo;
  public MyListingsController(ListingRepository repo){ this.repo = repo; }

  @GetMapping("/my-listings")
  @PreAuthorize("hasRole('SELLER')")
  public List<Listing> myListings(@AuthenticationPrincipal UserDetails user){
    return repo.findBySellerEmail(user.getUsername());
  }
}
