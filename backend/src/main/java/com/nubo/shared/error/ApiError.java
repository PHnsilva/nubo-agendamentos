package com.nubo.shared.error;

import java.time.Instant;
import java.util.List;

public record ApiError(
    Instant timestamp,
    int status,
    String error,
    String message,
    String path,
    List<FieldViolation> details
) {
  public static ApiError of(int status, String error, String message, String path, List<FieldViolation> details) {
    return new ApiError(Instant.now(), status, error, message, path, details);
  }
}
