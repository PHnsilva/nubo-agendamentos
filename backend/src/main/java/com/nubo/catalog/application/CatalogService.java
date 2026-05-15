package com.nubo.catalog.application;

import com.nubo.catalog.api.dto.CategoryResponse;
import com.nubo.catalog.domain.model.Category;
import com.nubo.catalog.infrastructure.persistence.CategoryRepository;
import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CatalogService {
  private final CategoryRepository categories;

  public CatalogService(CategoryRepository categories) {
    this.categories = categories;
  }

  @Transactional(readOnly = true)
  public List<CategoryResponse> listCategories() {
    return categories.findAll().stream()
        .map(this::toResponse)
        .toList();
  }

  @Transactional
  public Category findOrCreateByName(String name) {
    return categories.findByNameIgnoreCase(name)
        .orElseGet(() -> categories.save(new Category(name, slugify(name))));
  }

  public CategoryResponse toResponse(Category category) {
    return new CategoryResponse(category.getId(), category.getName(), category.getSlug());
  }

  public static String slugify(String value) {
    String normalized = Normalizer.normalize(value, Normalizer.Form.NFD)
        .replaceAll("\\p{M}", "")
        .toLowerCase(Locale.ROOT);
    return normalized.replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
  }
}
