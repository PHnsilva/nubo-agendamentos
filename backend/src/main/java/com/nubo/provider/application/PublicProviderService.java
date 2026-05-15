package com.nubo.provider.application;

import com.nubo.availability.api.dto.AvailabilityBlockResponse;
import com.nubo.availability.domain.model.AvailabilityBlock;
import com.nubo.availability.infrastructure.persistence.AvailabilityBlockRepository;
import com.nubo.catalog.api.dto.ServiceOfferingResponse;
import com.nubo.catalog.domain.model.ServiceOffering;
import com.nubo.catalog.infrastructure.persistence.ServiceOfferingRepository;
import com.nubo.provider.api.dto.ProviderDetailResponse;
import com.nubo.provider.api.dto.ProviderSummaryResponse;
import com.nubo.provider.domain.model.ProviderProfile;
import com.nubo.provider.infrastructure.persistence.ProviderProfileRepository;
import com.nubo.shared.api.PageResponse;
import com.nubo.shared.error.BadRequestException;
import com.nubo.shared.error.ResourceNotFoundException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PublicProviderService {
  private final ProviderProfileRepository profiles;
  private final ServiceOfferingRepository services;
  private final AvailabilityBlockRepository availability;

  public PublicProviderService(
      ProviderProfileRepository profiles,
      ServiceOfferingRepository services,
      AvailabilityBlockRepository availability
  ) {
    this.profiles = profiles;
    this.services = services;
    this.availability = availability;
  }

  @Transactional(readOnly = true)
  public PageResponse<ProviderSummaryResponse> search(
      String city,
      String region,
      String category,
      String service,
      BigDecimal minRating,
      BigDecimal minPrice,
      BigDecimal maxPrice,
      String availableDate,
      int page,
      int size
  ) {
    int safePage = Math.max(page, 0);
    int safeSize = Math.max(1, Math.min(size <= 0 ? 12 : size, 50));

    List<ProviderSummaryResponse> filtered = profiles.findByActiveTrue().stream()
        .filter(profile -> !profile.getRegions().isEmpty())
        .filter(profile -> matchesText(profile.getCity(), city))
        .filter(profile -> region == null || profile.getRegions().stream().anyMatch(value -> matchesText(value, region)))
        .filter(profile -> matchesRating(profile, minRating))
        .filter(profile -> matchesAvailability(profile, availableDate))
        .map(profile -> toSummary(profile, activeServices(profile)))
        .filter(summary -> !summary.servicesPreview().isEmpty())
        .filter(summary -> category == null || summary.categories().stream().anyMatch(value -> matchesText(value, category)))
        .filter(summary -> service == null || summary.servicesPreview().stream().anyMatch(value -> matchesText(value, service)))
        .filter(summary -> minPrice == null || summary.basePriceFrom().compareTo(minPrice) >= 0)
        .filter(summary -> maxPrice == null || summary.basePriceFrom().compareTo(maxPrice) <= 0)
        .sorted(Comparator.comparing(ProviderSummaryResponse::ratingAverage).reversed())
        .toList();

    int from = Math.min(safePage * safeSize, filtered.size());
    int to = Math.min(from + safeSize, filtered.size());
    return PageResponse.of(filtered.subList(from, to), safePage, safeSize, filtered.size());
  }

  @Transactional(readOnly = true)
  public ProviderDetailResponse detail(String idOrSlug) {
    ProviderProfile profile = findByIdOrSlug(idOrSlug);
    List<ServiceOffering> activeServices = activeServices(profile);
    if (!profile.isActive() || activeServices.isEmpty() || profile.getRegions().isEmpty()) {
      throw new ResourceNotFoundException("Prestador não encontrado.");
    }
    ProviderSummaryResponse summary = toSummary(profile, activeServices);
    return new ProviderDetailResponse(
        summary.id(),
        summary.publicName(),
        summary.slug(),
        summary.description(),
        summary.city(),
        summary.regions(),
        summary.categories(),
        summary.ratingAverage(),
        summary.ratingCount(),
        summary.profileImageUrl(),
        summary.servicesPreview(),
        summary.basePriceFrom(),
        profile.getContactPhone(),
        profile.getWhatsapp(),
        List.copyOf(profile.getPortfolioImageUrls()),
        activeServices.stream().map(this::toServiceResponse).toList(),
        availability.findByProviderProfileIdAndActiveTrue(profile.getId()).stream().map(this::toAvailabilityResponse).toList()
    );
  }

  public ServiceOfferingResponse toServiceResponse(ServiceOffering service) {
    return new ServiceOfferingResponse(
        service.getId(),
        service.getName(),
        service.getDescription(),
        service.getBasePrice(),
        service.getEstimatedDurationMinutes()
    );
  }

  public AvailabilityBlockResponse toAvailabilityResponse(AvailabilityBlock block) {
    return new AvailabilityBlockResponse(block.getId(), block.getDayOfWeek(), block.getStartTime(), block.getEndTime());
  }

  private ProviderProfile findByIdOrSlug(String idOrSlug) {
    try {
      return profiles.findById(UUID.fromString(idOrSlug))
          .orElseThrow(() -> new ResourceNotFoundException("Prestador não encontrado."));
    } catch (IllegalArgumentException ignored) {
      return profiles.findBySlug(idOrSlug)
          .orElseThrow(() -> new ResourceNotFoundException("Prestador não encontrado."));
    }
  }

  private ProviderSummaryResponse toSummary(ProviderProfile profile, List<ServiceOffering> activeServices) {
    List<String> categories = activeServices.stream()
        .map(service -> service.getCategory().getName())
        .distinct()
        .toList();
    List<String> preview = activeServices.stream()
        .map(ServiceOffering::getName)
        .limit(3)
        .toList();
    BigDecimal basePriceFrom = activeServices.stream()
        .map(ServiceOffering::getBasePrice)
        .min(BigDecimal::compareTo)
        .orElse(BigDecimal.ZERO);
    return new ProviderSummaryResponse(
        profile.getId(),
        profile.getPublicName(),
        profile.getSlug(),
        profile.getDescription(),
        profile.getCity(),
        List.copyOf(profile.getRegions()),
        categories,
        profile.getRatingAverage(),
        profile.getRatingCount(),
        profile.getProfileImageUrl(),
        preview,
        basePriceFrom
    );
  }

  private List<ServiceOffering> activeServices(ProviderProfile profile) {
    return services.findByProviderProfileIdAndActiveTrue(profile.getId());
  }

  private boolean matchesText(String value, String expected) {
    if (expected == null || expected.isBlank()) return true;
    return value != null && value.toLowerCase(Locale.ROOT).contains(expected.toLowerCase(Locale.ROOT));
  }

  private boolean matchesRating(ProviderProfile profile, BigDecimal minRating) {
    return minRating == null || profile.getRatingAverage().compareTo(minRating) >= 0;
  }

  private boolean matchesAvailability(ProviderProfile profile, String availableDate) {
    if (availableDate == null || availableDate.isBlank()) return true;
    LocalDate date;
    try {
      date = LocalDate.parse(availableDate);
    } catch (DateTimeParseException exception) {
      throw new BadRequestException("Data de disponibilidade inválida. Use o formato AAAA-MM-DD.");
    }
    return availability.findByProviderProfileIdAndActiveTrue(profile.getId()).stream()
        .anyMatch(block -> block.getDayOfWeek() == date.getDayOfWeek());
  }
}
