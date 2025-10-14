package com.app.listing;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import com.app.common.PageDto;

@RestController
@RequestMapping("/api/v1/listings")
public class ListingController {
  private final ListingService svc;
  private final ListingRepository repo;
  public ListingController(ListingService s, ListingRepository r){ this.svc=s; this.repo=r; }

  // Public browse/search with pagination & sort
  @GetMapping
  public PageDto<Listing> search(
      @RequestParam(required=false) String q,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(required=false, name="sort") String sortParam
  ){
    // sortParam like: "price,asc" or "createdAt,desc"
    Sort sort = null;
    if (sortParam != null && !sortParam.isBlank()){
      String[] parts = sortParam.split(",", 2);
      String field = parts[0].trim();
      String dir = parts.length>1 ? parts[1].trim().toLowerCase() : "asc";
      sort = "desc".equals(dir) ? Sort.by(field).descending() : Sort.by(field).ascending();
    }
    Page<Listing> pageRes = svc.search(q, page, size, sort);
    return new PageDto<>(
      pageRes.getContent(),
      pageRes.getNumber(),
      pageRes.getSize(),
      pageRes.getTotalElements(),
      pageRes.getTotalPages(),
      sortParam
    );
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
