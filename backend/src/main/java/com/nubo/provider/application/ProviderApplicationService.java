package com.nubo.provider.application;

import com.nubo.identity.application.CurrentUserService;
import com.nubo.identity.domain.enums.Role;
import com.nubo.identity.domain.model.User;
import com.nubo.provider.api.dto.ProviderApplicationRequest;
import com.nubo.provider.api.dto.ProviderApplicationResponse;
import com.nubo.provider.domain.enums.ProviderApplicationStatus;
import com.nubo.provider.domain.model.ProviderApplication;
import com.nubo.provider.infrastructure.persistence.ProviderApplicationRepository;
import com.nubo.shared.error.BadRequestException;
import com.nubo.shared.error.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProviderApplicationService {
  private static final List<ProviderApplicationStatus> ACTIVE_STATUSES = List.of(
      ProviderApplicationStatus.PENDENTE,
      ProviderApplicationStatus.AJUSTE_SOLICITADO,
      ProviderApplicationStatus.APROVADO
  );

  private final ProviderApplicationRepository applications;
  private final CurrentUserService currentUserService;

  public ProviderApplicationService(ProviderApplicationRepository applications, CurrentUserService currentUserService) {
    this.applications = applications;
    this.currentUserService = currentUserService;
  }

  @Transactional
  public ProviderApplicationResponse submit(ProviderApplicationRequest request) {
    User user = currentUserService.get();
    if (!user.hasRole(Role.CLIENTE)) {
      throw new BadRequestException("Apenas usuários clientes podem enviar candidatura de prestador.");
    }
    if (applications.existsByUserIdAndStatusIn(user.getId(), ACTIVE_STATUSES)) {
      throw new BadRequestException("Você já possui uma candidatura ativa.");
    }

    ProviderApplication application = new ProviderApplication(
        user,
        request.publicName(),
        request.contactPhone(),
        request.whatsapp(),
        request.description(),
        request.city(),
        request.regions(),
        request.categories(),
        request.servicesDescription(),
        request.basePrice(),
        request.profileImageUrl(),
        request.portfolioImageUrls() == null ? List.of() : request.portfolioImageUrls()
    );
    return toResponse(applications.save(application));
  }

  @Transactional(readOnly = true)
  public ProviderApplicationResponse mine() {
    User user = currentUserService.get();
    return applications.findFirstByUserIdOrderByCreatedAtDesc(user.getId())
        .map(this::toResponse)
        .orElseThrow(() -> new ResourceNotFoundException("Candidatura não encontrada."));
  }

  public ProviderApplicationResponse toResponse(ProviderApplication application) {
    return new ProviderApplicationResponse(
        application.getId(),
        application.getPublicName(),
        application.getContactPhone(),
        application.getWhatsapp(),
        application.getDescription(),
        application.getCity(),
        List.copyOf(application.getRegions()),
        List.copyOf(application.getCategories()),
        application.getServicesDescription(),
        application.getBasePrice(),
        application.getProfileImageUrl(),
        List.copyOf(application.getPortfolioImageUrls()),
        application.getStatus(),
        application.getReviewMessage(),
        application.getReviewedAt(),
        application.getCreatedAt()
    );
  }
}
