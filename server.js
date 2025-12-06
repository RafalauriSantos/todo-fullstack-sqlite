import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import pg from "pg";

const { Pool } = pg;

// Função que CONSTRÓI o servidor (mas não liga)
export function buildServer() {
	const fastify = Fastify({ logger: false }); // Logger false pra não sujar o teste

	// 1. Plugins
	fastify.register(cors, {
		origin: "*", // Permite qualquer origem explicitamente
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
	});

	// 2. Banco de Dados (PostgreSQL)
	const pool = new Pool({
		connectionString: process.env.DATABASE_URL,
		// No Render/Neon, SSL é necessário. Em localhost, as vezes atrapalha se não tiver configurado.
		// Vamos habilitar SSL se a URL contiver "neon.tech" ou se estiver em produção.
		ssl: process.env.DATABASE_URL?.includes("neon.tech")
			? { rejectUnauthorized: false }
			: false,
	});

	// Inicializa a tabela
	pool
		.query(
			`
        CREATE TABLE IF NOT EXISTS tarefas (
            id SERIAL PRIMARY KEY,
            texto TEXT,
            concluida INTEGER DEFAULT 0 
        )
    `
		)
		.catch((err) => console.error("Erro ao criar tabela:", err));

	// 3. Rotas
	fastify.get("/", async () => {
		return { message: "API Rodando com PostgreSQL!" };
	});

	fastify.get("/api/tarefas", async () => {
		const result = await pool.query("SELECT * FROM tarefas ORDER BY id ASC");
		return result.rows;
	});

	fastify.post("/api/tarefas", async (request, reply) => {
		const dados = request.body;
		if (!dados.texto || !dados.texto.trim()) {
			return reply.status(400).send({ error: "Texto da tarefa é obrigatório" });
		}

		const result = await pool.query(
			"INSERT INTO tarefas (texto) VALUES ($1) RETURNING id, texto, concluida",
			[dados.texto]
		);
		return result.rows[0];
	});

	fastify.patch("/api/tarefas/:id", async (request, reply) => {
		const id = request.params.id;
		const dados = request.body || {};

		// Se enviou texto, atualiza o texto
		if (dados.texto) {
			const result = await pool.query(
				"UPDATE tarefas SET texto = $1 WHERE id = $2 RETURNING id, texto",
				[dados.texto, id]
			);

			if (result.rowCount === 0)
				return reply.status(404).send({ error: "Tarefa não encontrada" });

			return result.rows[0];
		}

		// Se não enviou texto, mantém a lógica de alternar status (toggle)
		const tarefaResult = await pool.query(
			"SELECT concluida FROM tarefas WHERE id = $1",
			[id]
		);
		const tarefa = tarefaResult.rows[0];

		if (!tarefa)
			return reply.status(404).send({ error: "Tarefa não encontrada" });

		const novoStatus = tarefa.concluida === 0 ? 1 : 0;
		await pool.query("UPDATE tarefas SET concluida = $1 WHERE id = $2", [
			novoStatus,
			id,
		]);

		return { novoStatus };
	});

	fastify.delete("/api/tarefas/:id", async (request) => {
		const id = request.params.id;
		await pool.query("DELETE FROM tarefas WHERE id = $1", [id]);
		return { message: "Deletado!" };
	});

	return fastify;
}

// Se este arquivo for rodado diretamente (node server.js), liga o servidor.
// Se for importado pelos testes, não faz nada (espera o teste mandar).
import { pathToFileURL } from "url";
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
	const app = buildServer();
	// Logger true aqui para ver os logs em desenvolvimento
	app.log.level = "info";
	try {
		const port = process.env.PORT || 3000;
		const host = "0.0.0.0"; // Necessário para o Render/Docker
		await app.listen({ port, host });
		console.log(`SERVIDOR RODANDO! http://${host}:${port}`);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
}
