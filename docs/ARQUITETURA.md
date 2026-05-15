# Arquitetura — Nubo

## 1. Decisão Recomendada

Para o protótipo do **Nubo**, a arquitetura recomendada é:

**SPA React + REST API Spring Boot + PostgreSQL + Modular Monolith + DDD pragmático.**

Essa escolha equilibra:
- simplicidade de deploy;
- organização por domínio;
- baixo acoplamento;
- facilidade para Codex gerar e manter código;
- compatibilidade com evolução futura.

## 2. Por que não microservices agora
O sistema tem domínios claros, mas ainda não tem escala operacional, múltiplos times ou necessidade real de deploy independente. Microservices aumentariam complexidade em autenticação, rede, observabilidade, transações distribuídas e deploy. O protótipo deve começar como monólito modular.

## 3. Visão de Alto Nível

```txt
Cliente Web
   |
   | HTTPS/JSON
   v
Frontend React SPA
   |
   | REST API / JSON
   v
Backend Spring Boot
   |
   | JDBC/JPA
   v
PostgreSQL
```

## 4. Backend

### 4.1 Padrão de borda
- REST API com HTTP controllers.
- Entrada e saída em JSON.
- DTOs específicos por caso de uso.

### 4.2 Arquitetura geral
- Modular Monolith.
- Módulos por capacidade de negócio.
- Camadas internas leves por módulo.

### 4.3 Modelagem
- DDD pragmático.
- Entidades e enums para estados relevantes.
- Services/facades para casos de uso.
- Regras críticas próximas do domínio.

### 4.4 Módulos

#### identity
Responsável por:
- usuários;
- autenticação;
- papéis;
- JWT;
- segurança.

#### provider
Responsável por:
- candidatura de prestador;
- aprovação;
- perfil público;
- regiões de atuação;
- portfólio.

#### catalog
Responsável por:
- categorias;
- serviços;
- vínculos entre prestador e serviços.

#### availability
Responsável por:
- disponibilidade semanal;
- blocos de horário;
- exceções futuras.

#### appointment
Responsável por:
- solicitação;
- confirmação;
- recusa;
- cancelamento;
- histórico.

#### admin
Responsável por:
- consultas administrativas;
- dashboards;
- ações de moderação.

#### shared
Responsável por:
- exceções;
- paginação;
- resposta de erro;
- auditoria;
- utilitários;
- configuração comum.

## 5. Backend — Estrutura Interna

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
│   ├── api/
│   ├── application/
│   ├── domain/
│   └── infrastructure/
├── availability/
│   ├── api/
│   ├── application/
│   ├── domain/
│   └── infrastructure/
├── appointment/
│   ├── api/
│   ├── application/
│   ├── domain/
│   └── infrastructure/
├── admin/
└── shared/
```

## 6. Entidades Principais

### User
- id
- name
- email
- passwordHash
- role
- active
- createdAt
- updatedAt

### ProviderApplication
- id
- user
- publicName
- contactPhone
- whatsapp
- description
- city
- regions
- categories
- servicesDescription
- profileImageUrl
- portfolioImageUrls
- status
- reviewMessage
- reviewedBy
- reviewedAt
- createdAt
- updatedAt

### ProviderProfile
- id
- user
- publicName
- slug
- description
- contactPhone
- whatsapp
- city
- regions
- active
- ratingAverage
- ratingCount
- createdAt
- updatedAt

### ServiceOffering
- id
- providerProfile
- category
- name
- description
- basePrice
- estimatedDurationMinutes
- active

### AvailabilityBlock
- id
- providerProfile
- dayOfWeek
- startTime
- endTime
- active

### Appointment
- id
- client
- providerProfile
- serviceOffering
- scheduledDate
- startTime
- endTime
- status
- clientNote
- providerNote
- cancellationReason
- createdAt
- updatedAt

### AdminDecisionLog
- id
- actor
- targetType
- targetId
- action
- message
- createdAt

## 7. Frontend

### 7.1 Estrutura
```txt
frontend/src/
├── app/
├── assets/svg/
├── components/
│   ├── ui/
│   └── layout/
├── features/
│   ├── landing/
│   ├── providers/
│   ├── applications/
│   ├── admin/
│   ├── appointments/
│   └── auth/
├── pages/
├── services/
├── hooks/
└── types/
```

### 7.2 Estratégia de tela
- Landing page deve ser visualmente forte.
- Busca deve priorizar filtros e cards claros.
- Moderador deve priorizar fila de análise e decisão rápida.
- Prestador deve priorizar agenda e serviços.

## 8. Segurança

### Autenticação
- Login com e-mail e senha.
- JWT no frontend.
- Header: `Authorization: Bearer <token>`.

### Autorização
- Controle por role.
- Controle por dono do recurso.
- Rotas admin restritas.
- Prestador só acessa dashboard se aprovado.

### Validação
- Backend: Bean Validation.
- Frontend: Zod.

### Erros
Payload padrão:
```json
{
  "timestamp": "2026-05-12T18:00:00Z",
  "status": 400,
  "error": "Validation Error",
  "message": "Dados inválidos",
  "path": "/api/provider-applications",
  "details": [
    { "field": "publicName", "message": "Nome público é obrigatório" }
  ]
}
```

## 9. Testes

### Backend
- Testes unitários para services de candidatura, aprovação e agendamento.
- Testes de integração para auth e endpoints críticos.
- Testes de regra para evitar agendamento duplicado.

### Frontend
- Build obrigatório.
- Testes de componentes podem entrar depois.
- Garantir validação de formulários e rotas protegidas.

## 10. Evolução Futura
- Upload em storage externo.
- Notificações por WhatsApp/e-mail.
- Pagamento.
- Avaliações.
- Geolocalização com mapa.
- Recomendação por scoring.
- Auditoria mais forte.
