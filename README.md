# 💰 FinBrain — Plataforma de Inteligência Financeira com IA

![FinBrain Banner](https://github.com/user-attachments/assets/4fc92236-3ab2-4288-a8cf-0d02853a7933)

🚧 **Status:** MVP em desenvolvimento  
📌 Versão: `0.1.0`

---

## 🧠 O que é o FinBrain?

O **FinBrain** é uma plataforma de inteligência financeira que ajuda usuários a **entender, analisar e melhorar seu comportamento financeiro** utilizando dados e Inteligência Artificial.

Diferente de aplicativos tradicionais, o foco não é apenas registrar gastos, mas **apoiar decisões financeiras**.

---

## 🎯 Ideia Central

A maioria dos apps mostra *no que você gastou*.
O **FinBrain mostra o que você deve fazer a seguir**.

---

## ⚡ Funcionalidades Atuais

* 🔐 Autenticação segura com JWT
* 📩 Verificação de email por código
* 🔑 Sistema de login protegido
* 🔗 Integração completa entre frontend e backend
* 🧱 Estrutura preparada para escala

---

## 🚧 Em Desenvolvimento

* 📊 Dashboard com gráficos e indicadores (KPIs)
* 🤖 Motor de recomendações com IA
* 💸 Análise automática de gastos
* 📑 Relatórios financeiros inteligentes
* 🔔 Alertas e insights em tempo real

---

## 🏗️ Arquitetura

```bash
finbrain/
├── backend/   # API REST (Spring Boot)
├── frontend/  # Interface (Next.js)
└── docs/      # Documentação (planejado)
```

### Backend

* Arquitetura em camadas (Controller → Service → Repository)
* Autenticação stateless com JWT
* Segurança com Spring Security
* Pronto para escalar horizontalmente

### Frontend

* Next.js (App Router)
* Componentização e separação de responsabilidades
* SSR + Client Rendering
* Estrutura escalável

---

## 🛠️ Tecnologias

### Frontend

* Next.js 16
* TypeScript
* Tailwind CSS

### Backend

* Spring Boot 3.3.5
* Spring Security
* JWT
* PostgreSQL
* JPA / Hibernate

---

## 🔐 Segurança

* Autenticação stateless (JWT)
* Proteção de rotas
* Validação de dados (frontend + backend)
* Verificação de email

---

## 📈 Decisões de Engenharia

* Backend stateless → fácil escalabilidade
* Separação clara de camadas → manutenção simples
* API-first → preparado para mobile
* Estrutura modular → crescimento sustentável

---

## ⚡ Como Executar

### Backend

```bash
cd backend
mvn spring-boot:run
```

Rodando em: `http://localhost:8080`

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Rodando em: `http://localhost:3000`

---

## 🔌 API

```
http://localhost:8080/api
```

---

## 🧭 Roadmap

* [ ] Recomendações financeiras com IA
* [ ] Previsão de gastos
* [ ] Integração com Open Banking
* [ ] Versão mobile (PWA / React Native)
* [ ] Deploy em nuvem (AWS / Docker / CI/CD)

---

## 💡 Diferencial

O FinBrain não é apenas um controle financeiro.

É uma plataforma orientada a dados onde:

* Dados → viram análise
* Análise → vira decisão
* Decisão → gera resultado

---

## 👨‍💻 Equipe

| Nome          | Função                   |
| ------------- | ------------------------ |
| Luiz Felipe   | Desenvolvedor Full Stack |
| Kevin Marques | Desenvolvedor Full Stack |
| Vitor Ramires | Desenvolvedor Full Stack |

---

## ⭐ Destaque

Este projeto demonstra:

* Pensamento de arquitetura
* Preocupação com escalabilidade
* Integração full stack real
* Construção de produto com visão

---

