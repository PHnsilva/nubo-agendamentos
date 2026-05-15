# Backend — Nubo

API REST do sistema Nubo, desenvolvida com Spring Boot 3.x, Java 21 e PostgreSQL.

## Stack
- Java 21
- Spring Boot 3.x
- Spring Web
- Spring Security
- JWT
- BCrypt
- Spring Data JPA
- Bean Validation
- Flyway
- PostgreSQL
- SpringDoc OpenAPI / Swagger

## Arquitetura
- REST API
- Modular Monolith
- DDD pragmático
- Organização por domínio com camadas internas leves

## Pacote Base
```txt
com.nubo
```

## Módulos
```txt
identity
provider
catalog
availability
appointment
admin
shared
```

## Estrutura Recomendada
```txt
backend/src/main/java/com/nubo/
├── identity/
│   ├── api/
│   ├── application/
│   ├── domain/
│   └── infrastructure/
├── provider/
│   ├── api/
│   ├── application/
│   ├── domain/
│   └── infrastructure/
├── catalog/
├── availability/
├── appointment/
├── admin/
└── shared/
```

## Variáveis de Ambiente
```env
DATABASE_URL=jdbc:postgresql://localhost:5432/nubo
DATABASE_USERNAME=nubo
DATABASE_PASSWORD=nubo123
JWT_SECRET=trocar-em-producao
JWT_EXPIRATION_MINUTES=120
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

## Como Rodar
```bash
./mvnw spring-boot:run
```

## Testes
```bash
./mvnw test
```

## Build
```bash
./mvnw clean package
```

## Swagger
```txt
http://localhost:8080/swagger-ui.html
```

## Regras Técnicas
- Não expor entidades JPA diretamente.
- Usar DTOs de request/response.
- Controllers devem ser finos.
- Services/facades devem orquestrar os casos de uso.
- Repositories devem concentrar persistência.
- Usar `@ControllerAdvice` para tratamento global de erros.
- Usar Bean Validation nos DTOs de entrada.
- Usar Flyway para migrations.
- Usar BCrypt para senha.
- Usar JWT stateless.

## Perfis de Teste
| Perfil | E-mail | Senha |
|---|---|---|
| MODERADOR | `moderador@nubo.local` | `Moderador@123` |
| CLIENTE | `cliente@nubo.local` | `Cliente@123` |
| PRESTADOR aprovado | `prestador@nubo.local` | `Prestador@123` |
| CLIENTE com candidatura pendente | `pendente@nubo.local` | `Pendente@123` |
