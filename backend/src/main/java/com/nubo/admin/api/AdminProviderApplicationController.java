package com.nubo.admin.api;

import com.nubo.admin.api.dto.AdminDecisionRequest;
import com.nubo.admin.application.AdminProviderApplicationService;
import com.nubo.provider.api.dto.ProviderApplicationResponse;
import com.nubo.shared.api.PageResponse;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/provider-applications")
@PreAuthorize("hasRole('MODERADOR')")
public class AdminProviderApplicationController {
  private final AdminProviderApplicationService service;

  public AdminProviderApplicationController(AdminProviderApplicationService service) {
    this.service = service;
  }

  @GetMapping
  public PageResponse<ProviderApplicationResponse> list(
      @RequestParam(required = false) String status,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size
  ) {
    return service.list(status, page, size);
  }

  @GetMapping("/{id}")
  public ProviderApplicationResponse detail(@PathVariable UUID id) {
    return service.detail(id);
  }

  @PostMapping("/{id}/approve")
  public ProviderApplicationResponse approve(@PathVariable UUID id, @RequestBody(required = false) AdminDecisionRequest request) {
    return service.approve(id, request == null ? null : request.message());
  }

  @PostMapping("/{id}/reject")
  public ProviderApplicationResponse reject(@PathVariable UUID id, @RequestBody(required = false) AdminDecisionRequest request) {
    return service.reject(id, request == null ? null : request.message());
  }

  @PostMapping("/{id}/request-changes")
  public ProviderApplicationResponse requestChanges(@PathVariable UUID id, @RequestBody(required = false) AdminDecisionRequest request) {
    return service.requestChanges(id, request == null ? null : request.message());
  }
}
