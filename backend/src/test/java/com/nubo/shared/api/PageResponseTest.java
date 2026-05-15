package com.nubo.shared.api;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.Test;

class PageResponseTest {
  @Test
  void calculatesTotalPages() {
    PageResponse<String> page = PageResponse.of(List.of("a", "b"), 0, 2, 5);

    assertThat(page.totalPages()).isEqualTo(3);
    assertThat(page.totalElements()).isEqualTo(5);
  }
}
