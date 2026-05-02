---

# ⚙️ FinBrain — Backend

API responsável pela autenticação, processamento de dados e regras de negócio da plataforma **FinBrain**.

---

## 🚀 Como Executar

```bash
# Rodar aplicação
mvn spring-boot:run
```

Servidor disponível em:
👉 `http://localhost:8080`

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas:

```
src/main/java/com/finbrain/backend/
├── controller/     # Endpoints REST
├── service/        # Regras de negócio
├── repository/     # Acesso a dados (JPA)
├── model/          # Entidades
├── dto/            # Transferência de dados
├── security/       # Autenticação e autorização
└── config/         # Configurações da aplicação
```

---

## 🗄️ Banco de Dados

* PostgreSQL
* Configurado via `application.properties` ou variáveis de ambiente

Exemplo:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/finbrain
spring.datasource.username=SEU_USUARIO
spring.datasource.password=SUA_SENHA
```

---

## 🔐 Segurança

* Autenticação baseada em **JWT (stateless)**
* Proteção de rotas com Spring Security
* Validação de dados no backend
* Fluxo de verificação de email

---

## 📡 Endpoints Principais

| Método | Endpoint              | Descrição            |
| ------ | --------------------- | -------------------- |
| POST   | `/api/auth/register`  | Registro de usuário  |
| POST   | `/api/auth/login`     | Autenticação         |
| POST   | `/api/auth/confirmar` | Verificação de email |
| GET    | `/api/auth/health`    | Health check         |

---

## ⚙️ Configuração

As configurações sensíveis devem ser feitas via **variáveis de ambiente**.

### 🔑 Variáveis recomendadas

```bash
DB_URL=jdbc:postgresql://localhost:5432/finbrain
DB_USER=postgres
DB_PASSWORD=senha

JWT_SECRET=chave-super-secreta
JWT_EXPIRATION=86400000

MAIL_HOST=smtp.mailtrap.io
MAIL_USER=seu_usuario
MAIL_PASS=sua_senha
```

---

## 📦 Tecnologias

* Spring Boot 3.3.5
* Spring Security
* JWT
* PostgreSQL
* JPA / Hibernate
* Maven

---

## ⚠️ Troubleshooting

**Erro de conexão com banco**

* Verifique se o PostgreSQL está ativo
* Confirme as credenciais

**Erro no envio de email**

* Verifique as variáveis SMTP
* Confira logs no console

---

## 📌 Observações

* Projeto em fase de MVP
* Estrutura preparada para escalabilidade
* API REST seguindo boas práticas

---

## ⭐ Destaque

Este backend foi projetado com foco em:

* Segurança (JWT + validação)
* Separação de responsabilidades
* Escalabilidade
* Integração com frontend real

---


## 🚨 O que você melhorou aqui (e recrutador percebe)

* ❌ Removeu segredos do código
* ✅ Usou variáveis de ambiente
* ✅ Mostrou arquitetura
* ✅ Mostrou preocupação com segurança

---

