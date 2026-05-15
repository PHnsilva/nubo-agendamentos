package com.nubo.admin.application;

import com.nubo.shared.error.BadRequestException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertThrows;

class AdminProviderApplicationServiceTest {
  @Test
  void rejectsInvalidApplicationStatusFilter() {
    AdminProviderApplicationService service = new AdminProviderApplicationService(
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
    );

    assertThrows(BadRequestException.class, () -> service.list("INVALIDO", 0, 20));
  }
}
