package com.app.listing;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "listings")
public class Listing {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  @Column(length = 2000)
  private String description;

  private String category;

  @Column(nullable = false)
  private BigDecimal price;

  @Column(nullable = false)
  private String sellerEmail;

  @ElementCollection
  @CollectionTable(name = "listing_images", joinColumns = @JoinColumn(name = "listing_id"))
  @Column(name = "image_url")
  private List<String> images = new ArrayList<>();

  // Default constructor
  public Listing() {}

  // Constructor with fields
  public Listing(String title, String description, String category, BigDecimal price, String sellerEmail) {
    this.title = title;
    this.description = description;
    this.category = category;
    this.price = price;
    this.sellerEmail = sellerEmail;
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public BigDecimal getPrice() {
    return price;
  }

  public void setPrice(BigDecimal price) {
    this.price = price;
  }

  public String getSellerEmail() {
    return sellerEmail;
  }

  public void setSellerEmail(String sellerEmail) {
    this.sellerEmail = sellerEmail;
  }

  public List<String> getImages() {
    return images;
  }

  public void setImages(List<String> images) {
    this.images = images;
  }
}
