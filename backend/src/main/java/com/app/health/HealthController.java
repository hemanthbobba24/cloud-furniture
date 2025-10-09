package com.app.health;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class HealthController {
  @GetMapping("/api/v1/health")
  public Map<String, Object> health() {
    return Map.of("status", "OK", "service", "cloud-furniture-api");
  }
}
