package com.app.listing;

import com.app.user.Role;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.time.Instant;

@Service
public class ListingService {
  private final ListingRepository repo;

  public ListingService(ListingRepository repo) { this.repo = repo; }

  public Listing create(ListingDtos.CreateReq req){
    String email = currentEmail();
    Listing l = new Listing();
    l.setTitle(req.title);
    l.setDescription(req.description);
    l.setPrice(req.price);
    l.setCategory(req.category);
    l.setImages(req.images);
    l.setSellerEmail(email);
    return repo.save(l);
  }

  public Listing update(String id, ListingDtos.UpdateReq req){
    Listing l = repo.findById(id).orElseThrow(() -> new RuntimeException("Listing not found"));
    checkOwnershipOrAdmin(l.getSellerEmail());
    if(req.title != null) l.setTitle(req.title);
    if(req.description != null) l.setDescription(req.description);
    if(req.price != null) l.setPrice(req.price);
    if(req.category != null) l.setCategory(req.category);
    if(req.images != null) l.setImages(req.images);
    l.setUpdatedAt(Instant.now());
    return repo.save(l);
  }

  public void delete(String id){
    Listing l = repo.findById(id).orElseThrow(() -> new RuntimeException("Listing not found"));
    checkOwnershipOrAdmin(l.getSellerEmail());
    repo.deleteById(id);
  }

  public Page<Listing> search(String q, int page, int size, Sort sort){
    Pageable pb = PageRequest.of(Math.max(0,page), Math.max(1,size),
        (sort == null) ? Sort.by("createdAt").descending() : sort);
    if(q == null || q.isBlank()) {
      return repo.findAll(pb);
    }
    return repo.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(q, q, pb);
  }

  private static String currentEmail(){
    Authentication a = SecurityContextHolder.getContext().getAuthentication();
    if(a == null) throw new RuntimeException("Unauthenticated");
    return a.getName();
  }

  private static void checkOwnershipOrAdmin(String ownerEmail){
    Authentication a = SecurityContextHolder.getContext().getAuthentication();
    boolean isAdmin = a.getAuthorities().stream().anyMatch(ga -> ga.getAuthority().equals("ROLE_"+Role.ADMIN.name()));
    if(isAdmin) return;
    if(!a.getName().equals(ownerEmail)) throw new RuntimeException("Forbidden: not your listing");
  }
}
