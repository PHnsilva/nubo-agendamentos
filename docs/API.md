# API — Nubo

Base URL local:
```txt
http://localhost:8080/api
```

## 1. Autenticação

### POST `/auth/register`
Cria usuário.

Request:
```json
{
  "name": "Pedro Silva",
  "email": "pedro@nubo.local",
  "password": "Senha@123"
}
```

Response:
```json
{
  "id": "uuid",
  "name": "Pedro Silva",
  "email": "pedro@nubo.local",
  "role": "CLIENTE"
}
```

### POST `/auth/login`
Autentica usuário.

Request:
```json
{
  "email": "moderador@nubo.local",
  "password": "Moderador@123"
}
```

Response:
```json
{
  "accessToken": "jwt",
  "tokenType": "Bearer",
  "expiresInMinutes": 120,
  "user": {
    "id": "uuid",
    "name": "Moderador Nubo",
    "email": "moderador@nubo.local",
    "role": "MODERADOR"
  }
}
```

## 2. Prestadores Públicos

### GET `/providers`
Busca prestadores aprovados.

Query params:
- `city`
- `region`
- `category`
- `service`
- `minRating`
- `minPrice`
- `maxPrice`
- `availableDate`
- `page`
- `size`
- `sort`

Response:
```json
{
  "content": [
    {
      "id": "uuid",
      "publicName": "Studio Clara Lima",
      "slug": "studio-clara-lima",
      "description": "Atendimento de estética e beleza em domicílio.",
      "city": "Belo Horizonte",
      "regions": ["Centro", "Savassi"],
      "categories": ["Beleza e estética"],
      "ratingAverage": 4.8,
      "ratingCount": 34,
      "profileImageUrl": "/mock/provider-1.jpg",
      "servicesPreview": ["Design de sobrancelha", "Maquiagem"],
      "basePriceFrom": 60
    }
  ],
  "page": 0,
  "size": 12,
  "totalElements": 1,
  "totalPages": 1
}
```

### GET `/providers/{id}`
Detalhe público do prestador.

Response:
```json
{
  "id": "uuid",
  "publicName": "Studio Clara Lima",
  "description": "Atendimento de estética e beleza em domicílio.",
  "city": "Belo Horizonte",
  "regions": ["Centro", "Savassi"],
  "contactPhone": "(31) 99999-0000",
  "whatsapp": "5531999990000",
  "profileImageUrl": "/mock/provider-1.jpg",
  "portfolioImageUrls": ["/mock/service-1.jpg"],
  "ratingAverage": 4.8,
  "ratingCount": 34,
  "services": [
    {
      "id": "uuid",
      "name": "Design de sobrancelha",
      "description": "Modelagem personalizada.",
      "basePrice": 60,
      "estimatedDurationMinutes": 45
    }
  ],
  "availability": [
    {
      "dayOfWeek": "MONDAY",
      "startTime": "09:00",
      "endTime": "17:00"
    }
  ]
}
```

## 3. Candidatura de Prestador

### POST `/provider-applications`
Cria candidatura. Requer autenticação.

Request:
```json
{
  "publicName": "Studio Clara Lima",
  "contactPhone": "(31) 99999-0000",
  "whatsapp": "5531999990000",
  "description": "Atendimento de estética e beleza em domicílio.",
  "city": "Belo Horizonte",
  "regions": ["Centro", "Savassi"],
  "categories": ["Beleza e estética"],
  "servicesDescription": "Design de sobrancelha, maquiagem e limpeza de pele.",
  "profileImageUrl": "/mock/provider-1.jpg",
  "portfolioImageUrls": ["/mock/service-1.jpg"]
}
```

Response:
```json
{
  "id": "uuid",
  "status": "PENDENTE",
  "createdAt": "2026-05-12T18:00:00Z"
}
```

### GET `/me/provider-application`
Retorna candidatura do usuário autenticado.

## 4. Moderação

### GET `/admin/provider-applications`
Lista candidaturas.

Query params:
- `status`
- `page`
- `size`

### GET `/admin/provider-applications/{id}`
Detalhe de candidatura.

### POST `/admin/provider-applications/{id}/approve`
Aprova candidatura.

Request:
```json
{
  "message": "Cadastro aprovado. Perfil publicado."
}
```

### POST `/admin/provider-applications/{id}/reject`
Rejeita candidatura.

Request:
```json
{
  "message": "Informações insuficientes sobre os serviços prestados."
}
```

### POST `/admin/provider-applications/{id}/request-changes`
Solicita ajuste.

Request:
```json
{
  "message": "Envie fotos melhores dos serviços e informe bairros atendidos."
}
```

## 5. Dashboard do Prestador

### GET `/provider-dashboard/services`
Lista serviços do prestador autenticado.

### POST `/provider-dashboard/services`
Cria serviço.

Request:
```json
{
  "categoryId": "uuid",
  "name": "Design de sobrancelha",
  "description": "Modelagem personalizada.",
  "basePrice": 60,
  "estimatedDurationMinutes": 45
}
```

### PUT `/provider-dashboard/services/{id}`
Atualiza serviço.

### DELETE `/provider-dashboard/services/{id}`
Desativa serviço.

### GET `/provider-dashboard/availability`
Lista disponibilidade.

### PUT `/provider-dashboard/availability`
Substitui disponibilidade semanal.

Request:
```json
{
  "blocks": [
    {
      "dayOfWeek": "MONDAY",
      "startTime": "09:00",
      "endTime": "12:00"
    },
    {
      "dayOfWeek": "MONDAY",
      "startTime": "14:00",
      "endTime": "18:00"
    }
  ]
}
```

## 6. Agendamentos

### POST `/appointments`
Solicita agendamento. Requer `CLIENTE` autenticado.

Request:
```json
{
  "providerId": "uuid",
  "serviceOfferingId": "uuid",
  "scheduledDate": "2026-06-01",
  "startTime": "09:00",
  "clientNote": "Prefiro atendimento pela manhã."
}
```

Response:
```json
{
  "id": "uuid",
  "status": "SOLICITADO"
}
```

### GET `/me/appointments`
Lista agendamentos do usuário autenticado.

### POST `/appointments/{id}/confirm`
Prestador confirma agendamento.

### POST `/appointments/{id}/reject`
Prestador recusa agendamento.

Request:
```json
{
  "reason": "Horário indisponível."
}
```

### POST `/appointments/{id}/cancel`
Cancela agendamento.

Request:
```json
{
  "reason": "Não poderei comparecer."
}
```

## 7. Categorias

### GET `/categories`
Lista categorias públicas.

Response:
```json
[
  { "id": "uuid", "name": "Beleza e estética", "slug": "beleza-estetica" },
  { "id": "uuid", "name": "Casa e manutenção", "slug": "casa-manutencao" }
]
```
