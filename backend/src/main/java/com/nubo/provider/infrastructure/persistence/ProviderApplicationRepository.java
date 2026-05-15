package com.nubo.provider.infrastructure.persistence;

import com.nubo.provider.domain.enums.ProviderApplicationStatus;
import com.nubo.provider.domain.model.ProviderApplication;
import java.util.Collection;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProviderApplicationRepository extends JpaRepository<ProviderApplication, UUID> {
  Optional<ProviderApplication> findFirstByUserIdOrderByCreatedAtDesc(UUID userId);

  boolean existsByUserIdAndStatusIn(UUID userId, Collection<ProviderApplicationStatus> statuses);

  Page<ProviderApplication> findByStatus(ProviderApplicationStatus status, Pageable pageable);
}
