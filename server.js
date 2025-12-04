import Fastify from "fastify";
import fs from "fs";
import Database from "better-sqlite3"; // Importa o banco

const fastify = Fastify({ logger: true });

// --- CONEXÃO COM O BANCO DE DADOS ---
// Cria um arquivo chamado 'dados.db' na sua pasta
const db = new Database("dados.db");

// COMANDO SQL: Cria a tabela se ela não existir
// É aqui que definimos as colunas (id e texto)
db.prepare(
	`
    CREATE TABLE IF NOT EXISTS tarefas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        texto TEXT
    )
`
).run();

// ------------------------------------

// Rota 1: O Site
fastify.get("/", async (request, reply) => {
	const html = fs.readFileSync("./index.html", "utf8");
	return reply.type("text/html").send(html);
});

// Rota 2: A API (GET - Buscar dados do BANCO)
fastify.get("/api/tarefas", async (request, reply) => {
	// COMANDO SQL: Selecione tudo da tabela tarefas
	const dadosDoBanco = db.prepare("SELECT texto FROM tarefas").all();

	// O banco devolve objetos tipo [{texto: "fazer x"}, {texto: "fazer y"}]
	// Vamos transformar numa lista simples ["fazer x", "fazer y"] pro seu front entender
	const listaSimples = dadosDoBanco.map((item) => item.texto);

	return listaSimples;
});

// Rota 3: A API (POST - Salvar no BANCO)
fastify.post("/api/tarefas", async (request, reply) => {
	const dados = request.body;

	// COMANDO SQL: Insira na tabela tarefas...
	const inserir = db.prepare("INSERT INTO tarefas (texto) VALUES (?)");
	inserir.run(dados.texto); // ...o texto que veio do front

	return { message: "Salvo no banco com sucesso!" };
});

// Roda o servidor
try {
	await fastify.listen({ port: 3000 });
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}
