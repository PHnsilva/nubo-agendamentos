package com.nubo.provider.api.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ProviderSummaryResponse(
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
    BigDecimal basePriceFrom
) {
}
