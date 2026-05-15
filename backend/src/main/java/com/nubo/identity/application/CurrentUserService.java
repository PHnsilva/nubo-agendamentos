package com.nubo.identity.application;

import com.nubo.identity.domain.model.User;
import com.nubo.identity.infrastructure.persistence.UserRepository;
import com.nubo.shared.error.ForbiddenOperationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {
  private final UserRepository users;

  public CurrentUserService(UserRepository users) {
    this.users = users;
  }

  public User get() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      throw new ForbiddenOperationException("Usuário autenticado é obrigatório.");
    }
    return users.findByEmail(authentication.getName())
        .orElseThrow(() -> new ForbiddenOperationException("Usuário autenticado não encontrado."));
  }
}
