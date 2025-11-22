package com.app.sellerrequest;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SellerRequestRepository extends JpaRepository<SellerRequest, Long> {
    List<SellerRequest> findByStatus(RequestStatus status);
    Optional<SellerRequest> findByUserIdAndStatus(Long userId, RequestStatus status);
    boolean existsByUserIdAndStatus(Long userId, RequestStatus status);
}