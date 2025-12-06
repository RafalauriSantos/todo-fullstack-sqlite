import Fastify from "fastify";
import cors from "@fastify/cors";
import Database from "better-sqlite3";

// Função que CONSTRÓI o servidor (mas não liga)
export function buildServer() {
	const fastify = Fastify({ logger: false }); // Logger false pra não sujar o teste

	// 1. Plugins
	fastify.register(cors, {
		origin: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
	});

	// 2. Banco de Dados
	const db = new Database("dados.db");
	db.prepare(
		`
        CREATE TABLE IF NOT EXISTS tarefas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            texto TEXT,
            concluida INTEGER DEFAULT 0 
        )
    `
	).run();

	// 3. Rotas
	fastify.get("/", async () => {
		return { message: "API Rodando!" };
	});

	fastify.get("/api/tarefas", async () => {
		return db.prepare("SELECT * FROM tarefas").all();
	});

	fastify.post("/api/tarefas", async (request, reply) => {
		const dados = request.body;
		if (!dados.texto || !dados.texto.trim()) {
			return reply.status(400).send({ error: "Texto da tarefa é obrigatório" });
		}
		const inserir = db.prepare("INSERT INTO tarefas (texto) VALUES (?)");
		const info = inserir.run(dados.texto);
		return { id: info.lastInsertRowid, texto: dados.texto, concluida: 0 };
	});

	fastify.patch("/api/tarefas/:id", async (request, reply) => {
		const id = request.params.id;
		const dados = request.body || {};

		// Se enviou texto, atualiza o texto
		if (dados.texto) {
			const stmt = db.prepare("UPDATE tarefas SET texto = ? WHERE id = ?");
			const info = stmt.run(dados.texto, id);
			if (info.changes === 0)
				return reply.status(404).send({ error: "Tarefa não encontrada" });
			return { id, texto: dados.texto };
		}

		// Se não enviou texto, mantém a lógica de alternar status (toggle)
		const tarefa = db
			.prepare("SELECT concluida FROM tarefas WHERE id = ?")
			.get(id);

		if (!tarefa)
			return reply.status(404).send({ error: "Tarefa não encontrada" });

		const novoStatus = tarefa.concluida === 0 ? 1 : 0;
		db.prepare("UPDATE tarefas SET concluida = ? WHERE id = ?").run(
			novoStatus,
			id
		);
		return { novoStatus };
	});

	fastify.delete("/api/tarefas/:id", async (request) => {
		const id = request.params.id;
		db.prepare("DELETE FROM tarefas WHERE id = ?").run(id);
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
		await app.listen({ port: 3000 });
		console.log("SERVIDOR RODANDO! http://localhost:3000");
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
}
