import Fastify from "fastify";
import cors from "@fastify/cors"; // <--- TEM QUE TER ISSO
import fs from "fs";
import Database from "better-sqlite3";

const fastify = Fastify({ logger: true });

/// 2. ATIVA O CORS (CRUCIAL: Tem que ser AQUI, no topo!)
await fastify.register(cors, {
	origin: true, // Permite tudo
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Garante que DELETE e PATCH passem
});

// --- BANCO DE DADOS ---
const db = new Database("dados.db");

// Cria a tabela com a nova coluna 'concluida'
db.prepare(
	`
    CREATE TABLE IF NOT EXISTS tarefas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        texto TEXT,
        concluida INTEGER DEFAULT 0 
    )
`
).run();
// (Nota: No SQLite, usamos 0 para false e 1 para true)

// --- ROTAS ---

// 1. Site
fastify.get("/", async (request, reply) => {
	const html = fs.readFileSync("./index.html", "utf8");
	return reply.type("text/html").send(html);
});

// 2. API: Buscar todas (Retorna o objeto completo: id, texto, concluida)
fastify.get("/api/tarefas", async (request, reply) => {
	return db.prepare("SELECT * FROM tarefas").all();
});

// 3. API: Criar tarefa
fastify.post("/api/tarefas", async (request, reply) => {
	const dados = request.body;
	const inserir = db.prepare("INSERT INTO tarefas (texto) VALUES (?)");
	const info = inserir.run(dados.texto);

	// Devolvemos o ID da tarefa criada para o front-end saber quem ela é
	return { id: info.lastInsertRowid, texto: dados.texto, concluida: 0 };
});

// 4. API: Atualizar Status (PATCH) - O "U" do CRUD
fastify.patch("/api/tarefas/:id", async (request, reply) => {
	const id = request.params.id;

	// 1. Descobre como ela está agora
	const tarefa = db
		.prepare("SELECT concluida FROM tarefas WHERE id = ?")
		.get(id);

	if (!tarefa) return { error: "Tarefa não encontrada" };

	// 2. Inverte o status (se é 0 vira 1, se é 1 vira 0)
	const novoStatus = tarefa.concluida === 0 ? 1 : 0;

	// 3. Salva no banco
	db.prepare("UPDATE tarefas SET concluida = ? WHERE id = ?").run(
		novoStatus,
		id
	);

	return { novoStatus };
});

// 5. API: Deletar (Agora usando ID, muito mais seguro!)
fastify.delete("/api/tarefas/:id", async (request, reply) => {
	const id = request.params.id;
	db.prepare("DELETE FROM tarefas WHERE id = ?").run(id);
	return { message: "Deletado!" };
});

// Roda o servidor
try {
	await fastify.listen({ port: 3000 });
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}
