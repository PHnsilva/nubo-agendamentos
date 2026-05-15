package com.nubo.provider.api.dto;

import com.nubo.availability.api.dto.AvailabilityBlockResponse;
import com.nubo.catalog.api.dto.ServiceOfferingResponse;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ProviderDetailResponse(
    UUID id,
    String publicName,
    String slug,
    String description,
    String city,
    List<String> regions,
    List<String> categories,
    BigDecimal ratingAverage,
    int ratingCount,
    String profileImageUrl,
    List<String> servicesPreview,
    BigDecimal basePriceFrom,
    String contactPhone,
    String whatsapp,
    List<String> portfolioImageUrls,
    List<ServiceOfferingResponse> services,
    List<AvailabilityBlockResponse> availability
) {
}
