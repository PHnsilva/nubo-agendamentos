package com.nubo.catalog.api;

import com.nubo.catalog.api.dto.CategoryResponse;
import com.nubo.catalog.application.CatalogService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
  private final CatalogService catalogService;

  public CategoryController(CatalogService catalogService) {
    this.catalogService = catalogService;
  }

  @GetMapping
  public List<CategoryResponse> list() {
    return catalogService.listCategories();
  }
}
