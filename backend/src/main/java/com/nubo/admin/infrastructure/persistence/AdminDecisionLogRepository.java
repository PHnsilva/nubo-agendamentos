package com.nubo.admin.infrastructure.persistence;

import com.nubo.admin.domain.model.AdminDecisionLog;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminDecisionLogRepository extends JpaRepository<AdminDecisionLog, UUID> {
}
