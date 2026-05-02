
---

# 💻 FinBrain — Frontend

Interface web da plataforma **FinBrain**, responsável pela experiência do usuário, autenticação e visualização de dados financeiros.

---

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Rodar aplicação
npm run dev
```

Acesse:
👉 `http://localhost:3000`

---

## 🔗 Integração com Backend

O frontend consome a API em:

```bash
http://localhost:8080
```

⚠️ Certifique-se de que o backend esteja rodando antes de iniciar o frontend.

---

## 🏗️ Estrutura do Projeto

```
src/
├── app/
│   ├── login/        # Autenticação
│   ├── register/     # Cadastro de usuário
│   ├── confirmar/    # Verificação de email
│   └── dashboard/    # Área principal
│
├── services/
│   └── api.ts        # Configuração de requisições HTTP
│
public/
└── logosg/           # Assets e imagens
```

---

## ⚙️ Tecnologias

* Next.js 16 (App Router)
* TypeScript
* Tailwind CSS
* Axios

---

## 🔐 Funcionalidades

* Autenticação com JWT
* Registro com verificação por código
* Login seguro
* Consumo de API REST
* Estrutura pronta para dashboard financeiro

---

## 🎨 Identidade Visual

| Elemento   | Cor       |
| ---------- | --------- |
| Primária   | `#6C47E8` |
| Secundária | `#FFFFFF` |

---

## 📡 Endpoints Consumidos

| Método | Endpoint              | Descrição          |
| ------ | --------------------- | ------------------ |
| POST   | `/api/auth/register`  | Criar conta        |
| POST   | `/api/auth/login`     | Autenticar usuário |
| POST   | `/api/auth/confirmar` | Confirmar email    |

---

## ⚠️ Troubleshooting

**Erro de conexão com API**

* Verifique se o backend está rodando
* Confirme a URL em `services/api.ts`

---

## 📌 Observações

* Projeto em evolução (MVP)
* Estrutura preparada para novas funcionalidades
* Foco em escalabilidade e organização

---

## ⭐ Diferencial

Este frontend foi construído com foco em:

* Organização de código
* Escalabilidade
* Integração real com backend
* Experiência do usuário

---
