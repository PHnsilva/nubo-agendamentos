package com.nubo.provider.api.dto;

import com.nubo.provider.domain.enums.ProviderApplicationStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ProviderApplicationResponse(
    UUID id,
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
    List<String> portfolioImageUrls,
    ProviderApplicationStatus status,
    String reviewMessage,
    Instant reviewedAt,
    Instant createdAt
) {
}
