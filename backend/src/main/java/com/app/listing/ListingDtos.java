package com.app.listing;

import java.math.BigDecimal;
import java.util.List;

public class ListingDtos {
  public static class CreateReq {
    public String title;
    public String description;
    public BigDecimal price;
    public String category;
    public List<String> images;
  }
  public static class UpdateReq {
    public String title;
    public String description;
    public BigDecimal price;
    public String category;
    public List<String> images;
  }
}
