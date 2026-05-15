package com.nubo.identity.application;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "nubo.jwt")
public record JwtProperties(String secret, long expirationMinutes) {
}
