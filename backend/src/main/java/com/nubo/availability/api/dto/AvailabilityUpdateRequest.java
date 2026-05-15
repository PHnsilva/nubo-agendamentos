package com.nubo.availability.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

public record AvailabilityUpdateRequest(@NotEmpty List<@Valid Block> blocks) {
  public record Block(
      @NotNull DayOfWeek dayOfWeek,
      @NotNull @JsonFormat(pattern = "HH:mm[:ss]") LocalTime startTime,
      @NotNull @JsonFormat(pattern = "HH:mm[:ss]") LocalTime endTime
  ) {
  }
}
