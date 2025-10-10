package com.app.listing;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/listings")
public class ListingController {
  private final ListingService svc;
  private final ListingRepository repo;
  public ListingController(ListingService s, ListingRepository r){ this.svc=s; this.repo=r; }

  // Public browse/search
  @GetMapping
  public List<Listing> search(@RequestParam(required=false) String q){
    return svc.search(q);
  }

  @GetMapping("/{id}")
  public Listing get(@PathVariable String id){
    return repo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
  }

  // Seller-only actions
  @PostMapping
  @PreAuthorize("hasRole('SELLER')")
  public Listing create(@RequestBody ListingDtos.CreateReq req){
    return svc.create(req);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('SELLER')")
  public Listing update(@PathVariable String id, @RequestBody ListingDtos.UpdateReq req){
    return svc.update(id, req);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('SELLER')")
  public void delete(@PathVariable String id){
    svc.delete(id);
  }
}
