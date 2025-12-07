import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import compress from "@fastify/compress";
import pg from "pg";
import bcrypt from "bcryptjs";

const { Pool } = pg;

// Função que CONSTRÓI o servidor (mas não liga)
export function buildServer() {
	const fastify = Fastify({ logger: false });

	// 1. Plugins
	fastify.register(compress, { global: true });

	fastify.register(cors, {
		origin: "*",
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
	});

	fastify.register(jwt, {
		secret: process.env.JWT_SECRET || "supersecret",
	});

	// Decorator para proteger rotas
	fastify.decorate("authenticate", async function (request, reply) {
		try {
			await request.jwtVerify();
		} catch (err) {
			reply.send(err);
		}
	});

	// 2. Banco de Dados (PostgreSQL)
	const pool = new Pool({
		connectionString: process.env.DATABASE_URL,
		ssl: process.env.DATABASE_URL?.includes("neon.tech")
			? { rejectUnauthorized: false }
			: false,
	});

	// Inicializa tabelas (Users e Tarefas)
	const initDb = async () => {
		try {
			// Tabela de Usuários
			await pool.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL
                )
            `);

			// Tabela de Tarefas (com user_id)
			await pool.query(`
                CREATE TABLE IF NOT EXISTS tarefas (
                    id SERIAL PRIMARY KEY,
                    texto TEXT,
                    concluida INTEGER DEFAULT 0,
                    user_id INTEGER REFERENCES users(id)
                )
            `);

			// Migração simples: Adicionar coluna user_id se não existir (para quem já tem a tabela)
			await pool.query(`
                DO $$ 
                BEGIN 
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tarefas' AND column_name='user_id') THEN 
                        ALTER TABLE tarefas ADD COLUMN user_id INTEGER REFERENCES users(id);
                    END IF;
                END $$;
            `);
		} catch (err) {
			console.error("Erro ao inicializar DB:", err);
		}
	};
	initDb();

	// 3. Rotas de Autenticação
	fastify.post("/api/register", async (request, reply) => {
		const { email, password } = request.body;
		if (!email || !password) {
			return reply
				.status(400)
				.send({ error: "Email e senha são obrigatórios" });
		}

		try {
			const hashedPassword = await bcrypt.hash(password, 10);
			const result = await pool.query(
				"INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
				[email, hashedPassword]
			);

			// TODO: Implementar envio de email de boas-vindas
			// Para implementar: usar nodemailer ou SendGrid
			// Exemplo: await sendWelcomeEmail(email);
			// console.log(`Email de boas-vindas enviado para: ${email}`);

			return result.rows[0];
		} catch (err) {
			if (err.code === "23505") {
				return reply.status(400).send({ error: "Email já cadastrado" });
			}
			return reply.status(500).send({ error: "Erro interno" });
		}
	});

	fastify.post("/api/login", async (request, reply) => {
		const { email, password } = request.body;
		const result = await pool.query("SELECT * FROM users WHERE email = $1", [
			email,
		]);
		const user = result.rows[0];

		if (!user || !(await bcrypt.compare(password, user.password))) {
			return reply.status(401).send({ error: "Email ou senha inválidos" });
		}

		const token = fastify.jwt.sign({ id: user.id, email: user.email });
		return { token };
	});

	// 4. Rotas de Tarefas (Protegidas)
	fastify.get(
		"/api/tarefas",
		{ onRequest: [fastify.authenticate] },
		async (request) => {
			const result = await pool.query(
				"SELECT * FROM tarefas WHERE user_id = $1 ORDER BY id ASC",
				[request.user.id]
			);
			return result.rows;
		}
	);

	fastify.post(
		"/api/tarefas",
		{ onRequest: [fastify.authenticate] },
		async (request, reply) => {
			const dados = request.body;
			if (!dados.texto || !dados.texto.trim()) {
				return reply
					.status(400)
					.send({ error: "Texto da tarefa é obrigatório" });
			}

			try {
				const result = await pool.query(
					"INSERT INTO tarefas (texto, user_id) VALUES ($1, $2) RETURNING id, texto, concluida",
					[dados.texto, request.user.id]
				);
				const tarefa = result.rows[0];
				// Garante que concluida é um número (0 ou 1)
				return {
					id: tarefa.id,
					texto: tarefa.texto,
					concluida: Number(tarefa.concluida) || 0,
				};
			} catch (error) {
				console.error("Erro ao criar tarefa:", error);
				return reply.status(500).send({ error: "Erro ao criar tarefa" });
			}
		}
	);

	fastify.patch(
		"/api/tarefas/:id",
		{ onRequest: [fastify.authenticate] },
		async (request, reply) => {
			const id = request.params.id;
			const dados = request.body || {};
			const userId = request.user.id;

			// Verifica se a tarefa pertence ao usuário
			const check = await pool.query(
				"SELECT * FROM tarefas WHERE id = $1 AND user_id = $2",
				[id, userId]
			);
			if (check.rowCount === 0) {
				return reply.status(404).send({ error: "Tarefa não encontrada" });
			}

			if (dados.texto) {
				const result = await pool.query(
					"UPDATE tarefas SET texto = $1 WHERE id = $2 RETURNING id, texto",
					[dados.texto, id]
				);
				return result.rows[0];
			}

			const tarefa = check.rows[0];
			const novoStatus = tarefa.concluida === 0 ? 1 : 0;
			await pool.query("UPDATE tarefas SET concluida = $1 WHERE id = $2", [
				novoStatus,
				id,
			]);

			return { novoStatus };
		}
	);

	fastify.delete(
		"/api/tarefas/:id",
		{ onRequest: [fastify.authenticate] },
		async (request, reply) => {
			const id = request.params.id;
			const userId = request.user.id;

			const result = await pool.query(
				"DELETE FROM tarefas WHERE id = $1 AND user_id = $2",
				[id, userId]
			);

			if (result.rowCount === 0) {
				return reply.status(404).send({ error: "Tarefa não encontrada" });
			}

			return { message: "Deletado!" };
		}
	);

	return fastify;
}

import { pathToFileURL } from "url";
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
	const app = buildServer();
	app.log.level = "info";
	try {
		const port = process.env.PORT || 3000;
		const host = "0.0.0.0";
		await app.listen({ port, host });
		console.log(`SERVIDOR RODANDO! http://${host}:${port}`);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
}
