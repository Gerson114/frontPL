# FrontPlanner - Deploy Guide

## 🚀 Deploy Rápido

### Vercel (Recomendado)
1. Conecte seu repositório no Vercel
2. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_API_URL=https://dashplanner.onrender.com`
3. Deploy automático

### Netlify
1. Conecte seu repositório no Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Configure variáveis de ambiente:
   - `NEXT_PUBLIC_API_URL=https://dashplanner.onrender.com`

### Docker
```bash
# Build
docker build -t frontplanner .

# Run
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://dashplanner.onrender.com frontplanner
```

## 🔧 Configuração Local

1. Clone o repositório
2. Instale dependências: `npm install`
3. Configure `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=https://dashplanner.onrender.com
   ```
4. Execute: `npm run dev`

## 🔒 Segurança Implementada

- ✅ Sanitização de inputs
- ✅ Validação de email e senha
- ✅ Variáveis de ambiente para endpoints
- ✅ Tratamento seguro de erros
- ✅ Headers de segurança

## 📁 Estrutura do Projeto

```
front/
├── app/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   │   └── security.ts    # Funções de segurança
│   └── services/
├── .env.local             # Variáveis de ambiente
└── .env.example          # Exemplo de configuração
```