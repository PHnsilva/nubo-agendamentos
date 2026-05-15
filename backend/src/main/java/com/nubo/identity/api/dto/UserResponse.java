package com.nubo.identity.api.dto;

import com.nubo.identity.domain.enums.Role;
import java.util.UUID;

public record UserResponse(UUID id, String name, String email, Role role) {
}
