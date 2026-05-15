package com.nubo.provider.domain.model;

import com.nubo.identity.domain.model.User;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "provider_profiles")
public class ProviderProfile {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @OneToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false, unique = true)
  private User user;

  @Column(name = "public_name", nullable = false)
  private String publicName;

  @Column(nullable = false, unique = true)
  private String slug;

  @Column(nullable = false, columnDefinition = "text")
  private String description;

  @Column(name = "contact_phone", nullable = false)
  private String contactPhone;

  @Column(nullable = false)
  private String whatsapp;

  @Column(nullable = false)
  private String city;

  @ElementCollection
  @CollectionTable(name = "provider_profile_regions", joinColumns = @JoinColumn(name = "profile_id"))
  @Column(name = "region", nullable = false)
  private List<String> regions = new ArrayList<>();

  @Column(name = "profile_image_url")
  private String profileImageUrl;

  @ElementCollection
  @CollectionTable(name = "provider_profile_portfolio_images", joinColumns = @JoinColumn(name = "profile_id"))
  @Column(name = "image_url", nullable = false)
  private List<String> portfolioImageUrls = new ArrayList<>();

  @Column(nullable = false)
  private boolean active = true;

  @Column(name = "rating_average", nullable = false)
  private BigDecimal ratingAverage = BigDecimal.ZERO;

  @Column(name = "rating_count", nullable = false)
  private int ratingCount = 0;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  protected ProviderProfile() {
  }

  public ProviderProfile(ProviderApplication application, String slug) {
    this.user = application.getUser();
    this.publicName = application.getPublicName();
    this.slug = slug;
    this.description = application.getDescription();
    this.contactPhone = application.getContactPhone();
    this.whatsapp = application.getWhatsapp();
    this.city = application.getCity();
    this.regions = new ArrayList<>(application.getRegions());
    this.profileImageUrl = application.getProfileImageUrl();
    this.portfolioImageUrls = new ArrayList<>(application.getPortfolioImageUrls());
    this.active = true;
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

  public void syncFrom(ProviderApplication application) {
    this.publicName = application.getPublicName();
    this.description = application.getDescription();
    this.contactPhone = application.getContactPhone();
    this.whatsapp = application.getWhatsapp();
    this.city = application.getCity();
    this.regions = new ArrayList<>(application.getRegions());
    this.profileImageUrl = application.getProfileImageUrl();
    this.portfolioImageUrls = new ArrayList<>(application.getPortfolioImageUrls());
    this.active = true;
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

  public String getSlug() {
    return slug;
  }

  public String getDescription() {
    return description;
  }

  public String getContactPhone() {
    return contactPhone;
  }

  public String getWhatsapp() {
    return whatsapp;
  }

  public String getCity() {
    return city;
  }

  public List<String> getRegions() {
    return regions;
  }

  public String getProfileImageUrl() {
    return profileImageUrl;
  }

  public List<String> getPortfolioImageUrls() {
    return portfolioImageUrls;
  }

  public boolean isActive() {
    return active;
  }

  public BigDecimal getRatingAverage() {
    return ratingAverage;
  }

  public int getRatingCount() {
    return ratingCount;
  }

  public void setSeedRating(BigDecimal ratingAverage, int ratingCount) {
    this.ratingAverage = ratingAverage;
    this.ratingCount = ratingCount;
  }
}
