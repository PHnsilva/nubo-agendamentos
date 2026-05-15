package com.nubo.appointment.domain.model;

import com.nubo.appointment.domain.enums.AppointmentStatus;
import com.nubo.catalog.domain.model.ServiceOffering;
import com.nubo.identity.domain.model.User;
import com.nubo.provider.domain.model.ProviderProfile;
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
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "appointments")
public class Appointment {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "client_id", nullable = false)
  private User client;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "provider_profile_id", nullable = false)
  private ProviderProfile providerProfile;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "service_offering_id", nullable = false)
  private ServiceOffering serviceOffering;

  @Column(name = "scheduled_date", nullable = false)
  private LocalDate scheduledDate;

  @Column(name = "start_time", nullable = false)
  private LocalTime startTime;

  @Column(name = "end_time", nullable = false)
  private LocalTime endTime;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private AppointmentStatus status = AppointmentStatus.SOLICITADO;

  @Column(name = "client_note", columnDefinition = "text")
  private String clientNote;

  @Column(name = "provider_note", columnDefinition = "text")
  private String providerNote;

  @Column(name = "cancellation_reason", columnDefinition = "text")
  private String cancellationReason;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  protected Appointment() {
  }

  public Appointment(User client, ProviderProfile providerProfile, ServiceOffering serviceOffering, LocalDate scheduledDate, LocalTime startTime, LocalTime endTime, String clientNote) {
    this.client = client;
    this.providerProfile = providerProfile;
    this.serviceOffering = serviceOffering;
    this.scheduledDate = scheduledDate;
    this.startTime = startTime;
    this.endTime = endTime;
    this.clientNote = clientNote;
  }

  @PrePersist
  void prePersist() {
    createdAt = Instant.now();
    updatedAt = createdAt;
  }

  @PreUpdate
  void preUpdate() {
    updatedAt = Instant.now();
  }

  public void confirm() {
    this.status = AppointmentStatus.CONFIRMADO;
  }

  public void reject(String reason) {
    this.status = AppointmentStatus.RECUSADO;
    this.providerNote = reason;
  }

  public void cancel(String reason) {
    this.status = AppointmentStatus.CANCELADO;
    this.cancellationReason = reason;
  }

  public UUID getId() {
    return id;
  }

  public User getClient() {
    return client;
  }

  public ProviderProfile getProviderProfile() {
    return providerProfile;
  }

  public ServiceOffering getServiceOffering() {
    return serviceOffering;
  }

  public LocalDate getScheduledDate() {
    return scheduledDate;
  }

  public LocalTime getStartTime() {
    return startTime;
  }

  public LocalTime getEndTime() {
    return endTime;
  }

  public AppointmentStatus getStatus() {
    return status;
  }

  public String getClientNote() {
    return clientNote;
  }
}
