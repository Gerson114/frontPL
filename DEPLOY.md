# 🚀 Guia de Deploy - FrontPlanner Dashboard

## 📋 Pré-requisitos

### Ambiente de Desenvolvimento
- ✅ Node.js 18+ instalado
- ✅ npm ou yarn configurado
- ✅ Git configurado
- ✅ Backend API funcionando

### Verificações Antes do Deploy
```bash
# 1. Teste local
npm run dev

# 2. Build de produção
npm run build

# 3. Teste do build
npm start

# 4. Verificar variáveis de ambiente
cat .env.local
```

---

## 🌐 Deploy na Vercel (Recomendado)

### 1. Preparação
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login na Vercel
vercel login
```

### 2. Configuração do Projeto
```bash
# No diretório do projeto
cd frontplanner/front

# Inicializar projeto Vercel
vercel

# Seguir as instruções:
# ? Set up and deploy "front"? [Y/n] y
# ? Which scope? [Seu usuário]
# ? Link to existing project? [N/y] n
# ? What's your project's name? frontplanner-dashboard
# ? In which directory is your code located? ./
```

### 3. Configurar Variáveis de Ambiente
```bash
# Via CLI
vercel env add NEXT_PUBLIC_API_URL
# Inserir: https://api.seudominio.com

vercel env add NEXT_PUBLIC_LOGIN_ENDPOINT
# Inserir: /login

# Repetir para todas as variáveis...
```

### 4. Deploy para Produção
```bash
# Deploy
vercel --prod

# URL será exibida:
# ✅ Production: https://frontplanner-dashboard.vercel.app
```

### 5. Configuração de Domínio Customizado
```bash
# Adicionar domínio
vercel domains add seudominio.com

# Configurar DNS
# A record: @ → 76.76.19.61
# CNAME: www → cname.vercel-dns.com
```

---

## 🔧 Deploy na Netlify

### 1. Via Git (Recomendado)
```bash
# 1. Push para GitHub
git add .
git commit -m "Deploy: Production ready"
git push origin main

# 2. Conectar no Netlify
# - Acesse netlify.com
# - "New site from Git"
# - Conecte GitHub
# - Selecione repositório
```

### 2. Configurações de Build
```yaml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. Variáveis de Ambiente
```bash
# No painel Netlify:
# Site settings → Environment variables

NEXT_PUBLIC_API_URL=https://api.seudominio.com
NEXT_PUBLIC_LOGIN_ENDPOINT=/login
# ... outras variáveis
```

---

## ☁️ Deploy na AWS Amplify

### 1. Preparação
```bash
# Instalar AWS CLI
npm install -g @aws-amplify/cli

# Configurar credenciais
amplify configure
```

### 2. Inicializar Projeto
```bash
# No diretório do projeto
amplify init

# Configurações:
# ? Enter a name for the project: frontplanner
# ? Enter a name for the environment: prod
# ? Choose your default editor: Visual Studio Code
# ? Choose the type of app: javascript
# ? What javascript framework: react
# ? Source Directory Path: ./
# ? Distribution Directory Path: .next
# ? Build Command: npm run build
# ? Start Command: npm start
```

### 3. Adicionar Hosting
```bash
amplify add hosting

# Escolher:
# ? Select the plugin module: Amazon CloudFront and S3
# ? Select the environment setup: PROD (S3 with CloudFront)
```

### 4. Deploy
```bash
amplify publish

# URL será gerada automaticamente
```

---

## 🐳 Deploy com Docker

### 1. Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8080
      - NEXT_PUBLIC_LOGIN_ENDPOINT=/login
    depends_on:
      - backend
    networks:
      - app-network

  backend:
    image: seu-backend:latest
    ports:
      - "8080:8080"
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### 3. Build e Run
```bash
# Build da imagem
docker build -t frontplanner-frontend .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.seudominio.com \
  frontplanner-frontend

# Ou com docker-compose
docker-compose up -d
```

---

## 🔒 Configurações de Segurança

### 1. HTTPS/SSL
```bash
# Vercel/Netlify: Automático
# AWS: Configure CloudFront
# Docker: Use nginx proxy

# nginx.conf para Docker
server {
    listen 443 ssl;
    server_name seudominio.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 2. Variáveis de Ambiente Seguras
```bash
# Produção - nunca commitar
NEXT_PUBLIC_API_URL=https://api.producao.com
NEXT_PUBLIC_LOGIN_ENDPOINT=/login

# Staging
NEXT_PUBLIC_API_URL=https://api.staging.com

# Development
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 3. Headers de Segurança
```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}
```

---

## 📊 Monitoramento Pós-Deploy

### 1. Health Checks
```bash
# Verificar se a aplicação está rodando
curl -I https://seudominio.com

# Verificar API connectivity
curl https://seudominio.com/api/health
```

### 2. Performance Monitoring
```javascript
// Implementar Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

### 3. Error Tracking
```javascript
// Implementar Sentry ou similar
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV
})
```

---

## 🔄 CI/CD Pipeline

### 1. GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

### 2. Staging Environment
```bash
# Branch develop → staging
# Branch main → production

# Configurar múltiplos ambientes
vercel env add NEXT_PUBLIC_API_URL staging
vercel env add NEXT_PUBLIC_API_URL production
```

---

## 🛠️ Troubleshooting

### Problemas Comuns

#### 1. Build Falha
```bash
# Erro: TypeScript errors
npm run type-check

# Erro: Dependências
rm -rf node_modules package-lock.json
npm install

# Erro: Memória
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

#### 2. Variáveis de Ambiente
```bash
# Verificar se estão definidas
echo $NEXT_PUBLIC_API_URL

# Redeployar com novas variáveis
vercel env pull .env.local
vercel --prod
```

#### 3. CORS Errors
```javascript
// Backend deve aceitar origem do frontend
app.use(cors({
  origin: ['https://seudominio.com'],
  credentials: true
}))
```

---

## ✅ Checklist de Deploy

### Pré-Deploy
- [ ] Testes locais passando
- [ ] Build de produção funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Backend API acessível
- [ ] CORS configurado no backend

### Deploy
- [ ] Domínio configurado
- [ ] SSL/HTTPS ativo
- [ ] Variáveis de ambiente no serviço
- [ ] Build automático funcionando
- [ ] Redirects configurados

### Pós-Deploy
- [ ] Site acessível
- [ ] Login funcionando
- [ ] API calls funcionando
- [ ] Performance aceitável (< 3s load)
- [ ] Mobile responsivo
- [ ] Monitoramento ativo

---

## 📞 Suporte

### Em caso de problemas:
1. **Verificar logs** do serviço de deploy
2. **Testar localmente** com as mesmas variáveis
3. **Verificar status** do backend API
4. **Contatar suporte** da plataforma de deploy

### Contatos
- **Desenvolvedor**: [Seu Nome]
- **Email**: [seu@email.com]
- **Slack**: #frontend-support

---

**🎉 Parabéns! Sua aplicação está no ar!**