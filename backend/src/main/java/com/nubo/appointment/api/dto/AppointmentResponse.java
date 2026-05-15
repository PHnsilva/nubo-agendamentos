package com.nubo.appointment.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.nubo.appointment.domain.enums.AppointmentStatus;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record AppointmentResponse(
    UUID id,
    String providerPublicName,
    String clientName,
    String serviceName,
    LocalDate scheduledDate,
    @JsonFormat(pattern = "HH:mm") LocalTime startTime,
    @JsonFormat(pattern = "HH:mm") LocalTime endTime,
    AppointmentStatus status,
    String clientNote
) {
}
