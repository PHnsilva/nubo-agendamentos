package com.nubo.catalog.api.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record ServiceOfferingResponse(
    UUID id,
    String name,
    String description,
    BigDecimal basePrice,
    int estimatedDurationMinutes
) {
}
