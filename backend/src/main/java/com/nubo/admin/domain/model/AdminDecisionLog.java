package com.nubo.admin.domain.model;

import com.nubo.admin.domain.enums.AdminAction;
import com.nubo.identity.domain.model.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "admin_decision_logs")
public class AdminDecisionLog {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "actor_id", nullable = false)
  private User actor;

  @Column(name = "target_type", nullable = false)
  private String targetType;

  @Column(name = "target_id", nullable = false)
  private UUID targetId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private AdminAction action;

  @Column(columnDefinition = "text")
  private String message;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  protected AdminDecisionLog() {
  }

  public AdminDecisionLog(User actor, String targetType, UUID targetId, AdminAction action, String message) {
    this.actor = actor;
    this.targetType = targetType;
    this.targetId = targetId;
    this.action = action;
    this.message = message;
  }

  @PrePersist
  void prePersist() {
    createdAt = Instant.now();
  }
}
