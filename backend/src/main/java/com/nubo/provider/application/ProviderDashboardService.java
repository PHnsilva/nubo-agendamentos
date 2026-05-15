package com.nubo.provider.application;

import com.nubo.availability.api.dto.AvailabilityBlockResponse;
import com.nubo.availability.api.dto.AvailabilityUpdateRequest;
import com.nubo.availability.domain.model.AvailabilityBlock;
import com.nubo.availability.infrastructure.persistence.AvailabilityBlockRepository;
import com.nubo.catalog.api.dto.ServiceOfferingRequest;
import com.nubo.catalog.api.dto.ServiceOfferingResponse;
import com.nubo.catalog.domain.model.Category;
import com.nubo.catalog.domain.model.ServiceOffering;
import com.nubo.catalog.infrastructure.persistence.CategoryRepository;
import com.nubo.catalog.infrastructure.persistence.ServiceOfferingRepository;
import com.nubo.identity.application.CurrentUserService;
import com.nubo.identity.domain.model.User;
import com.nubo.provider.domain.model.ProviderProfile;
import com.nubo.provider.infrastructure.persistence.ProviderProfileRepository;
import com.nubo.shared.error.BadRequestException;
import com.nubo.shared.error.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProviderDashboardService {
  private final CurrentUserService currentUserService;
  private final ProviderProfileRepository profiles;
  private final CategoryRepository categories;
  private final ServiceOfferingRepository services;
  private final AvailabilityBlockRepository availability;
  private final PublicProviderService mapper;

  public ProviderDashboardService(
      CurrentUserService currentUserService,
      ProviderProfileRepository profiles,
      CategoryRepository categories,
      ServiceOfferingRepository services,
      AvailabilityBlockRepository availability,
      PublicProviderService mapper
  ) {
    this.currentUserService = currentUserService;
    this.profiles = profiles;
    this.categories = categories;
    this.services = services;
    this.availability = availability;
    this.mapper = mapper;
  }

  @Transactional(readOnly = true)
  public List<ServiceOfferingResponse> listServices() {
    ProviderProfile profile = currentProfile();
    return services.findByProviderProfileIdAndActiveTrue(profile.getId()).stream()
        .map(mapper::toServiceResponse)
        .toList();
  }

  @Transactional
  public ServiceOfferingResponse createService(ServiceOfferingRequest request) {
    ProviderProfile profile = currentProfile();
    Category category = categories.findById(request.categoryId())
        .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));
    ServiceOffering service = services.save(new ServiceOffering(
        profile,
        category,
        request.name(),
        request.description(),
        request.basePrice(),
        request.estimatedDurationMinutes()
    ));
    return mapper.toServiceResponse(service);
  }

  @Transactional(readOnly = true)
  public List<AvailabilityBlockResponse> listAvailability() {
    ProviderProfile profile = currentProfile();
    return availability.findByProviderProfileIdAndActiveTrue(profile.getId()).stream()
        .map(mapper::toAvailabilityResponse)
        .toList();
  }

  @Transactional
  public List<AvailabilityBlockResponse> replaceAvailability(AvailabilityUpdateRequest request) {
    ProviderProfile profile = currentProfile();
    request.blocks().forEach(block -> {
      if (!block.startTime().isBefore(block.endTime())) {
        throw new BadRequestException("Horário inicial deve ser antes do horário final.");
      }
    });
    availability.deleteByProviderProfileId(profile.getId());
    availability.flush();
    List<AvailabilityBlock> blocks = request.blocks().stream()
        .map(block -> new AvailabilityBlock(profile, block.dayOfWeek(), block.startTime(), block.endTime()))
        .toList();
    return availability.saveAll(blocks).stream()
        .map(mapper::toAvailabilityResponse)
        .toList();
  }

  private ProviderProfile currentProfile() {
    User user = currentUserService.get();
    return profiles.findByUserId(user.getId())
        .filter(ProviderProfile::isActive)
        .orElseThrow(() -> new ResourceNotFoundException("Perfil de prestador aprovado não encontrado."));
  }
}
