# AGENTS.md — Nubo

Este arquivo orienta agentes de IA, especialmente Codex, na criação e manutenção do protótipo **Nubo**.

## Objetivo do Projeto
Criar um sistema full-stack de agendamentos onde:
- clientes encontram prestadores por região e necessidade;
- prestadores se candidatam por formulário público;
- admin/moderador aprova ou rejeita prestadores;
- prestadores aprovados gerenciam serviços, localidades, fotos e agenda;
- clientes solicitam agendamentos com prestadores aprovados.

## Decisão Arquitetural Obrigatória
Usar:
- **Frontend SPA** com React + TypeScript + Vite;
- **Backend REST API** com Spring Boot 3.x + Java 21;
- **PostgreSQL**;
- **Modular Monolith** no backend;
- **DDD pragmático**;
- **módulos por domínio com camadas internas leves**.

Não criar microservices. Não criar GraphQL. Não criar backend serverless. O objetivo do protótipo é ter simplicidade operacional com organização suficiente para crescer.

## Nome e Identidade
- Marca: **Nubo**.
- Usar logo SVG em `assets/nubo-logo.svg` ou equivalente no frontend.
- Usar SVG inline sempre que fizer sentido para: logo, ícones principais, ilustrações da landing page, estados vazios e elementos decorativos.
- Não depender obrigatoriamente de bibliotecas externas de ícones. Preferir componentes SVG locais.

## Prioridades de Implementação
1. Estrutura do repositório.
2. Frontend navegável com telas principais.
3. Backend com entidades, DTOs, controllers, services/facades, repositories e migrations.
4. Autenticação e autorização por perfil.
5. Fluxo de candidatura do prestador.
6. Fluxo de aprovação administrativa.
7. Busca pública de prestadores aprovados.
8. Agenda e agendamento básico.
9. Testes mínimos.
10. Documentação operacional.

## Perfis do Sistema
Usar estes perfis:
- `CLIENTE`
- `PRESTADOR`
- `MODERADOR`

Regra:
- todo usuário novo pode agir como cliente;
- ao enviar candidatura, continua com perfil `CLIENTE`;
- apenas após aprovação administrativa ganha acesso a recursos de prestador;
- moderador pode analisar candidaturas e decidir, mas não deve alterar configurações críticas do sistema.

## Regras de Negócio Obrigatórias

### Prestador
- Prestador só aparece na busca pública se a candidatura estiver `APROVADA` e o perfil estiver `ATIVO`.
- Prestador deve informar ao menos:
  - nome público;
  - telefone ou WhatsApp;
  - cidade/região de atuação;
  - categoria principal;
  - ao menos um serviço;
  - descrição curta;
  - foto de perfil ou placeholder.
- Status da candidatura:
  - `PENDENTE`
  - `APROVADO`
  - `REJEITADO`
  - `AJUSTE_SOLICITADO`

### Cliente
- Cliente pode buscar prestadores sem login.
- Cliente precisa estar autenticado para solicitar agendamento.
- Cliente só pode ver e alterar os próprios agendamentos.

### Moderador
- Moderador deve ver fila de candidaturas.
- Aprovação deve criar ou ativar o perfil público do prestador.
- Rejeição e solicitação de ajuste devem exigir justificativa.
- Decisões administrativas devem registrar data, responsável e justificativa.

### Agenda
- Prestador configura disponibilidade semanal.
- Agendamento deve ter status:
  - `SOLICITADO`
  - `CONFIRMADO`
  - `RECUSADO`
  - `CANCELADO`
  - `CONCLUIDO`
- Não permitir dois agendamentos confirmados no mesmo horário para o mesmo prestador.
- No protótipo, a disponibilidade pode ser simplificada por blocos de horário.

## Backend — Convenções Obrigatórias

### Pacote Base
Usar pacote base:
```txt
com.nubo
```

### Estrutura por Módulo
Cada módulo deve seguir, quando aplicável:
```txt
module/
├── api/
│   ├── Controller.java
│   └── dto/
├── application/
│   ├── Service.java
│   └── facade/
├── domain/
│   ├── model/
│   ├── enum/
│   └── rule/
└── infrastructure/
    └── persistence/
```

### Módulos Backend
Criar estes módulos:
- `identity`
- `provider`
- `catalog`
- `availability`
- `appointment`
- `admin`
- `shared`

### Controllers
- Controllers não devem conter regra de negócio.
- Controllers recebem DTOs, validam com Bean Validation e chamam services/facades.
- Controllers retornam DTOs de resposta.

### DTOs
- Separar request e response quando fizer sentido.
- Não expor entidades JPA diretamente em respostas.

