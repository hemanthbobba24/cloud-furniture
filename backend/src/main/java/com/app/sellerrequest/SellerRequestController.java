package com.app.sellerrequest;

import com.app.user.User;
import com.app.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/seller-request")
@CrossOrigin(origins = "http://localhost:5173")
public class SellerRequestController {

    private final SellerRequestRepository requestRepository;
    private final UserRepository userRepository;

    public SellerRequestController(SellerRequestRepository requestRepository,
                                   UserRepository userRepository) {
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
    }

    // User submits seller request
    @PostMapping("/submit")
    public ResponseEntity<?> submitRequest(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if already a seller
        if (!"USER".equals(user.getRole().name())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "You are already a seller or admin"));
        }

        // Check if already has pending request
        if (requestRepository.existsByUserIdAndStatus(user.getId(), RequestStatus.PENDING)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "You already have a pending seller request"));
        }

        String message = body.getOrDefault("message", "");

        SellerRequest request = new SellerRequest(user.getId(), user.getEmail(), message);
        requestRepository.save(request);

        System.out.println("[SellerRequest] New request from: " + email);
        return ResponseEntity.ok(Map.of("message", "Seller request submitted successfully"));
    }

    // User checks their request status
    @GetMapping("/my-status")
    public ResponseEntity<?> getMyStatus(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        var pendingRequest = requestRepository.findByUserIdAndStatus(user.getId(), RequestStatus.PENDING);

        return ResponseEntity.ok(Map.of(
                "hasPendingRequest", pendingRequest.isPresent(),
                "currentRole", user.getRole().name()
        ));
    }
}