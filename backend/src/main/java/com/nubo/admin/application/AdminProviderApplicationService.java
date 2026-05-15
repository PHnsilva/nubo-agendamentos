package com.nubo.admin.application;

import com.nubo.admin.domain.enums.AdminAction;
import com.nubo.admin.domain.model.AdminDecisionLog;
import com.nubo.admin.infrastructure.persistence.AdminDecisionLogRepository;
import com.nubo.catalog.application.CatalogService;
import com.nubo.catalog.domain.model.Category;
import com.nubo.catalog.domain.model.ServiceOffering;
import com.nubo.catalog.infrastructure.persistence.ServiceOfferingRepository;
import com.nubo.availability.domain.model.AvailabilityBlock;
import com.nubo.availability.infrastructure.persistence.AvailabilityBlockRepository;
import com.nubo.identity.application.CurrentUserService;
import com.nubo.identity.domain.enums.Role;
import com.nubo.identity.domain.model.User;
import com.nubo.identity.infrastructure.persistence.UserRepository;
import com.nubo.provider.api.dto.ProviderApplicationResponse;
import com.nubo.provider.application.ProviderApplicationService;
import com.nubo.provider.domain.enums.ProviderApplicationStatus;
import com.nubo.provider.domain.model.ProviderApplication;
import com.nubo.provider.domain.model.ProviderProfile;
import com.nubo.provider.infrastructure.persistence.ProviderApplicationRepository;
import com.nubo.provider.infrastructure.persistence.ProviderProfileRepository;
import com.nubo.shared.api.PageResponse;
import com.nubo.shared.error.BadRequestException;
import com.nubo.shared.error.ResourceNotFoundException;
import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminProviderApplicationService {
  private final ProviderApplicationRepository applications;
  private final ProviderApplicationService mapper;
  private final CurrentUserService currentUserService;
  private final ProviderProfileRepository profiles;
  private final CatalogService catalogService;
  private final ServiceOfferingRepository services;
  private final AvailabilityBlockRepository availability;
  private final AdminDecisionLogRepository logs;
  private final UserRepository users;

  public AdminProviderApplicationService(
      ProviderApplicationRepository applications,
      ProviderApplicationService mapper,
      CurrentUserService currentUserService,
      ProviderProfileRepository profiles,
      CatalogService catalogService,
      ServiceOfferingRepository services,
      AvailabilityBlockRepository availability,
      AdminDecisionLogRepository logs,
      UserRepository users
  ) {
    this.applications = applications;
    this.mapper = mapper;
    this.currentUserService = currentUserService;
    this.profiles = profiles;
    this.catalogService = catalogService;
    this.services = services;
    this.availability = availability;
    this.logs = logs;
    this.users = users;
  }

  @Transactional(readOnly = true)
  public PageResponse<ProviderApplicationResponse> list(String status, int page, int size) {
    int safePage = Math.max(page, 0);
    int safeSize = Math.max(1, Math.min(size <= 0 ? 20 : size, 100));
    PageRequest pageRequest = PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.DESC, "createdAt"));
    Page<ProviderApplication> result = status == null || status.isBlank()
        ? applications.findAll(pageRequest)
        : applications.findByStatus(parseStatus(status), pageRequest);
    return new PageResponse<>(
        result.getContent().stream().map(mapper::toResponse).toList(),
        result.getNumber(),
        result.getSize(),
        result.getTotalElements(),
        result.getTotalPages()
    );
  }

  @Transactional(readOnly = true)
  public ProviderApplicationResponse detail(UUID id) {
    return mapper.toResponse(find(id));
  }

  @Transactional
  public ProviderApplicationResponse approve(UUID id, String message) {
    ProviderApplication application = find(id);
    User actor = currentUserService.get();
    application.approve(actor, message == null || message.isBlank() ? "Cadastro aprovado. Perfil publicado." : message);
    publishProfile(application);
    logs.save(new AdminDecisionLog(actor, "ProviderApplication", application.getId(), AdminAction.APROVAR_CANDIDATURA, application.getReviewMessage()));
    return mapper.toResponse(application);
  }

  @Transactional
  public ProviderApplicationResponse reject(UUID id, String message) {
    requireMessage(message);
    ProviderApplication application = find(id);
    User actor = currentUserService.get();
    application.reject(actor, message);
    logs.save(new AdminDecisionLog(actor, "ProviderApplication", application.getId(), AdminAction.REJEITAR_CANDIDATURA, message));
    return mapper.toResponse(application);
  }

  @Transactional
  public ProviderApplicationResponse requestChanges(UUID id, String message) {
    requireMessage(message);
    ProviderApplication application = find(id);
    User actor = currentUserService.get();
    application.requestChanges(actor, message);
    logs.save(new AdminDecisionLog(actor, "ProviderApplication", application.getId(), AdminAction.SOLICITAR_AJUSTE, message));
    return mapper.toResponse(application);
  }

  private ProviderApplication find(UUID id) {
    return applications.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Candidatura não encontrada."));
  }

  private void requireMessage(String message) {
    if (message == null || message.isBlank()) {
      throw new BadRequestException("Justificativa é obrigatória.");
    }
  }

  private ProviderApplicationStatus parseStatus(String status) {
    try {
      return ProviderApplicationStatus.valueOf(status.trim().toUpperCase(Locale.ROOT));
    } catch (IllegalArgumentException exception) {
      throw new BadRequestException("Status de candidatura inválido.");
    }
  }

  private void publishProfile(ProviderApplication application) {
    User providerUser = application.getUser();
    providerUser.setRole(Role.PRESTADOR);
    users.save(providerUser);

    ProviderProfile profile = profiles.findByUserId(providerUser.getId())
        .map(existing -> {
          existing.syncFrom(application);
          return existing;
        })
        .orElseGet(() -> new ProviderProfile(application, uniqueSlug(application.getPublicName())));
    ProviderProfile savedProfile = profiles.save(profile);

    if (!services.existsByProviderProfileIdAndActiveTrue(savedProfile.getId())) {
      String categoryName = application.getCategories().isEmpty() ? "Serviços gerais" : application.getCategories().getFirst();
      Category category = catalogService.findOrCreateByName(categoryName);
      BigDecimal basePrice = application.getBasePrice() == null ? BigDecimal.valueOf(80) : application.getBasePrice();
      services.save(new ServiceOffering(savedProfile, category, "Serviço principal", application.getServicesDescription(), basePrice, 60));
    }

    if (availability.findByProviderProfileIdAndActiveTrue(savedProfile.getId()).isEmpty()) {
      List.of(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY)
          .forEach(day -> availability.save(new AvailabilityBlock(savedProfile, day, LocalTime.of(9, 0), LocalTime.of(17, 0))));
    }
  }

  private String uniqueSlug(String publicName) {
    return CatalogService.slugify(publicName) + "-" + UUID.randomUUID().toString().substring(0, 8);
  }
}
