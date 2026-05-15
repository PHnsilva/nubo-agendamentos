package com.nubo.appointment.infrastructure.persistence;

import com.nubo.appointment.domain.enums.AppointmentStatus;
import com.nubo.appointment.domain.model.Appointment;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
  boolean existsByProviderProfileIdAndScheduledDateAndStartTimeAndStatus(
      UUID providerProfileId,
      LocalDate scheduledDate,
      LocalTime startTime,
      AppointmentStatus status
  );

  @Query("""
      select appointment from Appointment appointment
      join fetch appointment.client
      join fetch appointment.providerProfile providerProfile
      join fetch providerProfile.user
      join fetch appointment.serviceOffering
      where appointment.client.id = :userId or appointment.providerProfile.user.id = :userId
      order by appointment.scheduledDate desc, appointment.startTime desc
      """)
  List<Appointment> findMine(@Param("userId") UUID userId);

  @Query("""
      select appointment from Appointment appointment
      join fetch appointment.client
      join fetch appointment.providerProfile providerProfile
      join fetch providerProfile.user
      join fetch appointment.serviceOffering
      where appointment.id = :id
      """)
  Optional<Appointment> findByIdWithRelations(@Param("id") UUID id);
}
