package com.nubo.provider.api;

import com.nubo.provider.api.dto.ProviderDetailResponse;
import com.nubo.provider.api.dto.ProviderSummaryResponse;
import com.nubo.provider.application.PublicProviderService;
import com.nubo.shared.api.PageResponse;
import java.math.BigDecimal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/providers")
public class PublicProviderController {
  private final PublicProviderService publicProviderService;

  public PublicProviderController(PublicProviderService publicProviderService) {
    this.publicProviderService = publicProviderService;
  }

  @GetMapping
  public PageResponse<ProviderSummaryResponse> search(
      @RequestParam(required = false) String city,
      @RequestParam(required = false) String region,
      @RequestParam(required = false) String category,
      @RequestParam(required = false) String service,
      @RequestParam(required = false) BigDecimal minRating,
      @RequestParam(required = false) BigDecimal minPrice,
      @RequestParam(required = false) BigDecimal maxPrice,
      @RequestParam(required = false) String availableDate,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "12") int size
  ) {
    return publicProviderService.search(city, region, category, service, minRating, minPrice, maxPrice, availableDate, page, size);
  }

  @GetMapping("/{id}")
  public ProviderDetailResponse detail(@PathVariable String id) {
    return publicProviderService.detail(id);
  }
}
