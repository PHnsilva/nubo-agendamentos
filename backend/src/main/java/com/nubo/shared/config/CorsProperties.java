package com.nubo.shared.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "nubo.cors")
public record CorsProperties(String allowedOrigins) {
}
