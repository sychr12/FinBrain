# FinBrain — Correção de usuários

## Problema
O usuário `luiz2@gmail.com` tinha a senha salva em texto puro (`luiz123`)
em vez de um hash BCrypt, por isso o login sempre falhava.

## O que o script `usuarios_correcao.sql` faz
1. Corrige o schema da tabela `usuarios`.
2. Remove usuário duplicado.
3. Corrige a senha em texto puro.
4. Cria o administrador.
5. Move os cartões dos outros usuários pro admin e apaga o restante
   dos usuários.

## Login do administrador
- email: `admin@finbrain.com`
- senha: `rnu@u5smORQTp$N1`

⚠️ Troque essa senha após o primeiro login.

## Como rodar
```bash
psql -U <usuario> -d <database> -f usuarios_correcao.sql
```