### Services/Facades
- Services/facades orquestram casos de uso.
- Regra de autorização fina pode ficar em services ou componente de policy.
- Evitar service gigante. Separar por caso de uso quando crescer.

### Repositories
- Usar Spring Data JPA.
- Não espalhar queries pelo service.
- Consultas complexas podem usar specifications ou query methods bem nomeados.

### Erros
Criar tratamento global com:
- `@ControllerAdvice`
- payload padronizado: `timestamp`, `status`, `error`, `message`, `path`, `details`.

### Segurança
- Usar Spring Security.
- Usar JWT stateless.
- Hash de senha com BCrypt.
- Proteger rotas por perfil.
- Validar ownership dos recursos.
- Configurar CORS por variável de ambiente.
- Nunca commitar segredos reais.

### Banco
- Usar Flyway.
- Criar migrations iniciais.
- Seed de dados para desenvolvimento com usuários de teste.

## Frontend — Convenções Obrigatórias

### Estrutura Recomendada
```txt
frontend/src/
├── app/
│   ├── routes.tsx
│   └── providers.tsx
├── assets/
│   └── svg/
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
├── hooks/
├── pages/
├── services/
├── types/
└── main.tsx
```

### UI
Criar uma landing page criativa e responsiva com:
- hero visual forte;
- logo SVG;
- ilustração SVG de agenda + localização + prestadores;
- CTA primário: `Encontrar prestador`;
- CTA secundário: `Sou prestador`;
- seção de como funciona;
- seção de categorias;
- seção de confiança/curadoria;
- bloco para prestadores;
- footer.

### Telas obrigatórias
- `/` Landing page.
- `/prestadores` Busca/listagem de prestadores.
- `/prestadores/:id` Perfil público do prestador.
- `/sou-prestador` Formulário de candidatura.
- `/login` Login.
- `/cadastro` Cadastro.
- `/meus-agendamentos` Área do cliente.
- `/prestador` Dashboard do prestador aprovado.
- `/admin` Dashboard administrativo.
- `/admin/candidaturas/:id` Detalhe da candidatura.

### Estado e API
- Criar camada `services/apiClient.ts`.
- Centralizar token JWT.
- Criar interceptação simples para Authorization header.
- Usar React Hook Form + Zod nos formulários.
- Usar tipos TypeScript compartilhados em `types`.

### Responsividade
- Mobile-first.
- Breakpoints aproximados: 480px, 768px, 1024px, 1280px.
- Evitar overflow horizontal.
- Filtros da busca devem virar drawer ou bloco recolhível no mobile.

## Dados Mockados Permitidos
Na primeira etapa, é permitido mockar dados no frontend para construir a navegação e UI. Porém, ao terminar, conectar com a API real nas telas principais.

## Rotas Públicas e Privadas

### Públicas
- `/`
- `/prestadores`
- `/prestadores/:id`
- `/sou-prestador`
- `/login`
- `/cadastro`

### Autenticadas
- `/meus-agendamentos`
- `/prestador`
- `/admin`

### Protegidas por perfil
- `/prestador` → `PRESTADOR`
- `/admin` → `MODERADOR`

## Critérios de Aceite Técnicos
- `npm run build` deve passar no frontend.
- `./mvnw test` deve passar no backend.
- `docker compose up --build` deve subir frontend, backend e PostgreSQL.
- Swagger deve estar acessível localmente.
- As rotas protegidas não devem abrir sem login.
- Prestador pendente não deve acessar painel de prestador.
- Prestador não aprovado não deve aparecer na busca pública.

## Não Fazer
- Não criar código em um único arquivo gigante.
- Não misturar regra de negócio em controller.
- Não expor entidade JPA diretamente.
- Não deixar senha em texto puro.
- Não ignorar autorização por ownership.
- Não criar microservices.
- Não usar imagens pesadas onde SVG simples resolve.
- Não deixar dados mockados como se fossem integração final.

## Ordem Recomendada para o Codex
1. Criar estrutura de pastas.
2. Criar frontend base com rotas e layout.
3. Criar landing page completa com SVGs.
4. Criar telas mockadas principais.
5. Criar backend base com segurança, banco e migrations.
6. Criar endpoints de auth.
7. Criar fluxo de candidatura.
8. Criar fluxo de aprovação admin.
9. Criar busca de prestadores aprovados.
10. Criar agenda/agendamento.
11. Conectar frontend à API.
12. Adicionar testes e documentação.

## Comandos Esperados
Frontend:
```bash
cd frontend
npm install
npm run dev
npm run build
```

Backend:
```bash
cd backend
./mvnw spring-boot:run
./mvnw test
```

Docker:
```bash
docker compose up --build
```
