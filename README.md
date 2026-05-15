# Nubo

Sistema de agendamentos para conectar clientes a prestadores de serviço por região, necessidade, categoria, disponibilidade e avaliação. O sistema possui três perfis principais: cliente, prestador e moderador. O cliente pode enviar candidatura pública e continua sendo cliente até a aprovação; quando aprovado, ganha uma área própria para gerenciar serviços, localidades e agenda.

---

## 🚧 Status do Projeto
![Status](https://img.shields.io/badge/status-prot%C3%B3tipo-007ec6?style=for-the-badge)
![Backend](https://img.shields.io/badge/backend-Spring%20Boot%203-007ec6?style=for-the-badge)
![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20TypeScript-007ec6?style=for-the-badge)
![Database](https://img.shields.io/badge/database-PostgreSQL-007ec6?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-007ec6?style=for-the-badge)

---

## 📚 Índice
- [Links Úteis](#-links-úteis)
- [READMEs Específicos](#-readmes-específicos)
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Como Rodar Localmente](#-como-rodar-localmente)
- [Build](#-build)
- [Endpoints Principais](#-endpoints-principais)
- [Perfis e Permissões](#-perfis-e-permissões)
- [Fluxos Principais](#-fluxos-principais)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Screenshots / Preview](#-screenshots--preview)
- [Documentação](#-documentação)
- [Troubleshooting](#-troubleshooting)
- [Autores](#-autores)
- [Licença](#-licença)

---

## 🔗 Links Úteis
- 🐙 **Repositório:** `a definir`
- ☁️ **Deploy Frontend:** `a definir`
- 🔌 **Deploy Backend / API:** `a definir`
- 📄 **Documentação adicional:** [`./docs`](./docs)

---

## 📘 READMEs Específicos
- **README Geral:** [`./README.md`](./README.md)
- **README do Frontend:** [`./frontend/README.md`](./frontend/README.md)
- **README do Backend:** [`./backend/README.md`](./backend/README.md)
- **Instruções para Codex:** [`./AGENTS.md`](./AGENTS.md)

---

## 📝 Sobre o Projeto
O **Nubo** é uma plataforma para descoberta, aprovação e agendamento de serviços locais. A solução busca reduzir a dificuldade de encontrar prestadores confiáveis por região e disponibilidade, centralizando cadastro, curadoria administrativa, exposição de serviços e agenda.

O escopo do protótipo cobre:
- landing page criativa com identidade visual própria, logo SVG e ilustrações SVG;
- busca pública de prestadores com filtros por região, serviço, preço, avaliação e disponibilidade;
- formulário público para candidatura de prestador;
- painel administrativo para aprovar, rejeitar ou solicitar ajuste no cadastro;
- painel do prestador aprovado para gerenciar serviços, localidades, fotos e agenda;
- fluxo básico de agendamento entre cliente e prestador.

---

## ✨ Funcionalidades

### Funcionalidades do Cliente
- Visualizar landing page com proposta de valor, categorias e CTA de busca.
- Buscar prestadores por cidade, bairro/região, categoria, serviço, disponibilidade, avaliação e faixa de preço.
- Ver perfil público do prestador com descrição, fotos, serviços, regiões atendidas, contatos e agenda disponível.
- Criar solicitação de agendamento informando serviço, data, horário e observação.
- Acompanhar agendamentos próprios.
- Cancelar agendamento dentro das regras configuradas.

### Funcionalidades do Prestador
- Entrar como usuário comum e acessar o CTA **“Sou prestador”**.
- Enviar formulário de candidatura com nome, contato, descrição, região de atuação, categorias, serviços, preço base e fotos.
- Acompanhar status da candidatura: `PENDENTE`, `APROVADO`, `REJEITADO`, `AJUSTE_SOLICITADO`.
- Quando aprovado, acessar painel próprio com:
  - lista de serviços oferecidos;
  - regiões/localidades atendidas;
  - agenda e disponibilidade;
  - fotos de perfil e portfólio;
  - solicitações de agendamento recebidas.

### Funcionalidades Administrativas
- Listar candidaturas de prestadores pendentes.
- Ver detalhes completos do formulário enviado.
- Aprovar prestador e publicar perfil na busca pública.
- Rejeitar candidatura com justificativa.
- Solicitar ajuste com mensagem objetiva.
- Desativar prestador publicado, se necessário.
- Visualizar resumo de prestadores, clientes e agendamentos.

### Integrações externas futuras
- WhatsApp para contato direto e lembretes.
- Geocodificação por CEP/cidade/bairro.
- Gateway de pagamento, caso haja reserva paga.
- Armazenamento externo para imagens em produção.

---

## 🛠 Tecnologias

### Backend
- **Java 21**
- **Spring Boot 3.x**
- **Spring Web**
- **Spring Security + JWT**
- **Spring Data JPA**
- **Bean Validation**
- **Flyway**
- **SpringDoc OpenAPI / Swagger**
- **PostgreSQL**

### Frontend
- **React**
- **TypeScript**
- **Vite**
- **React Router**
- **React Hook Form**
- **Zod**
- **CSS Modules ou CSS por feature**
- **SVG inline para logo, ícones e ilustrações principais**

### Banco de Dados
- **PostgreSQL 16+**

### Infraestrutura / Deploy
- **Docker Compose** para ambiente local completo.
- **Vercel** para frontend, se separado.
- **Render/Railway/Fly.io/VPS** para backend, conforme orçamento.

### Documentação
- **Markdown**
- **OpenAPI/Swagger**
- **PlantUML**, futuramente, para diagramas de componentes e implantação.

---

## 🏗️ Arquitetura

### Decisão recomendada
Para este protótipo, usar:

**Frontend SPA + REST API + Modular Monolith + DDD pragmático + módulos com camadas internas leves.**

Motivos:
- o sistema tem domínios claros, mas ainda não justifica microservices;
- há regras relevantes de aprovação, agenda, busca, perfil público e permissões;
- o deploy inicial deve ser simples;
- a organização por módulos evita backend bagunçado enquanto mantém produtividade.

### Visão Geral
O projeto adota uma arquitetura cliente-servidor:

- **Frontend:** interface pública, área do cliente, área do prestador e área administrativa.
- **Backend:** API REST, autenticação, autorização, validações, regras de negócio e persistência.
- **Banco de dados:** persistência transacional de usuários, prestadores, serviços, agenda e agendamentos.
- **Armazenamento de imagens:** no protótipo pode ser simulado com URLs; em produção deve usar storage externo.

### Organização da Solução
- `frontend/` → SPA em React + TypeScript.
- `backend/` → API em Spring Boot.
- `docs/` → requisitos, arquitetura, API, UI/UX e critérios de aceite.
- `assets/` → logo SVG e recursos estáticos documentais.

### Organização por Domínio no Backend
Módulos sugeridos:
- `identity` → autenticação, usuários, papéis e permissões.
- `provider` → candidatura, aprovação, perfil público e portfólio.
- `catalog` → categorias e serviços.
- `availability` → agenda, dias, horários e bloqueios.
- `appointment` → solicitação, confirmação, cancelamento e histórico.
- `admin` → visões administrativas e moderação.
- `shared` → exceções, segurança, paginação, auditoria, utilitários.

Cada módulo deve conter, quando necessário:
- `api` para controllers e DTOs;
- `application` para services/facades/use cases;
- `domain` para entidades, enums, regras e value objects;
- `infrastructure` para repositories, adapters e persistência.

### Organização do Frontend
- `pages` para telas roteáveis.
- `features` para domínios funcionais.
- `components` para componentes reutilizáveis.
- `services` para comunicação HTTP.
- `hooks` para estado e comportamento.
- `types` para contratos e DTOs.
- `assets/svg` para logo, ícones e ilustrações SVG.

### Fluxo Geral da Aplicação
`Usuário -> Frontend -> API REST -> Controller -> Application Service/Facade -> Domain -> Repository -> PostgreSQL`

### Padrões e Convenções Adotados
- Controllers enxutos.
- DTOs para entrada e saída.
- Validação explícita com Bean Validation e Zod.
- Services/facades para orquestração de casos de uso.
- Regras importantes próximas do domínio.
- Repositories isolando persistência.
- Baixo acoplamento e alta coesão.
- Autorização por perfil e por dono do recurso.
- Tratamento global de erros.
- Migrações versionadas com Flyway.
- Testes unitários nos serviços e testes de integração nos endpoints principais.

---

## 🔐 Variáveis de Ambiente

| Variável | Obrigatória | Contexto | Descrição | Exemplo |
|---|---|---|---|---|
| `DATABASE_URL` | Sim | Backend | URL JDBC do PostgreSQL | `jdbc:postgresql://localhost:5432/nubo` |
| `DATABASE_USERNAME` | Sim | Backend | Usuário do banco | `nubo` |
| `DATABASE_PASSWORD` | Sim | Backend | Senha do banco | `nubo123` |
| `JWT_SECRET` | Sim | Backend | Segredo para assinar tokens JWT | `trocar-em-producao` |
| `JWT_EXPIRATION_MINUTES` | Sim | Backend | Tempo de expiração do token | `120` |
| `CORS_ALLOWED_ORIGINS` | Sim | Backend | Origens permitidas | `http://localhost:5173` |
| `VITE_API_BASE_URL` | Sim | Frontend | URL base da API | `http://localhost:8080/api` |

---

## ▶️ Como Rodar Localmente

### Pré-requisitos
- **Java 21+**
- **Node.js 20+**
- **Docker + Docker Compose**
- **PostgreSQL**, se não usar Docker

### Backend
```bash
cd backend
./mvnw spring-boot:run
```

Por padrão:
```bash
http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Por padrão:
```bash
http://localhost:5173
```

### Ambiente completo com Docker Compose
```bash
docker compose up --build
```

---

## 🧱 Build

### Backend
```bash
cd backend
./mvnw clean package
```

### Frontend
```bash
cd frontend
npm run build
```

---

## 🔌 Endpoints Principais

| Método | Endpoint | Descrição | Perfil |
|---|---|---|---|
| `POST` | `/api/auth/register` | Criar conta | Público |
| `POST` | `/api/auth/login` | Autenticar usuário | Público |
| `GET` | `/api/providers` | Buscar prestadores publicados com filtros | Público/Cliente |
| `GET` | `/api/providers/{id}` | Ver perfil público do prestador | Público/Cliente |
| `POST` | `/api/provider-applications` | Enviar candidatura de prestador | Usuário autenticado |
| `GET` | `/api/me/provider-application` | Ver status da candidatura | Prestador candidato |
| `GET` | `/api/admin/provider-applications` | Listar candidaturas | Moderador |
| `POST` | `/api/admin/provider-applications/{id}/approve` | Aprovar candidatura | Moderador |
| `POST` | `/api/admin/provider-applications/{id}/reject` | Rejeitar candidatura | Moderador |
| `POST` | `/api/admin/provider-applications/{id}/request-changes` | Solicitar ajuste | Moderador |
| `GET` | `/api/provider-dashboard/services` | Listar serviços do prestador | Prestador aprovado |
| `POST` | `/api/provider-dashboard/services` | Criar serviço | Prestador aprovado |
| `GET` | `/api/provider-dashboard/availability` | Consultar agenda | Prestador aprovado |
| `PUT` | `/api/provider-dashboard/availability` | Atualizar disponibilidade | Prestador aprovado |
| `POST` | `/api/appointments` | Solicitar agendamento | Cliente |
| `GET` | `/api/me/appointments` | Listar meus agendamentos | Cliente/Prestador |
| `POST` | `/api/appointments/{id}/confirm` | Confirmar agendamento | Prestador aprovado |
| `POST` | `/api/appointments/{id}/cancel` | Cancelar agendamento | Cliente/Prestador/Moderador |

### Documentação da API
- **Swagger / OpenAPI:** `http://localhost:8080/swagger-ui.html`
- **README do Backend:** [`./backend/README.md`](./backend/README.md)

---

## 👥 Perfis e Permissões

| Perfil | Responsabilidades principais | Acessos típicos |
|---|---|---|
| `CLIENTE` | Buscar prestadores e solicitar agendamentos | Busca, perfil público, agenda, meus agendamentos |
| `PRESTADOR` | Gerenciar serviços, localidades, portfólio e agenda | Painel do prestador, solicitações recebidas |
| `MODERADOR` | Analisar cadastros conforme permissão delegada | Fila de aprovação, detalhes, aprovar/rejeitar/solicitar ajuste |

> Cliente com candidatura pendente continua com papel `CLIENTE` até a aprovação.

---

## 🔄 Fluxos Principais

### 1. Busca e agendamento pelo cliente
1. Cliente acessa landing page.
2. Cliente usa filtros de região, serviço e disponibilidade.
3. Sistema lista prestadores aprovados e publicados.
4. Cliente abre perfil do prestador.
5. Cliente escolhe serviço, data e horário disponível.
6. Sistema cria agendamento com status `SOLICITADO`.
7. Prestador confirma ou recusa.

### 2. Candidatura do prestador
1. Usuário comum acessa o CTA **“Sou prestador”**.
2. Usuário preenche formulário com dados básicos, atuação, serviços, descrição e fotos.
3. Sistema registra candidatura com status `PENDENTE`.
4. Moderador analisa.
5. Moderador aprova, rejeita ou solicita ajustes.
6. Quando aprovado, o usuário recebe papel `PRESTADOR` e ganha acesso ao painel.

### 3. Moderação administrativa
1. Moderador acessa painel.
2. Moderador filtra candidaturas por status.
3. Moderador abre os detalhes da candidatura.
4. Moderador decide aprovar, rejeitar ou solicitar ajustes.
5. Sistema registra auditoria básica da decisão.
6. Prestador visualiza o novo status.

### 4. Gestão de agenda do prestador
1. Prestador aprovado acessa o painel.
2. Prestador cadastra serviços e áreas atendidas.
3. Prestador configura disponibilidade semanal e exceções.
4. Sistema expõe horários livres no perfil público.
5. Prestador confirma, recusa ou cancela agendamentos.

---

## 📁 Estrutura de Pastas
```txt
.
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/nubo/
│   │   │   │   ├── identity/
│   │   │   │   ├── provider/
│   │   │   │   ├── catalog/
│   │   │   │   ├── availability/
│   │   │   │   ├── appointment/
│   │   │   │   ├── admin/
│   │   │   │   └── shared/
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── db/migration/
│   │   ├── test/
│   │   └── pom.xml
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── assets/svg/
│   │   ├── components/
│   │   ├── features/
│   │   │   ├── landing/
│   │   │   ├── providers/
│   │   │   ├── applications/
│   │   │   ├── admin/
│   │   │   ├── appointments/
│   │   │   └── auth/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── types/
│   ├── package.json
│   └── README.md
├── docs/
│   ├── REQUISITOS.md
│   ├── ARQUITETURA.md
│   ├── API.md
├── assets/
│   └── nubo-logo.svg
├── AGENTS.md
├── README.md
└── LICENSE
```

---

## 🖼️ Screenshots / Preview

### Tela 1 — Landing Page
Hero com logo SVG, CTA de busca, CTA **“Sou prestador”**, ilustração SVG de agenda/localização e blocos de categorias.

### Tela 2 — Busca de Prestadores
Tela com filtros laterais/superiores, cards de prestadores e ordenação por relevância, avaliação e disponibilidade.

### Tela 3 — Painel Administrativo
Fila de candidaturas, detalhes do formulário, preview de fotos e botões de decisão.

### Tela 4 — Painel do Prestador
Serviços, localidades, portfólio e agenda semanal.

---

## 📖 Documentação

### Requisitos
- [Requisitos do Sistema](./docs/REQUISITOS.md)

### Arquitetura
- [Arquitetura](./docs/ARQUITETURA.md)
- [API](./docs/API.md)

### Codex
- [Instruções de Agente](./AGENTS.md)

---

## 🛠️ Troubleshooting

### Backend não sobe
Verifique:
- `DATABASE_URL`, `DATABASE_USERNAME` e `DATABASE_PASSWORD`;
- container do PostgreSQL ativo;
- migrations Flyway;
- porta `8080` livre.

### Frontend não conecta na API
Verifique:
- `VITE_API_BASE_URL`;
- CORS no backend;
- backend rodando;
- token JWT salvo corretamente.

### Login retorna 401
Verifique:
- credenciais de seed;
- hash de senha;
- configuração de JWT;
- header `Authorization: Bearer <token>`.

### Imagens não aparecem no protótipo
No protótipo, use URLs mockadas ou imagens locais em `frontend/src/assets/mock`. Em produção, mover para storage externo.

---

## 👥 Autores
Projeto iniciado por Pedro Henrique Silva Vargas.

---

## 📄 Licença
Este projeto está sob a licença **MIT**. Consulte o arquivo `LICENSE` para mais detalhes.
