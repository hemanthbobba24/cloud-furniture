package com.app.listing;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Document(collection = "listings")
public class Listing {
  @Id private String id;
  private String title;
  private String description;
  private BigDecimal price;
  private String category;
  private List<String> images;   // S3 URLs later
  private String sellerEmail;    // owner
  private Instant createdAt = Instant.now();
  private Instant updatedAt = Instant.now();

  // getters/setters
  public String getId(){return id;} public void setId(String id){this.id=id;}
  public String getTitle(){return title;} public void setTitle(String t){this.title=t;}
  public String getDescription(){return description;} public void setDescription(String d){this.description=d;}
  public BigDecimal getPrice(){return price;} public void setPrice(BigDecimal p){this.price=p;}
  public String getCategory(){return category;} public void setCategory(String c){this.category=c;}
  public List<String> getImages(){return images;} public void setImages(List<String> i){this.images=i;}
  public String getSellerEmail(){return sellerEmail;} public void setSellerEmail(String e){this.sellerEmail=e;}
  public Instant getCreatedAt(){return createdAt;} public void setCreatedAt(Instant t){this.createdAt=t;}
  public Instant getUpdatedAt(){return updatedAt;} public void setUpdatedAt(Instant t){this.updatedAt=t;}
}
