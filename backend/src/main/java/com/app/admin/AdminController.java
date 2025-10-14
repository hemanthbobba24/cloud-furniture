package com.app.admin;

import com.app.listing.Listing;
import com.app.listing.ListingRepository;
import com.app.user.User;
import com.app.user.UserRepository;
import com.app.common.PageDto;
import org.springframework.data.domain.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
  private final ListingRepository listings;
  private final UserRepository users;

  public AdminController(ListingRepository listings, UserRepository users) {
    this.listings = listings; this.users = users;
  }

  @GetMapping("/stats")
  public StatsDto stats() {
    return new StatsDto(users.count(), listings.count());
  }

  @GetMapping("/listings")
  public PageDto<Listing> allListings(
      @RequestParam(required=false) String q,
      @RequestParam(defaultValue="0") int page,
      @RequestParam(defaultValue="10") int size,
      @RequestParam(required=false, name="sort") String sortParam
  ) {
    Sort sort = Sort.by("createdAt").descending();
    if (sortParam != null && !sortParam.isBlank()) {
      String[] p = sortParam.split(",",2);
      sort = (p.length>1 && "asc".equalsIgnoreCase(p[1])) ? Sort.by(p[0]).ascending() : Sort.by(p[0]).descending();
    }
    Pageable pb = PageRequest.of(Math.max(page,0), Math.max(size,1), sort);
    Page<Listing> res = (q == null || q.isBlank())
        ? listings.findAll(pb)
        : listings.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(q, q, pb);

    return new PageDto<>(res.getContent(), res.getNumber(), res.getSize(),
                         res.getTotalElements(), res.getTotalPages(), sortParam);
  }

  @DeleteMapping("/listings/{id}")
  public void deleteListing(@PathVariable String id) {
    listings.deleteById(id);
  }

  @GetMapping("/users")
  public Iterable<User> users() {
    return users.findAll();
  }

  public record StatsDto(long users, long listings) {}
}
