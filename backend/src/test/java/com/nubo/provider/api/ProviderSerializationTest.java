package com.nubo.provider.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.nubo.availability.domain.model.AvailabilityBlock;
import com.nubo.availability.infrastructure.persistence.AvailabilityBlockRepository;
import com.nubo.catalog.domain.model.Category;
import com.nubo.catalog.domain.model.ServiceOffering;
import com.nubo.catalog.infrastructure.persistence.CategoryRepository;
import com.nubo.catalog.infrastructure.persistence.ServiceOfferingRepository;
import com.nubo.identity.application.JwtService;
import com.nubo.identity.domain.enums.Role;
import com.nubo.identity.domain.model.User;
import com.nubo.identity.infrastructure.persistence.UserRepository;
import com.nubo.provider.domain.model.ProviderApplication;
import com.nubo.provider.domain.model.ProviderProfile;
import com.nubo.provider.infrastructure.persistence.ProviderApplicationRepository;
import com.nubo.provider.infrastructure.persistence.ProviderProfileRepository;
import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProviderSerializationTest {
  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private UserRepository users;

  @Autowired
  private CategoryRepository categories;

  @Autowired
  private ProviderApplicationRepository applications;

  @Autowired
  private ProviderProfileRepository profiles;

  @Autowired
  private ServiceOfferingRepository services;

  @Autowired
  private AvailabilityBlockRepository availability;

  @Autowired
  private JwtService jwtService;

  private UUID profileId;
  private UUID applicationId;
  private String moderatorToken;

  @BeforeEach
  void setUp() {
    String suffix = UUID.randomUUID().toString();
    User moderator = new User("Moderador Teste", "moderador-" + suffix + "@nubo.test", "hash");
    moderator.setRole(Role.MODERADOR);
    users.save(moderator);

    User providerUser = new User("Prestador Teste", "prestador-" + suffix + "@nubo.test", "hash");
    providerUser.setRole(Role.PRESTADOR);
    users.save(providerUser);

    Category category = categories.save(new Category("Categoria " + suffix, "categoria-" + suffix));
    ProviderApplication application = new ProviderApplication(
        providerUser,
        "Prestador Serializacao " + suffix,
        "(31) 90000-0000",
        "5531900000000",
        "Descricao suficiente para serializar o perfil aprovado.",
        "Belo Horizonte",
        List.of("Centro", "Savassi"),
        List.of(category.getName()),
        "Servico principal de teste.",
        BigDecimal.valueOf(100),
        "/perfil/teste.jpg",
        List.of("/portfolio/teste.jpg")
    );
    application.approve(moderator, "Aprovado para teste.");
    applications.save(application);

    ProviderProfile profile = profiles.save(new ProviderProfile(application, "prestador-" + suffix));
    services.save(new ServiceOffering(profile, category, "Servico teste", "Descricao do servico.", BigDecimal.valueOf(100), 60));
    availability.save(new AvailabilityBlock(profile, DayOfWeek.MONDAY, LocalTime.of(9, 0), LocalTime.of(17, 0)));

    profileId = profile.getId();
    applicationId = application.getId();
    moderatorToken = jwtService.generateToken(moderator);
  }

  @Test
  void providerDetailSerializesElementCollectionsWithOpenInViewDisabled() throws Exception {
    mockMvc.perform(get("/api/providers/{id}", profileId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.regions[0]").value("Centro"))
        .andExpect(jsonPath("$.portfolioImageUrls[0]").value("/portfolio/teste.jpg"))
        .andExpect(jsonPath("$.services[0].name").value("Servico teste"))
        .andExpect(jsonPath("$.availability[0].dayOfWeek").value("MONDAY"));
  }

  @Test
  void adminApplicationDetailSerializesElementCollectionsWithOpenInViewDisabled() throws Exception {
    mockMvc.perform(get("/api/admin/provider-applications/{id}", applicationId)
            .header("Authorization", "Bearer " + moderatorToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.regions[1]").value("Savassi"))
        .andExpect(jsonPath("$.categories[0]").exists())
        .andExpect(jsonPath("$.portfolioImageUrls[0]").value("/portfolio/teste.jpg"));
  }
}
