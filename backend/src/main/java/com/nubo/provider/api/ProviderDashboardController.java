package com.nubo.provider.api;

import com.nubo.availability.api.dto.AvailabilityBlockResponse;
import com.nubo.availability.api.dto.AvailabilityUpdateRequest;
import com.nubo.catalog.api.dto.ServiceOfferingRequest;
import com.nubo.catalog.api.dto.ServiceOfferingResponse;
import com.nubo.provider.application.ProviderDashboardService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/provider-dashboard")
@PreAuthorize("hasRole('PRESTADOR')")
public class ProviderDashboardController {
  private final ProviderDashboardService service;

  public ProviderDashboardController(ProviderDashboardService service) {
    this.service = service;
  }

  @GetMapping("/services")
  public List<ServiceOfferingResponse> services() {
    return service.listServices();
  }

  @PostMapping("/services")
  public ServiceOfferingResponse createService(@Valid @RequestBody ServiceOfferingRequest request) {
    return service.createService(request);
  }

  @GetMapping("/availability")
  public List<AvailabilityBlockResponse> availability() {
    return service.listAvailability();
  }

  @PutMapping("/availability")
  public List<AvailabilityBlockResponse> replaceAvailability(@Valid @RequestBody AvailabilityUpdateRequest request) {
    return service.replaceAvailability(request);
  }
}
