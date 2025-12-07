import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import compress from "@fastify/compress";
import fastifyStatic from "@fastify/static";
import pg from "pg";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import crypto from "crypto";

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function buildServer() {
	const fastify = Fastify({ logger: false });

	fastify.register(compress, { global: true });

	fastify.register(cors, {
		origin: "*",
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
	});

	fastify.register(jwt, {
		secret: process.env.JWT_SECRET || "supersecret",
	});

	fastify.decorate("authenticate", async function (request, reply) {
		try {
			await request.jwtVerify();
		} catch (err) {
			reply.send(err);
		}
	});

	const pool = new Pool({
		connectionString: process.env.DATABASE_URL,
		ssl: process.env.DATABASE_URL?.includes("neon.tech")
			? { rejectUnauthorized: false }
			: false,
	});

	const initDb = async () => {
		try {
			await pool.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL
                )
            `);

			await pool.query(`
                CREATE TABLE IF NOT EXISTS tarefas (
                    id SERIAL PRIMARY KEY,
                    texto TEXT,
                    concluida INTEGER DEFAULT 0,
                    user_id INTEGER REFERENCES users(id)
                )
            `);

			await pool.query(`
                DO $$ 
                BEGIN 
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tarefas' AND column_name='user_id') THEN 
                        ALTER TABLE tarefas ADD COLUMN user_id INTEGER REFERENCES users(id);
                    END IF;
                END $$;
            `);

			await pool.query(`
                CREATE TABLE IF NOT EXISTS reset_tokens (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    token TEXT UNIQUE NOT NULL,
                    expires_at TIMESTAMP NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
		} catch (err) {
			console.error("Erro ao inicializar DB:", err);
		}
	};
	initDb();

	fastify.post("/api/register", async (request, reply) => {
		const { email, password } = request.body;

		// ✅ FAIL FAST - Validações NO TOPO
		if (!email?.trim() || !password) {
			return reply
				.status(400)
				.send({ error: "Email e senha são obrigatórios" });
		}

		if (password.length < 6) {
			return reply
				.status(400)
				.send({ error: "Senha deve ter no mínimo 6 caracteres" });
		}

		if (password.length > 100) {
			return reply.status(400).send({ error: "Senha muito longa" });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return reply.status(400).send({ error: "Email inválido" });
		}

		try {
			const hashedPassword = await bcrypt.hash(password, 10);
			const result = await pool.query(
				"INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
				[email.trim().toLowerCase(), hashedPassword]
			);

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

		// ✅ FAIL FAST - Validações NO TOPO
		if (!email?.trim() || !password) {
			return reply
				.status(400)
				.send({ error: "Email e senha são obrigatórios" });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return reply.status(400).send({ error: "Email inválido" });
		}

		try {
			const result = await pool.query("SELECT * FROM users WHERE email = $1", [
				email.trim().toLowerCase(),
			]);
			const user = result.rows[0];

			if (!user || !(await bcrypt.compare(password, user.password))) {
				return reply.status(401).send({ error: "Email ou senha inválidos" });
			}

			const token = fastify.jwt.sign({ id: user.id, email: user.email });
			return { token };
		} catch (error) {
			fastify.log.error(error);
			return reply.status(500).send({ error: "Erro ao fazer login" });
		}
	});

	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST || "smtp.gmail.com",
		port: parseInt(process.env.SMTP_PORT || "587"),
		secure: false,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	});

	fastify.post("/api/forgot-password", async (request, reply) => {
		const { email } = request.body;

		if (!email?.trim()) {
			return reply.status(400).send({ error: "Email é obrigatório" });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return reply.status(400).send({ error: "Email inválido" });
		}

		try {
			const result = await pool.query("SELECT * FROM users WHERE email = $1", [
				email.trim().toLowerCase(),
			]);
			const user = result.rows[0];

			if (!user) {
				return { message: "Se o email existir, um link será enviado" };
			}

			const token = crypto.randomBytes(32).toString("hex");
			const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

			await pool.query(
				"INSERT INTO reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
				[user.id, token, expiresAt]
			);

			const resetUrl = `${
				process.env.FRONTEND_URL || "http://localhost:5173"
			}/reset-password/${token}`;

			// Modo desenvolvimento: apenas mostra link no console
			if (
				!process.env.SMTP_USER ||
				process.env.SMTP_USER === "seu-email@gmail.com"
			) {
				console.log("\n🔗 RESET PASSWORD LINK (DEV MODE):");
				console.log(`   User: ${email}`);
				console.log(`   Link: ${resetUrl}`);
				console.log(`   Expires: ${expiresAt.toLocaleString()}\n`);
				return {
					message: "Link de reset gerado (verifique o console do servidor)",
				};
			}

			await transporter.sendMail({
				from: process.env.SMTP_USER,
				to: email,
				subject: "Redefinir Senha - To Task",
				html: `
					<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
						<h2>Redefinir Senha</h2>
						<p>Você solicitou a redefinição de senha para sua conta no To Task.</p>
						<p>Clique no link abaixo para redefinir sua senha:</p>
						<a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
							Redefinir Senha
						</a>
						<p>Este link expira em 1 hora.</p>
						<p>Se você não solicitou esta redefinição, ignore este email.</p>
					</div>
				`,
			});

			return { message: "Se o email existir, um link será enviado" };
		} catch (error) {
			fastify.log.error(error);
			return reply.status(500).send({ error: "Erro ao processar solicitação" });
		}
	});

	fastify.post("/api/reset-password", async (request, reply) => {
		const { token, password } = request.body;

		if (!token || !password) {
			return reply
				.status(400)
				.send({ error: "Token e senha são obrigatórios" });
		}

		if (password.length < 6) {
			return reply
				.status(400)
				.send({ error: "Senha deve ter no mínimo 6 caracteres" });
		}

		if (password.length > 100) {
			return reply.status(400).send({ error: "Senha muito longa" });
		}

		try {
			const result = await pool.query(
				"SELECT * FROM reset_tokens WHERE token = $1 AND expires_at > NOW()",
				[token]
			);
			const resetToken = result.rows[0];

			if (!resetToken) {
				return reply.status(400).send({ error: "Token inválido ou expirado" });
			}

			const hashedPassword = await bcrypt.hash(password, 10);
			await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
				hashedPassword,
				resetToken.user_id,
			]);

			await pool.query("DELETE FROM reset_tokens WHERE user_id = $1", [
				resetToken.user_id,
			]);

			return { message: "Senha redefinida com sucesso" };
		} catch (error) {
			fastify.log.error(error);
			return reply.status(500).send({ error: "Erro ao redefinir senha" });
		}
	});

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
			const { texto } = request.body;

			if (!texto?.trim()) {
				return reply
					.status(400)
					.send({ error: "Texto da tarefa é obrigatório" });
			}

			if (texto.trim().length > 200) {
				return reply
					.status(400)
					.send({ error: "Tarefa muito longa (máx 200 caracteres)" });
			}

			try {
				const result = await pool.query(
					"INSERT INTO tarefas (texto, user_id) VALUES ($1, $2) RETURNING id, texto, concluida",
					[texto.trim(), request.user.id]
				);
				const tarefa = result.rows[0];
				return {
					id: tarefa.id,
					texto: tarefa.texto,
					concluida: Number(tarefa.concluida) || 0,
				};
			} catch (error) {
				fastify.log.error(error);
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

	if (process.env.NODE_ENV === "production") {
		fastify.register(fastifyStatic, {
			root: path.join(__dirname, "client", "dist"),
			prefix: "/",
			wildcard: false,
		});

		fastify.setNotFoundHandler((request, reply) => {
			if (request.url.startsWith("/api")) {
				reply.status(404).send({ error: "Route not found" });
			} else {
				reply.type("text/html").sendFile("index.html");
			}
		});
	}

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
