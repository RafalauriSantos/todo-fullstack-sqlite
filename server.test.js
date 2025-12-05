import { describe, it, expect, beforeAll, afterAll } from "vitest";
import supertest from "supertest";
import { buildServer } from "./server.js";

// Define um "bloco" de testes
describe("Testes da API de Tarefas", () => {
	let app;
	let request;

	// Antes de começar os testes, sobe o servidor
	beforeAll(async () => {
		app = buildServer();
		await app.ready(); // Espera o Fastify carregar os plugins
		request = supertest(app.server); // Conecta o robô (supertest) no servidor
	});

	// Depois que acabar, desliga tudo
	afterAll(async () => {
		await app.close();
	});

	// TESTE 1: Verificar se a API está viva
	it("Deve retornar 200 na rota raiz", async () => {
		const response = await request.get("/");
		expect(response.status).toBe(200);
		// Esperamos que a resposta seja um objeto JSON
		expect(response.body).toEqual({ message: "API Rodando!" });
	});

	// TESTE 2: O Fluxo Completo (Criar -> Conferir)
	it("Deve ser capaz de criar uma nova tarefa", async () => {
		// 1. Manda Criar (POST)
		const novaTarefa = { texto: "Testar com Vitest" };
		const createResponse = await request.post("/api/tarefas").send(novaTarefa);

		expect(createResponse.status).toBe(200);
		expect(createResponse.body.texto).toBe("Testar com Vitest");
		const idCriado = createResponse.body.id;

		// 2. Manda Buscar (GET) para ver se salvou mesmo
		const listResponse = await request.get("/api/tarefas");
		// Procura na lista se tem alguém com aquele ID
		const tarefaEncontrada = listResponse.body.find((t) => t.id === idCriado);

		expect(tarefaEncontrada).toBeDefined(); // Tem que ter achado!
		expect(tarefaEncontrada.texto).toBe("Testar com Vitest");
	});
});
