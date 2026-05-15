package com.nubo.catalog.infrastructure.persistence;

import com.nubo.catalog.domain.model.ServiceOffering;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceOfferingRepository extends JpaRepository<ServiceOffering, UUID> {
  @EntityGraph(attributePaths = "category")
  List<ServiceOffering> findByProviderProfileIdAndActiveTrue(UUID providerProfileId);

  boolean existsByProviderProfileIdAndActiveTrue(UUID providerProfileId);

  @EntityGraph(attributePaths = {"category", "providerProfile"})
  Optional<ServiceOffering> findByIdAndProviderProfileIdAndActiveTrue(UUID id, UUID providerProfileId);
}
