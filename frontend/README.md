# Frontend — Nubo

Frontend SPA do sistema Nubo, desenvolvido com React, TypeScript e Vite.

## Stack
- React
- TypeScript
- Vite
- React Router
- React Hook Form
- Zod
- CSS Modules ou CSS por feature
- SVG inline para identidade visual, ícones e ilustrações

## Telas
- `/` — Landing page
- `/prestadores` — Busca pública de prestadores
- `/prestadores/:id` — Perfil público do prestador
- `/sou-prestador` — Formulário de candidatura
- `/login` — Login
- `/cadastro` — Cadastro
- `/meus-agendamentos` — Área do cliente
- `/prestador` — Dashboard do prestador aprovado
- `/admin` — Dashboard administrativo
- `/admin/candidaturas/:id` — Detalhe de candidatura

## Estrutura Recomendada
```txt
frontend/src/
├── app/
│   ├── routes.tsx
│   ├── providers.tsx
│   └── protected-route.tsx
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

## Variáveis de Ambiente
Criar `.env` com base em `.env.example`.

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Como Rodar
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Convenções
- Componentes reutilizáveis em `components/ui`.
- Componentes de domínio em `features/*/components`.
- Chamadas HTTP em `services`.
- Tipos compartilhados em `types`.
- Formulários com React Hook Form + Zod.
- Rotas protegidas por autenticação e perfil.
- Não colocar regra de negócio complexa dentro de componentes visuais.

## Design
- Marca: Nubo.
- Logo: `../assets/nubo-logo.svg`.
- Visual: leve, confiável, local e moderno.
- Priorizar SVG para ícones e ilustrações.

## Dados Mockados
Permitido usar mocks durante a primeira etapa de UI. Ao final, conectar as telas principais à API real.
