package com.app.seller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/seller")
public class SellerController {
  @GetMapping("/ping")
  @PreAuthorize("hasRole('SELLER')")
  public String ping() {
    return "seller-ok";
  }
}
