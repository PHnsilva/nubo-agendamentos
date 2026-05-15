package com.nubo.identity.application;

import com.nubo.identity.api.dto.AuthResponse;
import com.nubo.identity.api.dto.LoginRequest;
import com.nubo.identity.api.dto.RegisterRequest;
import com.nubo.identity.api.dto.UserResponse;
import com.nubo.identity.domain.model.User;
import com.nubo.identity.infrastructure.persistence.UserRepository;
import com.nubo.shared.error.BadRequestException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
  private final UserRepository users;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;
  private final JwtProperties jwtProperties;

  public AuthService(
      UserRepository users,
      PasswordEncoder passwordEncoder,
      AuthenticationManager authenticationManager,
      JwtService jwtService,
      JwtProperties jwtProperties
  ) {
    this.users = users;
    this.passwordEncoder = passwordEncoder;
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
    this.jwtProperties = jwtProperties;
  }

  @Transactional
  public AuthResponse register(RegisterRequest request) {
    String email = request.email().toLowerCase();
    if (users.existsByEmail(email)) {
      throw new BadRequestException("E-mail já cadastrado.");
    }
    User user = users.save(new User(request.name(), email, passwordEncoder.encode(request.password())));
    return authResponse(user);
  }

  @Transactional(readOnly = true)
  public AuthResponse login(LoginRequest request) {
    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email().toLowerCase(), request.password()));
    User user = users.findByEmail(request.email().toLowerCase())
        .orElseThrow(() -> new BadRequestException("Usuário não encontrado."));
    return authResponse(user);
  }

  public UserResponse toResponse(User user) {
    return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
  }

  private AuthResponse authResponse(User user) {
    return new AuthResponse(jwtService.generateToken(user), "Bearer", jwtProperties.expirationMinutes(), toResponse(user));
  }
}
