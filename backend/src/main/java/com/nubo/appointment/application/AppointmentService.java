package com.nubo.appointment.application;

import com.nubo.appointment.api.dto.AppointmentDecisionRequest;
import com.nubo.appointment.api.dto.AppointmentRequest;
import com.nubo.appointment.api.dto.AppointmentResponse;
import com.nubo.appointment.domain.enums.AppointmentStatus;
import com.nubo.appointment.domain.model.Appointment;
import com.nubo.appointment.infrastructure.persistence.AppointmentRepository;
import com.nubo.availability.infrastructure.persistence.AvailabilityBlockRepository;
import com.nubo.catalog.domain.model.ServiceOffering;
import com.nubo.catalog.infrastructure.persistence.ServiceOfferingRepository;
import com.nubo.identity.application.CurrentUserService;
import com.nubo.identity.domain.enums.Role;
import com.nubo.identity.domain.model.User;
import com.nubo.provider.domain.model.ProviderProfile;
import com.nubo.provider.infrastructure.persistence.ProviderProfileRepository;
import com.nubo.shared.error.BadRequestException;
import com.nubo.shared.error.ForbiddenOperationException;
import com.nubo.shared.error.ResourceNotFoundException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AppointmentService {
  private final AppointmentRepository appointments;
  private final ProviderProfileRepository profiles;
  private final ServiceOfferingRepository services;
  private final AvailabilityBlockRepository availability;
  private final CurrentUserService currentUserService;

  public AppointmentService(
      AppointmentRepository appointments,
      ProviderProfileRepository profiles,
      ServiceOfferingRepository services,
      AvailabilityBlockRepository availability,
      CurrentUserService currentUserService
  ) {
    this.appointments = appointments;
    this.profiles = profiles;
    this.services = services;
    this.availability = availability;
    this.currentUserService = currentUserService;
  }

  @Transactional
  public AppointmentResponse request(AppointmentRequest request) {
    User client = currentUserService.get();
    ProviderProfile profile = profiles.findById(request.providerId())
        .filter(ProviderProfile::isActive)
        .orElseThrow(() -> new ResourceNotFoundException("Prestador não encontrado."));
    ServiceOffering service = services.findByIdAndProviderProfileIdAndActiveTrue(request.serviceOfferingId(), profile.getId())
        .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado para este prestador."));
    LocalTime endTime = request.startTime().plusMinutes(service.getEstimatedDurationMinutes());
    validateRequestedSlot(profile, request, endTime);
    Appointment appointment = appointments.save(new Appointment(
        client,
        profile,
        service,
        request.scheduledDate(),
        request.startTime(),
        endTime,
        request.clientNote()
    ));
    return toResponse(appointment);
  }

  @Transactional(readOnly = true)
  public List<AppointmentResponse> mine() {
    User user = currentUserService.get();
    return appointments.findMine(user.getId()).stream()
        .map(this::toResponse)
        .toList();
  }

  @Transactional
  public AppointmentResponse confirm(UUID id) {
    Appointment appointment = find(id);
    requireProviderOwner(appointment);
    if (appointment.getStatus() == AppointmentStatus.CONFIRMADO) {
      return toResponse(appointment);
    }
    if (appointments.existsByProviderProfileIdAndScheduledDateAndStartTimeAndStatus(
        appointment.getProviderProfile().getId(),
        appointment.getScheduledDate(),
        appointment.getStartTime(),
        AppointmentStatus.CONFIRMADO
    )) {
      throw new BadRequestException("Já existe agendamento confirmado neste horário.");
    }
    appointment.confirm();
    return toResponse(appointment);
  }

  @Transactional
  public AppointmentResponse reject(UUID id, AppointmentDecisionRequest request) {
    Appointment appointment = find(id);
    requireProviderOwner(appointment);
    appointment.reject(request == null ? null : request.reason());
    return toResponse(appointment);
  }

  @Transactional
  public AppointmentResponse cancel(UUID id, AppointmentDecisionRequest request) {
    Appointment appointment = find(id);
    User user = currentUserService.get();
    boolean ownsAsClient = appointment.getClient().getId().equals(user.getId());
    boolean ownsAsProvider = appointment.getProviderProfile().getUser().getId().equals(user.getId());
    boolean moderator = user.hasRole(Role.MODERADOR);
    if (!ownsAsClient && !ownsAsProvider && !moderator) {
      throw new ForbiddenOperationException("Você não pode cancelar este agendamento.");
    }
    appointment.cancel(request == null ? null : request.reason());
    return toResponse(appointment);
  }

  private Appointment find(UUID id) {
    return appointments.findByIdWithRelations(id)
        .orElseThrow(() -> new ResourceNotFoundException("Agendamento não encontrado."));
  }

  private void requireProviderOwner(Appointment appointment) {
    User user = currentUserService.get();
    if (!appointment.getProviderProfile().getUser().getId().equals(user.getId())) {
      throw new ForbiddenOperationException("Somente o prestador dono do agendamento pode executar esta ação.");
    }
  }

  private void validateRequestedSlot(ProviderProfile profile, AppointmentRequest request, LocalTime endTime) {
    if (request.scheduledDate().isBefore(LocalDate.now())) {
      throw new BadRequestException("Escolha uma data futura para solicitar o agendamento.");
    }
    if (!endTime.isAfter(request.startTime())) {
      throw new BadRequestException("Horário inválido para a duração do serviço.");
    }
    boolean fitsAvailability = availability.findByProviderProfileIdAndActiveTrue(profile.getId()).stream()
        .filter(block -> block.getDayOfWeek() == request.scheduledDate().getDayOfWeek())
        .anyMatch(block ->
            !request.startTime().isBefore(block.getStartTime()) &&
                !endTime.isAfter(block.getEndTime())
        );
    if (!fitsAvailability) {
      throw new BadRequestException("Horário fora da disponibilidade publicada pelo prestador.");
    }
  }

  public AppointmentResponse toResponse(Appointment appointment) {
    return new AppointmentResponse(
        appointment.getId(),
        appointment.getProviderProfile().getPublicName(),
        appointment.getClient().getName(),
        appointment.getServiceOffering().getName(),
        appointment.getScheduledDate(),
        appointment.getStartTime(),
        appointment.getEndTime(),
        appointment.getStatus(),
        appointment.getClientNote()
    );
  }
}
