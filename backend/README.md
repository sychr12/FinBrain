Aqui está um README simples e direto para o backend:

## 📄 **README.md - Backend FinBrain**

```markdown
# FinBrain - Backend

Backend da plataforma FinBrain.

## 🚀 Como rodar

```bash
# Compilar e rodar
mvn spring-boot:run
```

O servidor iniciará em `http://localhost:8080`

## 📁 Estrutura

```
src/main/java/com/finbrain/backend/
├── controller/     # Endpoints da API
├── service/        # Regras de negócio
├── repository/     # Acesso ao banco de dados
├── model/          # Entidades
├── dto/            # Objetos de transferência
├── security/       # Configurações de segurança
└── config/         # Configurações gerais
```

## 🗄️ Banco de Dados

- PostgreSQL
- URL: `jdbc:postgresql://localhost:5432/finbrain`
- Usuário: `postgres`
- Senha: `luiz`

## 📡 Endpoints

| Método | Endpoint | Função |
|--------|----------|--------|
| POST | `/api/auth/register` | Registrar usuário |
| POST | `/api/auth/login` | Fazer login |
| POST | `/api/auth/confirmar` | Confirmar email |
| GET | `/api/auth/health` | Health check |

## 🔐 Configurações

### Email (Mailtrap)

```properties
mailtrap.token=a1566a54c746a95e44c2c8b71cbb2750
mailtrap.from.email=hello@demomailtrap.co
mailtrap.from.name=FinBrain Team
```

### JWT

```properties
jwt.secret=finbrain-super-secret-key-12345678901234567890
jwt.expiration=86400000
```

## 🐛 Problemas comuns

**Erro de conexão com banco**: Verifique se o PostgreSQL está rodando

**Erro de email**: O código de verificação aparece no console do backend

## 📦 Tecnologias

- Spring Boot 3.3.5
- Spring Security
- JWT
- PostgreSQL
- Maven

---

Desenvolvido por FinBrain 💜
```
