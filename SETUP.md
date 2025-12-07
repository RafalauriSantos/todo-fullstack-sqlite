# 🚀 ToTask - Setup de Desenvolvimento

Guia completo para rodar o projeto localmente com Docker.

## 📋 Pré-requisitos

- **Node.js** 18+ ([Download](https://nodejs.org))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- **Git** ([Download](https://git-scm.com))

## 🛠️ Setup Rápido

### 1. Clone o repositório

```bash
git clone https://github.com/RafalauriSantos/todo-fullstack-sqlite.git
cd todo-fullstack-sqlite
```

### 2. Inicie o PostgreSQL com Docker

```bash
docker-compose up -d
```

Isso vai:
- ✅ Subir PostgreSQL na porta 5432
- ✅ Subir pgAdmin na porta 5050 (opcional)
- ✅ Criar volume persistente para dados

**Verificar se está rodando:**
```bash
docker-compose ps
```

### 3. Configure variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# O .env já vem configurado para Docker local!
# DATABASE_URL=postgresql://postgres:dev123@localhost:5432/totask_dev
```

### 4. Instale dependências

```bash
# Backend
npm install

# Frontend
cd client
npm install
cd ..
```

### 5. Rode o projeto

**Opção A: Modo desenvolvimento (recomendado)**
```bash
npm run dev
```

Isso roda:
- Backend: http://localhost:3000 (auto-reload)
- Frontend: http://localhost:5173 (hot-reload)

**Opção B: Separado**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

## 🧪 Testes

### Rodar todos os testes
```bash
npm test
```

### Rodar testes em watch mode
```bash
npm test -- --watch
```

### Testes específicos
```bash
# Apenas validators
npm test validators

# Apenas API
npm test server.integration
```

## 🗄️ Gerenciar PostgreSQL

### Usando pgAdmin (Interface Web)

1. Acesse: http://localhost:5050
2. Login: `admin@totask.com` / `admin`
3. Add Server:
   - Name: `ToTask Local`
   - Host: `postgres` (nome do container)
   - Port: `5432`
   - Username: `postgres`
   - Password: `dev123`

### Usando linha de comando

```bash
# Acessar PostgreSQL
docker exec -it totask-postgres psql -U postgres -d totask_dev

# Comandos úteis no psql:
\dt              # Listar tabelas
\d users         # Ver estrutura da tabela users
SELECT * FROM users;   # Query
\q               # Sair
```

### Ver logs
```bash
docker-compose logs -f postgres
```

## 🐳 Comandos Docker Úteis

```bash
# Parar serviços
docker-compose down

# Parar e remover dados (CUIDADO!)
docker-compose down -v

# Reiniciar serviços
docker-compose restart

# Ver status
docker-compose ps

# Ver logs
docker-compose logs -f

# Rebuild (se mudou docker-compose.yml)
docker-compose up -d --build
```

## 📁 Estrutura do Projeto

```
.
├── client/               # Frontend React + Vite
│   ├── src/
│   │   ├── components/   # Componentes reutilizáveis
│   │   ├── pages/        # Páginas (rotas)
│   │   ├── services/     # API client
│   │   └── utils/        # Validators, helpers
│   └── package.json
├── server.js             # Backend Fastify
├── server.integration.test.js  # Testes de integração
├── docker-compose.yml    # PostgreSQL + pgAdmin
├── .env                  # Variáveis de ambiente (não commitar!)
└── package.json          # Deps backend
```

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Backend + Frontend (desenvolvimento)
npm run server   # Apenas backend (auto-reload)
npm run client   # Apenas frontend (hot-reload)
npm test         # Rodar testes
npm run build    # Build frontend para produção
npm start        # Rodar backend em produção
```

## 🌐 URLs Importantes

- **Frontend Dev**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **pgAdmin**: http://localhost:5050
- **Production Frontend**: https://todo-fullstack-tau.vercel.app
- **Production Backend**: https://todo-fullstack-sqlite.onrender.com

## 🚨 Troubleshooting

### Porta 5432 já está em uso
```bash
# Windows
netstat -ano | findstr :5432
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5432 | xargs kill -9

# Ou mude a porta no docker-compose.yml
ports:
  - "5433:5432"  # Use 5433 no host
```

### Database não conecta
```bash
# Verifique se PostgreSQL está rodando
docker-compose ps

# Reinicie
docker-compose restart postgres

# Veja logs
docker-compose logs postgres
```

### Testes falhando
```bash
# Limpe node_modules
rm -rf node_modules client/node_modules
npm install
cd client && npm install
```

## 📚 Documentação Adicional

- [Fastify Docs](https://fastify.dev)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [Docker Docs](https://docs.docker.com)

## 🤝 Contribuindo

1. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
2. Faça suas mudanças
3. Rode os testes: `npm test`
4. Commit: `git commit -m "feat: adiciona nova funcionalidade"`
5. Push: `git push origin feature/nova-funcionalidade`
6. Abra um Pull Request

## 📝 Convenção de Commits

```
feat: nova funcionalidade
fix: correção de bug
docs: mudanças na documentação
style: formatação, ponto e vírgula
refactor: refatoração de código
test: adicionar/modificar testes
chore: atualizar dependências, configs
```

## 📄 Licença

ISC
