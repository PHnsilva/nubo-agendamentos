package com.nubo.provider.api;

import com.nubo.provider.api.dto.ProviderApplicationRequest;
import com.nubo.provider.api.dto.ProviderApplicationResponse;
import com.nubo.provider.application.ProviderApplicationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProviderApplicationController {
  private final ProviderApplicationService providerApplicationService;

  public ProviderApplicationController(ProviderApplicationService providerApplicationService) {
    this.providerApplicationService = providerApplicationService;
  }

  @PostMapping("/api/provider-applications")
  public ProviderApplicationResponse submit(@Valid @RequestBody ProviderApplicationRequest request) {
    return providerApplicationService.submit(request);
  }

  @GetMapping("/api/me/provider-application")
  public ProviderApplicationResponse mine() {
    return providerApplicationService.mine();
  }
}
