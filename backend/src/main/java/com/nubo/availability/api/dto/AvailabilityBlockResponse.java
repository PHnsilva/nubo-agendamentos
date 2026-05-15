package com.nubo.availability.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.UUID;

public record AvailabilityBlockResponse(
    UUID id,
    DayOfWeek dayOfWeek,
    @JsonFormat(pattern = "HH:mm") LocalTime startTime,
    @JsonFormat(pattern = "HH:mm") LocalTime endTime
) {
}
