package com.nubo.identity.application;

import com.nubo.identity.infrastructure.persistence.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class NuboUserDetailsService implements UserDetailsService {
  private final UserRepository users;

  public NuboUserDetailsService(UserRepository users) {
    this.users = users;
  }

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    com.nubo.identity.domain.model.User user = users.findByEmail(email.toLowerCase())
        .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado."));

    return org.springframework.security.core.userdetails.User
        .withUsername(user.getEmail())
        .password(user.getPasswordHash())
        .disabled(!user.isActive())
        .authorities("ROLE_" + user.getRole().name())
        .build();
  }
}
