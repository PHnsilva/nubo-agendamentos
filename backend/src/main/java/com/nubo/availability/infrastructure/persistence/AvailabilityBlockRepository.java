package com.nubo.availability.infrastructure.persistence;

import com.nubo.availability.domain.model.AvailabilityBlock;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AvailabilityBlockRepository extends JpaRepository<AvailabilityBlock, UUID> {
  List<AvailabilityBlock> findByProviderProfileIdAndActiveTrue(UUID providerProfileId);

  void deleteByProviderProfileId(UUID providerProfileId);
}
