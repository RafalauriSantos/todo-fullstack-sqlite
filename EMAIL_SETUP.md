# 📧 Configuração de Email para Reset de Senha

## Gmail (Recomendado para desenvolvimento)

### 1. Criar Senha de App

1. Acesse https://myaccount.google.com/security
2. Ative a **Verificação em duas etapas**
3. Vá em **Senhas de app** (https://myaccount.google.com/apppasswords)
4. Crie uma nova senha de app:
   - Nome: "To Task Reset Password"
   - Copie a senha gerada (16 caracteres sem espaços)

### 2. Configurar .env

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=xxxx-xxxx-xxxx-xxxx  # Senha de app (16 caracteres)
FRONTEND_URL=http://localhost:5173
```

### 3. Testar localmente

```bash
npm run dev  # Frontend (porta 5173)
node server.js  # Backend (porta 3000)
```

Acesse http://localhost:5173/login e clique em "Forgot Password?"

---

## Outras opções de SMTP

### SendGrid (Gratuito até 100 emails/dia)

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxxx  # API Key
```

### Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=seu-email@outlook.com
SMTP_PASS=sua-senha
```

### Mailtrap (Apenas testes - emails não são enviados)

```env
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=seu-username
SMTP_PASS=sua-senha
```

---

## Deploy no Render

### 1. Configurar variáveis de ambiente no Render:

Dashboard → Service → Environment → Add Environment Variable

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=xxxx-xxxx-xxxx-xxxx
FRONTEND_URL=https://todo-fullstack-sqlite.onrender.com
```

### 2. Redeploy

```bash
git add .
git commit -m "Add: Reset password functionality"
git push origin main
```

O Render fará deploy automático.

---

## Fluxo de Reset de Senha

1. **Usuário clica em "Forgot Password?"** → Modal aparece
2. **Usuário digita email** → Backend valida e gera token único
3. **Email é enviado** com link: `https://seu-app.com/reset-password/{token}`
4. **Usuário clica no link** → Página de reset carrega
5. **Usuário digita nova senha** → Token é validado e senha é atualizada
6. **Redirect para /login** → Usuário pode fazer login com nova senha

### Segurança

- ✅ Token único (32 bytes hex = 64 caracteres)
- ✅ Expira em 1 hora
- ✅ Token é deletado após uso
- ✅ Senha é hasheada com bcrypt (10 rounds)
- ✅ Validação frontend + backend
- ✅ Não revela se email existe (sempre retorna mesma mensagem)

---

## Troubleshooting

### "Error: Invalid login"

- Verifique se a senha de app está correta (sem espaços)
- Confirme que a verificação em duas etapas está ativa

### "Error: connect ECONNREFUSED"

- Verifique SMTP_HOST e SMTP_PORT
- Firewall pode estar bloqueando porta 587

### Email não chega

- Verifique spam/lixo eletrônico
- Use Mailtrap para testes (captura emails sem enviar)
- Veja logs do servidor: `console.log` no transporter.sendMail()

### "Token inválido ou expirado"

- Token expira em 1 hora
- Token só pode ser usado uma vez
- Verifique se URL está completa (token tem 64 caracteres)
