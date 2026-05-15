package com.nubo.provider.domain.model;

import com.nubo.identity.domain.model.User;
import com.nubo.provider.domain.enums.ProviderApplicationStatus;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
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
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "provider_applications")
public class ProviderApplication {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(name = "public_name", nullable = false)
  private String publicName;

  @Column(name = "contact_phone", nullable = false)
  private String contactPhone;

  @Column(nullable = false)
  private String whatsapp;

  @Column(nullable = false, columnDefinition = "text")
  private String description;

  @Column(nullable = false)
  private String city;

  @ElementCollection
  @CollectionTable(name = "provider_application_regions", joinColumns = @JoinColumn(name = "application_id"))
  @Column(name = "region", nullable = false)
  private List<String> regions = new ArrayList<>();

  @ElementCollection
  @CollectionTable(name = "provider_application_categories", joinColumns = @JoinColumn(name = "application_id"))
  @Column(name = "category", nullable = false)
  private List<String> categories = new ArrayList<>();

  @Column(name = "services_description", nullable = false, columnDefinition = "text")
  private String servicesDescription;

  @Column(name = "base_price")
  private BigDecimal basePrice;

  @Column(name = "profile_image_url")
  private String profileImageUrl;

  @ElementCollection
  @CollectionTable(name = "provider_application_portfolio_images", joinColumns = @JoinColumn(name = "application_id"))
  @Column(name = "image_url", nullable = false)
  private List<String> portfolioImageUrls = new ArrayList<>();

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private ProviderApplicationStatus status = ProviderApplicationStatus.PENDENTE;

  @Column(name = "review_message", columnDefinition = "text")
  private String reviewMessage;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "reviewed_by_id")
  private User reviewedBy;

  @Column(name = "reviewed_at")
  private Instant reviewedAt;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  protected ProviderApplication() {
  }

  public ProviderApplication(
      User user,
      String publicName,
      String contactPhone,
      String whatsapp,
      String description,
      String city,
      List<String> regions,
      List<String> categories,
      String servicesDescription,
      BigDecimal basePrice,
      String profileImageUrl,
      List<String> portfolioImageUrls
  ) {
    this.user = user;
    this.publicName = publicName;
    this.contactPhone = contactPhone;
    this.whatsapp = whatsapp;
    this.description = description;
    this.city = city;
    this.regions = new ArrayList<>(regions);
    this.categories = new ArrayList<>(categories);
    this.servicesDescription = servicesDescription;
    this.basePrice = basePrice;
    this.profileImageUrl = profileImageUrl;
    this.portfolioImageUrls = new ArrayList<>(portfolioImageUrls);
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

  public void approve(User actor, String message) {
    this.status = ProviderApplicationStatus.APROVADO;
    this.reviewMessage = message;
    this.reviewedBy = actor;
    this.reviewedAt = Instant.now();
  }

  public void reject(User actor, String message) {
    this.status = ProviderApplicationStatus.REJEITADO;
    this.reviewMessage = message;
    this.reviewedBy = actor;
    this.reviewedAt = Instant.now();
  }

  public void requestChanges(User actor, String message) {
    this.status = ProviderApplicationStatus.AJUSTE_SOLICITADO;
    this.reviewMessage = message;
    this.reviewedBy = actor;
    this.reviewedAt = Instant.now();
  }

  public UUID getId() {
    return id;
  }

  public User getUser() {
    return user;
  }

  public String getPublicName() {
    return publicName;
  }

  public String getContactPhone() {
    return contactPhone;
  }

  public String getWhatsapp() {
    return whatsapp;
  }

  public String getDescription() {
    return description;
  }

  public String getCity() {
    return city;
  }

  public List<String> getRegions() {
    return regions;
  }

  public List<String> getCategories() {
    return categories;
  }

  public String getServicesDescription() {
    return servicesDescription;
  }

  public BigDecimal getBasePrice() {
    return basePrice;
  }

  public String getProfileImageUrl() {
    return profileImageUrl;
  }

  public List<String> getPortfolioImageUrls() {
    return portfolioImageUrls;
  }

  public ProviderApplicationStatus getStatus() {
    return status;
  }

  public String getReviewMessage() {
    return reviewMessage;
  }

  public Instant getReviewedAt() {
    return reviewedAt;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
