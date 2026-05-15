package com.nubo.shared.config;

import com.nubo.availability.domain.model.AvailabilityBlock;
import com.nubo.availability.infrastructure.persistence.AvailabilityBlockRepository;
import com.nubo.catalog.application.CatalogService;
import com.nubo.catalog.domain.model.Category;
import com.nubo.catalog.domain.model.ServiceOffering;
import com.nubo.catalog.infrastructure.persistence.ServiceOfferingRepository;
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
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("!test")
public class DataSeeder implements CommandLineRunner {
  private final UserRepository users;
  private final CatalogService catalogService;
  private final ProviderApplicationRepository applications;
  private final ProviderProfileRepository profiles;
  private final ServiceOfferingRepository services;
  private final AvailabilityBlockRepository availability;
  private final PasswordEncoder passwordEncoder;

  public DataSeeder(
      UserRepository users,
      CatalogService catalogService,
      ProviderApplicationRepository applications,
      ProviderProfileRepository profiles,
      ServiceOfferingRepository services,
      AvailabilityBlockRepository availability,
      PasswordEncoder passwordEncoder
  ) {
    this.users = users;
    this.catalogService = catalogService;
    this.applications = applications;
    this.profiles = profiles;
    this.services = services;
    this.availability = availability;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  @Transactional
  public void run(String... args) {
    List<String> categoryNames = List.of(
        "Beleza e estética",
        "Casa e manutenção",
        "Aulas e consultorias",
        "Saúde e bem-estar",
        "Tecnologia",
        "Eventos"
    );
    categoryNames.forEach(catalogService::findOrCreateByName);

    User moderator = user("Moderador Nubo", "moderador@nubo.local", "Moderador@123", Role.MODERADOR);
    user("Cliente Nubo", "cliente@nubo.local", "Cliente@123", Role.CLIENTE);

    List<ProviderSeed> providerSeeds = List.of(
        new ProviderSeed(
            "Clara Lima",
            "prestador@nubo.local",
            "Prestador@123",
            "Studio Clara Lima",
            "(31) 99999-0000",
            "5531999990000",
            "Atendimento de estética e beleza em domicílio com foco em sobrancelhas, maquiagem e preparação para eventos.",
            "Belo Horizonte",
            List.of("Centro", "Savassi", "Funcionários"),
            "Beleza e estética",
            "Design de sobrancelha, maquiagem social e limpeza de pele com materiais próprios.",
            BigDecimal.valueOf(60),
            "Design de sobrancelha",
            "Modelagem personalizada com finalização.",
            45,
            BigDecimal.valueOf(4.8),
            34
        ),
        new ProviderSeed(
            "Bruno Azevedo",
            "bruno.reparos@nubo.local",
            "Prestador@123",
            "Bruno Reparos Express",
            "(11) 97777-2020",
            "5511977772020",
            "Manutenção residencial para pequenos reparos, instalações e revisão preventiva em apartamentos.",
            "São Paulo",
            List.of("Pinheiros", "Vila Madalena", "Perdizes"),
            "Casa e manutenção",
            "Troca de torneira, instalação de prateleiras, pintura pequena e reparos elétricos simples.",
            BigDecimal.valueOf(90),
            "Reparo residencial",
            "Atendimento para reparos rápidos com orçamento antes da execução.",
            60,
            BigDecimal.valueOf(4.6),
            21
        ),
        new ProviderSeed(
            "Malu Carvalho",
            "malu.bemestar@nubo.local",
            "Prestador@123",
            "Malu Bem-estar",
            "(21) 96666-3030",
            "5521966663030",
            "Sessões de massagem relaxante, drenagem e cuidado corporal com agenda flexível para rotina urbana.",
            "Rio de Janeiro",
            List.of("Botafogo", "Flamengo", "Copacabana"),
            "Saúde e bem-estar",
            "Massagem relaxante, drenagem linfática e protocolos de bem-estar em domicílio.",
            BigDecimal.valueOf(120),
            "Massagem relaxante",
            "Sessão de cuidado corporal com materiais higienizados e orientação prévia.",
            75,
            BigDecimal.valueOf(4.9),
            48
        ),
        new ProviderSeed(
            "Norte Tech",
            "norte.tech@nubo.local",
            "Prestador@123",
            "Norte Tech Suporte",
            "(41) 95555-4040",
            "5541955554040",
            "Suporte técnico local para computadores, redes domésticas, backup e organização digital.",
            "Curitiba",
            List.of("Batel", "Água Verde", "Centro"),
            "Tecnologia",
            "Formatação, backup, instalação de rede Wi-Fi e suporte para ferramentas digitais.",
            BigDecimal.valueOf(110),
            "Suporte técnico",
            "Diagnóstico, correção e orientação para uso seguro dos equipamentos.",
            60,
            BigDecimal.valueOf(4.7),
            29
        ),
        new ProviderSeed(
            "Aula Viva",
            "aula.viva@nubo.local",
            "Prestador@123",
            "Aula Viva Consultorias",
            "(51) 94444-5050",
            "5551944445050",
            "Aulas particulares e consultorias para organização de estudos, carreira e produtividade.",
            "Porto Alegre",
            List.of("Moinhos de Vento", "Cidade Baixa", "Menino Deus"),
            "Aulas e consultorias",
            "Aulas de reforço, mentoria de carreira e consultorias de organização pessoal.",
            BigDecimal.valueOf(85),
            "Mentoria individual",
            "Sessão com diagnóstico, plano de ação e acompanhamento inicial.",
            60,
            BigDecimal.valueOf(4.5),
            17
        ),
        new ProviderSeed(
            "Bella Eventos",
            "bella.eventos@nubo.local",
            "Prestador@123",
            "Bella Eventos Locais",
            "(61) 93333-6060",
            "5561933336060",
            "Produção de eventos pequenos com fornecedores locais, decoração e apoio no dia do evento.",
            "Brasília",
            List.of("Asa Sul", "Asa Norte", "Lago Sul"),
            "Eventos",
            "Decoração, apoio de produção, organização de cronograma e fornecedores para eventos compactos.",
            BigDecimal.valueOf(180),
            "Produção de evento",
            "Planejamento enxuto para aniversários, encontros profissionais e celebrações familiares.",
            120,
            BigDecimal.valueOf(4.8),
            26
        )
    );
    providerSeeds.forEach(seed -> seedApprovedProvider(moderator, seed));

    User pendingProvider = user("Rafael Costa", "pendente@nubo.local", "Pendente@123", Role.CLIENTE);
    seedPendingApplication(pendingProvider);
  }

  private User user(String name, String email, String password, Role role) {
    return users.findByEmail(email)
        .map(existing -> {
          existing.setRole(role);
          return existing;
        })
        .orElseGet(() -> {
          User created = new User(name, email, passwordEncoder.encode(password));
          created.setRole(role);
          return users.save(created);
        });
  }

  private void seedApprovedProvider(User moderator, ProviderSeed seed) {
    User providerUser = user(seed.userName(), seed.email(), seed.password(), Role.PRESTADOR);
    if (profiles.findByUserId(providerUser.getId()).isPresent()) return;

    ProviderApplication application = new ProviderApplication(
        providerUser,
        seed.publicName(),
        seed.contactPhone(),
        seed.whatsapp(),
        seed.description(),
        seed.city(),
        seed.regions(),
        List.of(seed.categoryName()),
        seed.servicesDescription(),
        seed.basePrice(),
        null,
        List.of()
    );
    application.approve(moderator, "Cadastro aprovado. Perfil publicado.");
    applications.save(application);

    ProviderProfile profile = new ProviderProfile(application, CatalogService.slugify(seed.publicName()) + "-" + UUID.randomUUID().toString().substring(0, 8));
    profile.setSeedRating(seed.ratingAverage(), seed.ratingCount());
    profiles.save(profile);

    Category category = catalogService.findOrCreateByName(seed.categoryName());
    services.save(new ServiceOffering(
        profile,
        category,
        seed.serviceName(),
        seed.serviceDescription(),
        seed.basePrice(),
        seed.durationMinutes()
    ));
    List.of(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY)
        .forEach(day -> availability.save(new AvailabilityBlock(profile, day, LocalTime.of(9, 0), LocalTime.of(17, 0))));
  }

  private void seedPendingApplication(User pendingProvider) {
    if (applications.findFirstByUserIdOrderByCreatedAtDesc(pendingProvider.getId()).isPresent()) return;
    applications.save(new ProviderApplication(
        pendingProvider,
        "Casa Forte Reparos",
        "(11) 98888-1111",
        "5511988881111",
        "Manutenção residencial para pequenos reparos, instalações e revisão preventiva em apartamentos.",
        "São Paulo",
        List.of("Pinheiros", "Vila Madalena"),
        List.of("Casa e manutenção"),
        "Troca de torneira, instalação de prateleiras, pintura pequena e reparos elétricos simples.",
        BigDecimal.valueOf(90),
        null,
        List.of()
    ));
  }

  private record ProviderSeed(
      String userName,
      String email,
      String password,
      String publicName,
      String contactPhone,
      String whatsapp,
      String description,
      String city,
      List<String> regions,
      String categoryName,
      String servicesDescription,
      BigDecimal basePrice,
      String serviceName,
      String serviceDescription,
      int durationMinutes,
      BigDecimal ratingAverage,
      int ratingCount
  ) {
  }
}
