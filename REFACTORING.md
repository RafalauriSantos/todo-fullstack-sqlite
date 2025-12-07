# 🔧 Plano de Refatoração - Princípios de Engenharia

## 🎯 Objetivo

Alinhar o projeto com os 7 princípios fundamentais: **KISS, DRY, SOLID, YAGNI, SoC, Fail Fast, Clean Code**.

---

## 🚨 PRIORIDADE URGENTE: Fail Fast

### Problema

Validações acontecem tarde demais, permitindo estados inválidos.

### Solução

#### 1. Validação Frontend Antecipada

```tsx
// client/src/utils/validators.ts (CRIAR)
export const validateEmail = (email: string): string | null => {
	if (!email.trim()) return "Email é obrigatório";
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email inválido";
	return null;
};

export const validatePassword = (password: string): string | null => {
	if (!password) return "Senha é obrigatória";
	if (password.length < 6) return "Senha deve ter no mínimo 6 caracteres";
	return null;
};

export const validateTaskText = (text: string): string | null => {
	const trimmed = text.trim();
	if (!trimmed) return "Tarefa não pode estar vazia";
	if (trimmed.length > 200) return "Máximo 200 caracteres";
	return null;
};
```

#### 2. Aplicar nos Componentes

```tsx
// client/src/components/TaskInput.tsx
import { validateTaskText } from "../utils/validators";

function handleClick() {
	const error = validateTaskText(textoLocal);
	if (error) {
		alert(error); // Ou setState com erro
		return;
	}
	onAdicionar(textoLocal.trim());
	setTextoLocal("");
}
```

#### 3. Backend - Fail Fast no Topo

```js
// server.js - Refatorar rota de tarefas
fastify.post("/api/tarefas", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { texto } = request.body;

    // ✅ FAIL FAST - Validações NO TOPO
    if (!texto?.trim()) {
        return reply.status(400).send({ error: "Texto da tarefa é obrigatório" });
    }
    if (texto.trim().length > 200) {
        return reply.status(400).send({ error: "Tarefa muito longa (máx 200 caracteres)" });
    }

    // Lógica principal só executa se validações passarem
    try {
        const result = await pool.query(...);
        return { id: result.rows[0].id, ... };
    } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: "Erro ao criar tarefa" });
    }
});
```

#### 4. Pool Connection Check

```js
// server.js - Após criar Pool
const pool = new Pool({...});

// ✅ FAIL FAST - Testa conexão ao iniciar
pool.connect()
    .then(() => console.log("✅ Database connected"))
    .catch(err => {
        console.error("❌ Database connection failed:", err);
        process.exit(1); // Falha rápido se DB não conectar
    });
```

---

## 🔥 PRIORIDADE ALTA: DRY (Eliminar Duplicação)

### 1. Criar Hook de Tratamento de Erro

```tsx
// client/src/hooks/useErrorHandler.ts (CRIAR)
import { useState, useCallback } from "react";

export function useErrorHandler() {
	const [error, setError] = useState<string | null>(null);

	const handleError = useCallback((err: any, defaultMsg: string) => {
		console.error(err);
		const errorMessage = err?.message || defaultMsg;
		setError(`❌ ${errorMessage}. Verifique sua conexão e tente novamente.`);
		setTimeout(() => setError(null), 5000);
	}, []);

	return { error, handleError, clearError: () => setError(null) };
}
```

**Uso em Home.tsx:**

```tsx
const { error, handleError } = useErrorHandler();

async function adicionarTarefa(texto: string) {
	try {
		const novaTarefa = await api.createTarefa(texto);
		setTarefas([...tarefas, novaTarefa]);
	} catch (err) {
		handleError(err, "Erro ao criar tarefa");
	}
}
```

### 2. Abstrair Fetch Repetitivo

```ts
// client/src/services/api.ts - Refatorar
async function fetchAPI<T>(url: string, options: RequestInit = {}): Promise<T> {
	const response = await fetch(`${API_URL}${url}`, {
		...options,
		headers: { ...getHeaders(), ...options.headers },
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || "Erro na requisição");
	}

	return response.json();
}

// Uso:
export const api = {
	getTarefas: () => fetchAPI<Tarefa[]>("/api/tarefas"),
	createTarefa: (texto: string) =>
		fetchAPI<Tarefa>("/api/tarefas", {
			method: "POST",
			body: JSON.stringify({ texto }),
		}),
	// ... outros métodos
};
```

### 3. Remover Estilos Inline Duplicados

```tsx
// Login.tsx e Register.tsx - Substituir hover inline
// ❌ ANTES (duplicado em 2 lugares):
onMouseOver={(e) => {
    e.currentTarget.style.transform = "scale(1.02)";
    e.currentTarget.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.6)";
}}

// ✅ DEPOIS (usar Tailwind):
<button
    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500
               hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50
               transition-all duration-200"
>
```

---

## 🏗️ PRIORIDADE ALTA: SOLID (Refatorar Backend)

### Estrutura Proposta

```
server/
├── controllers/
│   ├── authController.js    # Endpoints de login/register
│   └── taskController.js    # Endpoints de tarefas
├── services/
│   ├── authService.js       # Lógica de autenticação
│   └── taskService.js       # Lógica de negócio de tarefas
├── repositories/
│   └── taskRepository.js    # Queries diretas ao banco
├── middlewares/
│   └── authenticate.js      # Middleware de JWT
└── index.js                 # Setup do servidor
```

