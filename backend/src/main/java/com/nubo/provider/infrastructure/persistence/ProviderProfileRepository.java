package com.nubo.provider.infrastructure.persistence;

import com.nubo.provider.domain.model.ProviderProfile;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProviderProfileRepository extends JpaRepository<ProviderProfile, UUID> {
  Optional<ProviderProfile> findByUserId(UUID userId);

  Optional<ProviderProfile> findBySlug(String slug);

  List<ProviderProfile> findByActiveTrue();
}
