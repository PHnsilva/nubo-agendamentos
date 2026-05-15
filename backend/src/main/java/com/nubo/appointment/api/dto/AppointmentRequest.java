package com.nubo.appointment.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record AppointmentRequest(
    @NotNull UUID providerId,
    @NotNull UUID serviceOfferingId,
    @NotNull LocalDate scheduledDate,
    @NotNull @JsonFormat(pattern = "HH:mm[:ss]") LocalTime startTime,
    String clientNote
) {
}