### Exemplo: Task Repository (Camada de Dados)

```js
// server/repositories/taskRepository.js
export class TaskRepository {
	constructor(pool) {
		this.pool = pool;
	}

	async findByUserId(userId) {
		const result = await this.pool.query(
			"SELECT * FROM tarefas WHERE user_id = $1 ORDER BY id ASC",
			[userId]
		);
		return result.rows;
	}

	async create(texto, userId) {
		const result = await this.pool.query(
			"INSERT INTO tarefas (texto, user_id) VALUES ($1, $2) RETURNING *",
			[texto, userId]
		);
		return result.rows[0];
	}
}
```

### Exemplo: Task Service (Lógica de Negócio)

```js
// server/services/taskService.js
export class TaskService {
	constructor(taskRepository) {
		this.taskRepository = taskRepository;
	}

	async createTask(texto, userId) {
		// Validações de negócio aqui
		if (texto.length > 200) throw new Error("Tarefa muito longa");

		const task = await this.taskRepository.create(texto, userId);

		// Garantir tipo correto
		return {
			id: task.id,
			texto: task.texto,
			concluida: Number(task.concluida) || 0,
		};
	}
}
```

### Exemplo: Task Controller (HTTP)

```js
// server/controllers/taskController.js
export function registerTaskRoutes(fastify, taskService) {
	fastify.post(
		"/api/tarefas",
		{ onRequest: [fastify.authenticate] },
		async (request, reply) => {
			const { texto } = request.body;

			if (!texto?.trim()) {
				return reply.status(400).send({ error: "Texto obrigatório" });
			}

			try {
				const task = await taskService.createTask(
					texto.trim(),
					request.user.id
				);
				return task;
			} catch (error) {
				fastify.log.error(error);
				return reply.status(500).send({ error: error.message });
			}
		}
	);
}
```

---

## 📦 PRIORIDADE MÉDIA: SoC (Separar Estilos)

### Decisão: Escolher 1 Paradigma

**Opção 1: Migrar tudo para Tailwind** ⭐ **(Recomendado)**

- Deletar `authStyles.ts`
- Converter estilos inline para classes Tailwind
- Manter `index.css` apenas para `@keyframes`

**Opção 2: Manter CSS-in-JS**

- Migrar `authStyles.ts` para Styled Components ou Emotion
- Remover Tailwind
- CSS tradicional apenas para animações

---

## 🧹 PRIORIDADE MÉDIA: Clean Code

### 1. Extrair Magic Numbers

```ts
// client/src/constants/animations.ts (CRIAR)
export const BLOB_ANIMATION_CONFIG = {
	SCALE_MIN: 0.8,
	SCALE_MAX: 1.2,
	TRANSLATE_RANGE: 100,
	ROTATE_DEGREES: 120,
};
```

### 2. Dividir Home.tsx

```tsx
// client/src/pages/Home.tsx (REFATORAR)
export default function Home() {
	return (
		<div className="min-h-screen py-10 px-4">
			<HomeHeader user={user} onLogout={logout} />
			<Header />
			<TaskInput onAdicionar={adicionarTarefa} />
			<TaskFilters filter={filter} onFilterChange={setFilter} />
			<ErrorBanner error={error} />
			<TaskManager
				tarefas={filteredTarefas}
				isLoading={isLoading}
				onToggle={toggleTarefa}
				onDelete={deletarTarefa}
				onEdit={editarTarefa}
			/>
		</div>
	);
}
```

### 3. Tipar `authStyles.ts`

```ts
// client/src/styles/authStyles.ts
import { CSSProperties } from "react";

interface AuthStyles {
	pageBackground: CSSProperties;
	container: CSSProperties;
	glassCard: CSSProperties;
	// ... todos os outros
}

export const authStyles: AuthStyles = {
	// ...
};
```

---

## 📊 Cronograma de Implementação

| Fase           | Tarefas                                 | Prazo Estimado |
| -------------- | --------------------------------------- | -------------- |
| **1. Urgente** | Fail Fast (validações)                  | 1-2 dias       |
| **2. Alta**    | DRY (hook de erro + fetch abstrato)     | 2-3 dias       |
| **3. Alta**    | SOLID (refatorar backend em camadas)    | 3-5 dias       |
| **4. Média**   | SoC (padronizar estilos)                | 1-2 dias       |
| **5. Média**   | Clean Code (dividir componentes, tipos) | 2-3 dias       |

**Total estimado:** 9-15 dias de trabalho

---

## ✅ Critérios de Sucesso

- [ ] Todas as validações acontecem antes de processar dados
- [ ] Nenhum código duplicado em 3+ lugares
- [ ] Backend organizado em Controller → Service → Repository
- [ ] Apenas 1 paradigma de estilo (Tailwind OU CSS-in-JS)
- [ ] Componentes com no máximo 150 linhas
- [ ] 0 tipos `any` no projeto
- [ ] Cobertura de testes > 70%

---

## 🔗 Recursos

- [SOLID Principles - Uncle Bob](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)
- [Clean Code - Summary](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29)
- [React Patterns - Kent C. Dodds](https://kentcdodds.com/blog/application-state-management-with-react)

---

**Desenvolvido como auditoria técnica do projeto To Task.**
_Data: 7 de Dezembro de 2025_
