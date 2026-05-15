package com.nubo.catalog.api.dto;

import java.util.UUID;

public record CategoryResponse(UUID id, String name, String slug) {
}
