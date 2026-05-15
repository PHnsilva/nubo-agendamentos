package com.nubo.provider.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;

public record ProviderApplicationRequest(
    @NotBlank String publicName,
    @NotBlank String contactPhone,
    @NotBlank String whatsapp,
    @NotBlank @Size(min = 30) String description,
    @NotBlank String city,
    @NotEmpty List<@NotBlank String> regions,
    @NotEmpty List<@NotBlank String> categories,
    @NotBlank String servicesDescription,
    @PositiveOrZero BigDecimal basePrice,
    String profileImageUrl,
    List<String> portfolioImageUrls
) {
}
