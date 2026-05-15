package com.nubo.catalog.domain.model;

import com.nubo.provider.domain.model.ProviderProfile;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "service_offerings")
public class ServiceOffering {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "provider_profile_id", nullable = false)
  private ProviderProfile providerProfile;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "category_id", nullable = false)
  private Category category;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false, columnDefinition = "text")
  private String description;

  @Column(name = "base_price", nullable = false)
  private BigDecimal basePrice;

  @Column(name = "estimated_duration_minutes", nullable = false)
  private int estimatedDurationMinutes;

  @Column(nullable = false)
  private boolean active = true;

  protected ServiceOffering() {
  }

  public ServiceOffering(ProviderProfile providerProfile, Category category, String name, String description, BigDecimal basePrice, int estimatedDurationMinutes) {
    this.providerProfile = providerProfile;
    this.category = category;
    this.name = name;
    this.description = description;
    this.basePrice = basePrice;
    this.estimatedDurationMinutes = estimatedDurationMinutes;
  }

  public UUID getId() {
    return id;
  }

  public ProviderProfile getProviderProfile() {
    return providerProfile;
  }

  public Category getCategory() {
    return category;
  }

  public String getName() {
    return name;
  }

  public String getDescription() {
    return description;
  }

  public BigDecimal getBasePrice() {
    return basePrice;
  }

  public int getEstimatedDurationMinutes() {
    return estimatedDurationMinutes;
  }

  public boolean isActive() {
    return active;
  }
}
