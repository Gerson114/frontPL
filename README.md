# 📊 FrontPlanner Dashboard - Documentação Completa

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Estrutura de Arquivos](#estrutura-de-arquivos)
4. [Configuração](#configuração)
5. [Funcionalidades](#funcionalidades)
6. [Segurança](#segurança)
7. [Deploy](#deploy)
8. [Manutenção](#manutenção)

---

## 🎯 Visão Geral

**FrontPlanner Dashboard** é uma aplicação web moderna para gerenciamento de conversas e atendimento em tempo real, desenvolvida com Next.js 14, TypeScript e Tailwind CSS.

### Características Principais
- ✅ **Dashboard em tempo real** com métricas atualizadas automaticamente
- ✅ **Gestão de atendentes** com rankings e performance
- ✅ **Monitoramento de conversas** com status e histórico
- ✅ **Autenticação segura** com JWT tokens
- ✅ **Design responsivo** mobile-first
- ✅ **Arquitetura modular** e escalável

### Tecnologias Utilizadas
- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Autenticação**: JWT Bearer Token
- **Estado**: React Hooks (useState, useEffect)
- **Requisições**: Fetch API nativo

---

## 🏗️ Arquitetura

### Padrão de Arquitetura
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Next.js)     │◄──►│   (Express)     │◄──►│   (MongoDB)     │
│   Port: 3000    │    │   Port: 8080    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Fluxo de Dados
1. **Autenticação**: Login → JWT Token → localStorage
2. **Requisições**: Token Bearer → Headers → API
3. **Tempo Real**: useRealTime hook → Polling 15-30s
4. **Estado**: React Hooks → Componentes → UI

### Layout System
```
RootLayout (layout.tsx)
├── AuthPages (/login, /register)
└── Dashboard Pages
    ├── Sidebar (global)
    ├── Header (condicional)
    └── Content (dinâmico)
```

---

## 📁 Estrutura de Arquivos

```
front/
├── app/
│   ├── components/           # Componentes reutilizáveis
│   │   ├── Sidebar.js       # Menu lateral
│   │   └── TutorialModal.js # Modal de tutorial
│   ├── hooks/               # Custom hooks
│   │   └── useRealTime.js   # Hook para dados em tempo real
│   ├── pages/               # Páginas de autenticação
│   │   ├── login/
│   │   │   └── page.tsx     # Página de login
│   │   └── register/
│   │       └── page.tsx     # Página de registro
│   ├── utils/               # Utilitários
│   │   ├── security.ts      # Funções de segurança
│   │   └── time.js         # Utilitários de tempo
│   ├── atendentes/
│   │   └── page.tsx        # Página de atendentes
│   ├── conversas/
│   │   └── page.tsx        # Página de conversas
│   ├── dashboard/
│   │   └── page.tsx        # Dashboard principal
│   ├── globals.css         # Estilos globais
│   ├── layout.tsx          # Layout raiz
│   └── page.tsx           # Página inicial
├── .env.local             # Variáveis de ambiente (local)
├── .env.example          # Exemplo de variáveis
├── next.config.js        # Configuração Next.js
├── package.json          # Dependências
└── tailwind.config.js    # Configuração Tailwind
```

---

## ⚙️ Configuração

### 1. Instalação
```bash
# Clone o repositório
git clone <repository-url>
cd frontplanner/front

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
```

### 2. Variáveis de Ambiente (.env.local)
```bash
# URL base da API
NEXT_PUBLIC_API_URL=http://localhost:8080

# Endpoints da API
NEXT_PUBLIC_LOGIN_ENDPOINT=/login
NEXT_PUBLIC_REGISTER_ENDPOINT=/register
NEXT_PUBLIC_CONVERSAS_ENDPOINT=/conversas
NEXT_PUBLIC_STATS_ENDPOINT=/conversas/stats
NEXT_PUBLIC_STATS_MES_ENDPOINT=/conversas/stats-mes
NEXT_PUBLIC_DASH_ATENDENTES_ENDPOINT=/conversas/dash-atendentes
NEXT_PUBLIC_CONVERSAS_ALL_ENDPOINT=/conversas/all
```

### 3. Scripts Disponíveis
```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento (porta 3000)

# Produção
npm run build        # Gera build de produção
npm start           # Inicia servidor de produção

# Utilitários
npm run lint        # Executa linting
npm run type-check  # Verifica tipos TypeScript
```

---

## 🚀 Funcionalidades

### 1. Sistema de Autenticação
**Localização**: `/pages/login` e `/pages/register`

#### Login
- **Validação**: Email e senha obrigatórios
- **Sanitização**: Remove caracteres perigosos
- **Segurança**: Tokens JWT armazenados no localStorage
- **Redirecionamento**: Automático para dashboard após login

#### Registro
- **Campos**: Nome, email, senha, confirmação
- **Validação**: Email válido, senha mínima 6 caracteres
- **Rate Limiting**: Proteção contra spam (429 Too Many Requests)

### 2. Dashboard Principal
**Localização**: `/dashboard`

#### Métricas em Tempo Real
- **Dados Diários**: Novas conversas, concluídos, pendentes
- **Dados Mensais**: Estatísticas agregadas por mês
- **Atualização**: Automática a cada 30 segundos
- **Controles**: Seletores de data e mês

#### Funcionalidades
```typescript
// Exemplo de uso do hook de tempo real
const { data, loading } = useRealTime(async () => {
  const response = await fetch(endpoint, { headers })
  return response.json()
}, 30000) // Atualiza a cada 30s
```

### 3. Gestão de Atendentes
**Localização**: `/atendentes`

#### Recursos
- **Métricas**: Total atendimentos, concluídos, recebidos, iniciados
- **Lista**: Todos os atendentes com status e performance
- **Ranking**: Ordenação por satisfação e tempo de resposta
- **Status**: Online, ocupado, offline com indicadores visuais

### 4. Monitoramento de Conversas
**Localização**: `/conversas`

#### Recursos
- **Lista Completa**: Todas as conversas com detalhes
- **Status**: Concluído, em andamento, pendente, novo
- **Informações**: Cliente, telefone, atendente, timestamps
- **Última Mensagem**: Preview da conversa
- **Ações**: Botão "Ver Detalhes" para cada conversa

---

## 🔒 Segurança

### 1. Proteção contra XSS
```typescript
// utils/security.ts
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>"'&]/g, '')
}
```

### 2. Validação de Entrada
```typescript
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 6
}
```

### 3. Autenticação JWT
```typescript
// Todas as requisições protegidas incluem:
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}
```

### 4. Variáveis de Ambiente
- ✅ **Endpoints centralizados** em `.env.local`
- ✅ **Fallbacks seguros** para URLs padrão
- ✅ **Sem hardcoding** de URLs sensíveis

### 5. Verificação de Autenticação
```typescript
// Verificação automática em todas as páginas protegidas
useEffect(() => {
  const token = localStorage.getItem('token')
  if (!token) {
    window.location.href = '/pages/login'
  }
}, [])
```

---

## 🌐 Deploy

### 1. Preparação para Produção

#### Configurar Variáveis de Ambiente
```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.seudominio.com
NEXT_PUBLIC_LOGIN_ENDPOINT=/login
# ... outros endpoints
```

#### Build de Produção
```bash
npm run build
npm start
```

### 2. Plataformas Recomendadas

#### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Build command
npm run build

# Publish directory
out/
```

#### AWS Amplify
```bash
# Build settings
build:
  commands:
    - npm run build
  artifacts:
    - '**/*'
```

### 3. Configurações de Deploy

#### Next.js Config
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Para Docker
  trailingSlash: true,  // Para hosting estático
}

module.exports = nextConfig
```

#### CORS Backend
```javascript
// Configure CORS no backend para aceitar seu domínio
app.use(cors({
  origin: ['https://seudominio.com', 'http://localhost:3000'],
  credentials: true
}))
```

---

## 🛠️ Manutenção

### 1. Monitoramento

#### Logs de Erro
```typescript
// Implementar error boundary
try {
  const response = await fetch(endpoint)
  if (!response.ok) {
    console.error('API Error:', response.status)
  }
} catch (error) {
  console.error('Network Error:', error)
}
```

#### Performance
- **Lighthouse**: Auditoria de performance
- **Web Vitals**: Métricas de experiência do usuário
- **Bundle Analyzer**: Análise do tamanho do bundle

### 2. Atualizações

#### Dependências
```bash
# Verificar atualizações
npm outdated

# Atualizar dependências
npm update

# Atualizar Next.js
npm install next@latest react@latest react-dom@latest
```

#### Segurança
```bash
# Auditoria de segurança
npm audit

# Corrigir vulnerabilidades
npm audit fix
```

### 3. Backup e Versionamento

#### Git Workflow
```bash
# Branches recomendadas
main        # Produção
develop     # Desenvolvimento
feature/*   # Novas funcionalidades
hotfix/*    # Correções urgentes
```

#### Versionamento Semântico
```
MAJOR.MINOR.PATCH
1.0.0 - Release inicial
1.1.0 - Nova funcionalidade
1.1.1 - Correção de bug
```

---

## 📊 Métricas e Analytics

### 1. Performance Targets
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

### 2. Monitoramento de Uso
```typescript
// Implementar analytics (Google Analytics, Mixpanel, etc.)
gtag('event', 'page_view', {
  page_title: document.title,
  page_location: window.location.href
})
```

---

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Erro 401 (Unauthorized)
**Causa**: Token expirado ou inválido
**Solução**: Fazer logout e login novamente

#### 2. Erro CORS
**Causa**: Backend não configurado para aceitar origem
**Solução**: Configurar CORS no backend

#### 3. Build Falha
**Causa**: Erro de TypeScript ou dependências
**Solução**: 
```bash
npm run type-check
npm install
```

#### 4. Variáveis de Ambiente
**Causa**: `.env.local` não configurado
**Solução**: Copiar de `.env.example` e configurar

---

## 📞 Suporte

### Contatos
- **Desenvolvedor**: [Seu Nome]
- **Email**: [seu@email.com]
- **Repositório**: [URL do repositório]

### Recursos Úteis
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## 📝 Changelog

### v1.0.0 (2024-01-04)
- ✅ Sistema de autenticação completo
- ✅ Dashboard com métricas em tempo real
- ✅ Gestão de atendentes e conversas
- ✅ Layout responsivo e moderno
- ✅ Segurança implementada
- ✅ Pronto para produção

---

**© 2024 FrontPlanner Dashboard - Todos os direitos reservados**