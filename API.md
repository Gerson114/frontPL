# 🔌 API Documentation - FrontPlanner Backend Integration

## 📋 Endpoints Overview

### Base URL
```
Development: http://localhost:8080
Production: https://api.seudominio.com
```

---

## 🔐 Authentication Endpoints

### POST /login
**Descrição**: Autentica usuário e retorna JWT token

**Request Body**:
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response Success (200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "Nome do Usuário",
    "email": "usuario@email.com"
  }
}
```

**Response Error (401)**:
```json
{
  "error": "Credenciais inválidas"
}
```

### POST /register
**Descrição**: Registra novo usuário

**Request Body**:
```json
{
  "name": "Nome Completo",
  "email": "usuario@email.com",
  "password": "senha123",
  "confirmPassword": "senha123"
}
```

**Response Success (201)**:
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": "user_id",
    "name": "Nome Completo",
    "email": "usuario@email.com"
  }
}
```

---

## 📊 Dashboard Endpoints

### GET /conversas/stats
**Descrição**: Retorna estatísticas diárias de conversas

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Query Parameters**:
```
data: YYYY-MM-DD (required)
```

**Response**:
```json
{
  "novas_conversas": 15,
  "pendentes_anteriores": 3,
  "total_concluidos": 12,
  "total_em_andamento": 8,
  "total_pendentes": 5,
  "grafico_horas": [
    { "hora": 0, "total": 0 },
    { "hora": 1, "total": 2 },
    { "hora": 9, "total": 15 }
  ]
}
```

### GET /conversas/stats-mes
**Descrição**: Retorna estatísticas mensais de conversas

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Query Parameters**:
```
mes: YYYY-MM (required)
```

**Response**:
```json
{
  "novas_conversas": 450,
  "pendentes_anteriores": 23,
  "total_concluidos": 380,
  "total_em_andamento": 67,
  "total_pendentes": 45,
  "grafico_dias": [
    { "dia": 1, "total": 12 },
    { "dia": 2, "total": 18 },
    { "dia": 31, "total": 15 }
  ]
}
```

---

## 👥 Atendentes Endpoints

### GET /conversas/dash-atendentes
**Descrição**: Retorna dados dos atendentes e métricas

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Query Parameters**:
```
data: YYYY-MM-DD (required)
```

**Response**:
```json
{
  "atendimentos": {
    "total_atendimentos": 150,
    "atendimentos_concluidos": 120,
    "recebidos_por_ele": 80,
    "iniciados_por_ele": 70,
    "classificados": 95
  },
  "qualidade": {
    "tempo_espera_media": "2 min",
    "tempo_primeira_resp": "1.5 min",
    "tempo_total_media": "15 min"
  },
  "atendentes": [
    {
      "nome": "João Silva",
      "status": "online",
      "total_atendimentos": 25,
      "satisfacao": 4.8,
      "tempo_medio_resposta": "00:01:30"
    }
  ]
}
```

---

## 💬 Conversas Endpoints

### GET /conversas/all
**Descrição**: Retorna lista de todas as conversas

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Response**:
```json
[
  {
    "id": "conv_123",
    "cliente_nome": "Maria Santos",
    "cliente_telefone": "+5511999999999",
    "atendente_nome": "João Silva",
    "status": "concluido",
    "canal": "whatsapp",
    "data_criacao": "2024-01-04T10:30:00Z",
    "data_atualizacao": "2024-01-04T11:45:00Z",
    "ultima_mensagem": "Obrigada pelo atendimento!"
  }
]
```

---

## 🔒 Security Headers

### Required Headers for Protected Routes
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

### CORS Configuration
```javascript
// Backend deve aceitar:
Origin: https://seudominio.com
Methods: GET, POST, PUT, DELETE, OPTIONS
Headers: Content-Type, Authorization
```

---

## ⚠️ Error Codes

| Code | Description | Action |
|------|-------------|---------|
| 200 | Success | Continue |
| 201 | Created | Resource created |
| 400 | Bad Request | Check request format |
| 401 | Unauthorized | Login required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Check endpoint URL |
| 429 | Too Many Requests | Wait and retry |
| 500 | Server Error | Contact support |

---

## 🧪 Testing Examples

### cURL Examples

#### Login
```bash
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@email.com",
    "password": "password123"
  }'
```

#### Get Stats (with token)
```bash
curl -X GET "http://localhost:8080/conversas/stats?data=2024-01-04" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### JavaScript Examples

#### Login
```javascript
const response = await fetch('http://localhost:8080/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@email.com',
    password: 'password123'
  })
})

const data = await response.json()
localStorage.setItem('token', data.token)
```

#### Protected Request
```javascript
const token = localStorage.getItem('token')
const response = await fetch('http://localhost:8080/conversas/stats?data=2024-01-04', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

---

## 📝 Rate Limiting

### Limits
- **Login**: 5 attempts per minute per IP
- **Register**: 3 attempts per minute per IP
- **API Calls**: 100 requests per minute per user

### Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1641234567
```

---

## 🔄 Real-time Updates

### Polling Strategy
- **Dashboard**: 30 seconds
- **Atendentes**: 15 seconds
- **Conversas**: 30 seconds

### WebSocket (Future)
```javascript
// Planned implementation
const ws = new WebSocket('ws://localhost:8080/realtime')
ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  // Update UI with real-time data
}
```

---

## 🛠️ Backend Requirements

### Minimum Requirements
```json
{
  "cors": "enabled for frontend domain",
  "jwt": "HS256 algorithm",
  "rateLimit": "implemented",
  "validation": "input sanitization",
  "logging": "request/response logs"
}
```

### Recommended Middleware
- **CORS**: Cross-origin requests
- **Helmet**: Security headers
- **Morgan**: Request logging
- **Express-rate-limit**: Rate limiting
- **Express-validator**: Input validation

---

**📞 Support**: Para dúvidas sobre integração, contate o time de desenvolvimento.