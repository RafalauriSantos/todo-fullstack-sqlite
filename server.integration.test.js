import { describe, it, expect, beforeAll, afterAll } from "vitest";
import supertest from "supertest";
import { buildServer } from "./server.js";

describe("API Integration Tests", () => {
	let app;
	let request;
	let authToken;
	let userId;

	beforeAll(async () => {
		app = buildServer();
		await app.ready();
		request = supertest(app.server);
	});

	afterAll(async () => {
		await app.close();
	});

	describe("Authentication", () => {
		const testUser = {
			email: `test_${Date.now()}@example.com`,
			password: "test123456",
		};

		it("POST /api/register - registra novo usuário", async () => {
			const response = await request
				.post("/api/register")
				.send(testUser)
				.expect(200);

			expect(response.body).toHaveProperty("id");
			expect(response.body.email).toBe(testUser.email);
			userId = response.body.id;
		});

		it("POST /api/register - rejeita email duplicado", async () => {
			await request.post("/api/register").send(testUser).expect(400);
		});

		it("POST /api/login - faz login com credenciais válidas", async () => {
			const response = await request
				.post("/api/login")
				.send(testUser)
				.expect(200);

			expect(response.body).toHaveProperty("token");
			authToken = response.body.token;
		});

		it("POST /api/login - rejeita senha incorreta", async () => {
			await request
				.post("/api/login")
				.send({ email: testUser.email, password: "senhaErrada" })
				.expect(401);
		});
	});

	describe("Tasks CRUD", () => {
		let tarefaId;

		it("POST /api/tarefas - cria nova tarefa", async () => {
			const response = await request
				.post("/api/tarefas")
				.set("Authorization", `Bearer ${authToken}`)
				.send({ texto: "Tarefa de teste" })
				.expect(200);

			expect(response.body).toHaveProperty("id");
			expect(response.body.texto).toBe("Tarefa de teste");
			expect(response.body.concluida).toBe(0);
			tarefaId = response.body.id;
		});

		it("GET /api/tarefas - lista tarefas do usuário", async () => {
			const response = await request
				.get("/api/tarefas")
				.set("Authorization", `Bearer ${authToken}`)
				.expect(200);

			expect(Array.isArray(response.body)).toBe(true);
			expect(response.body.length).toBeGreaterThan(0);
			expect(response.body.some((t) => t.id === tarefaId)).toBe(true);
		});

		it("PATCH /api/tarefas/:id - marca tarefa como concluída", async () => {
			const response = await request
				.patch(`/api/tarefas/${tarefaId}`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({})
				.expect(200);

			expect(response.body.novoStatus).toBe(1);
		});

		it("PATCH /api/tarefas/:id - desmarca tarefa concluída", async () => {
			const response = await request
				.patch(`/api/tarefas/${tarefaId}`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({})
				.expect(200);

			expect(response.body.novoStatus).toBe(0);
		});

		it("PATCH /api/tarefas/:id - atualiza texto da tarefa", async () => {
			const response = await request
				.patch(`/api/tarefas/${tarefaId}`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ texto: "Texto atualizado" })
				.expect(200);

			expect(response.body.texto).toBe("Texto atualizado");
		});

		it("DELETE /api/tarefas/:id - deleta tarefa", async () => {
			await request
				.delete(`/api/tarefas/${tarefaId}`)
				.set("Authorization", `Bearer ${authToken}`)
				.expect(200);

			// Verifica que foi deletada
			const listResponse = await request
				.get("/api/tarefas")
				.set("Authorization", `Bearer ${authToken}`)
				.expect(200);

			expect(listResponse.body.some((t) => t.id === tarefaId)).toBe(false);
		});

		it("rejeita requisição sem autenticação", async () => {
			await request.get("/api/tarefas").expect(401);
		});
	});

	describe("Password Reset", () => {
		const testEmail = `reset_${Date.now()}@example.com`;

		beforeAll(async () => {
			// Criar usuário de teste para reset
			await request
				.post("/api/register")
				.send({ email: testEmail, password: "oldpass123" });
		});

		it("POST /api/forgot-password - envia email de reset (dev mode)", async () => {
			const response = await request
				.post("/api/forgot-password")
				.send({ email: testEmail })
				.expect(200);

			expect(response.body.message).toContain("enviado");
		});

		it("POST /api/forgot-password - aceita email inexistente (segurança)", async () => {
			// Não deve revelar se email existe ou não
			const response = await request
				.post("/api/forgot-password")
				.send({ email: "naoexiste@example.com" })
				.expect(200);

			expect(response.body.message).toContain("enviado");
		});

		// Note: Testar reset-password completo requer token do DB
		// Isso seria feito em teste E2E ou com mock
	});

	describe("Error Handling", () => {
		it("retorna 404 para rota inexistente", async () => {
			await request.get("/api/rota-invalida").expect(404);
		});

		it("rejeita body inválido", async () => {
			await request
				.post("/api/register")
				.send({ invalid: "data" })
				.expect(400);
		});
	});
});
