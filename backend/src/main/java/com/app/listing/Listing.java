package com.app.listing;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "listings")
public class Listing {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String title;
  private String description;
  private String category;
  private Double price;

  // THIS IS IMPORTANT - make sure you have this field
  private String sellerEmail;

  @ElementCollection
  private List<String> images;

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public String getCategory() { return category; }
  public void setCategory(String category) { this.category = category; }

  public Double getPrice() { return price; }
  public void setPrice(Double price) { this.price = price; }

  public String getSellerEmail() { return sellerEmail; }
  public void setSellerEmail(String sellerEmail) { this.sellerEmail = sellerEmail; }

  public List<String> getImages() { return images; }
  public void setImages(List<String> images) { this.images = images; }
}