package com.app.listing;

import com.app.common.PageDto;
import org.springframework.data.domain.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/v1")
public class ListingController {
  private final ListingRepository repo;

  public ListingController(ListingRepository repo) { this.repo = repo; }

  @GetMapping("/listings")
  public PageDto<Listing> search(
      @RequestParam(required=false) String q,
      @RequestParam(defaultValue="0") int page,
      @RequestParam(defaultValue="10") int size,
      @RequestParam(required=false, name="sort") String sortParam
  ){
    Sort sort = Sort.by("createdAt").descending();
    if (sortParam != null && !sortParam.isBlank()) {
      String[] p = sortParam.split(",",2);
      sort = (p.length>1 && "asc".equalsIgnoreCase(p[1]))
          ? Sort.by(p[0]).ascending() : Sort.by(p[0]).descending();
    }
    Pageable pb = PageRequest.of(Math.max(page,0), Math.max(size,1), sort);
    Page<Listing> res = (q==null || q.isBlank())
        ? repo.findAll(pb)
        : repo.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(q, q, pb);
    return new PageDto<>(res.getContent(), res.getNumber(), res.getSize(),
        res.getTotalElements(), res.getTotalPages(), sortParam);
  }

  @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
  @PostMapping("/listings")
  public Listing create(@RequestBody Listing in) {
    String email = currentEmail();
    in.setId(null);
    in.setSellerEmail(email);
    in.setCreatedAt(Instant.now());
    in.setUpdatedAt(Instant.now());     // <-- set updatedAt on create
    return repo.save(in);
  }

  @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
  @GetMapping("/seller/listings")
  public PageDto<Listing> myListings(
      @RequestParam(defaultValue="0") int page,
      @RequestParam(defaultValue="10") int size,
      @RequestParam(required=false, name="sort") String sortParam
  ){
    Sort sort = Sort.by("createdAt").descending();
    if (sortParam != null && !sortParam.isBlank()) {
      String[] p = sortParam.split(",",2);
      sort = (p.length>1 && "asc".equalsIgnoreCase(p[1]))
          ? Sort.by(p[0]).ascending() : Sort.by(p[0]).descending();
    }
    Pageable pb = PageRequest.of(Math.max(page,0), Math.max(size,1), sort);
    Page<Listing> res = repo.findBySellerEmail(currentEmail(), pb);
    return new PageDto<>(res.getContent(), res.getNumber(), res.getSize(),
        res.getTotalElements(), res.getTotalPages(), sortParam);
  }

  @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
  @GetMapping("/listings/{id}")
  public Listing getOne(@PathVariable String id) {
    return repo.findById(id).orElseThrow();
  }

  @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
  @PutMapping("/listings/{id}")
  public Listing update(@PathVariable String id, @RequestBody Listing in) {
    Listing existing = repo.findById(id).orElseThrow();
    requireOwnerOrAdmin(existing);
    existing.setTitle(in.getTitle());
    existing.setDescription(in.getDescription());
    existing.setCategory(in.getCategory());
    existing.setPrice(in.getPrice());
    existing.setImages(in.getImages());
    existing.setUpdatedAt(Instant.now());  // <-- set updatedAt on update
    return repo.save(existing);
  }

  @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
  @DeleteMapping("/listings/{id}")
  public void delete(@PathVariable String id) {
    Listing existing = repo.findById(id).orElseThrow();
    requireOwnerOrAdmin(existing);
    repo.deleteById(id);
  }

  private String currentEmail() {
    Authentication a = SecurityContextHolder.getContext().getAuthentication();
    return a.getName();
  }

  private void requireOwnerOrAdmin(Listing l) {
    Authentication a = SecurityContextHolder.getContext().getAuthentication();
    boolean isAdmin = a.getAuthorities().stream().anyMatch(ga -> ga.getAuthority().equals("ROLE_ADMIN"));
    if (!isAdmin && !l.getSellerEmail().equalsIgnoreCase(a.getName())) {
      throw new RuntimeException("Forbidden");
    }
  }
}
