import { Tarefa } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export const api = {
    async register(email: string, password: string): Promise<{ id: number; email: string }> {
        const response = await fetch(`${API_URL}/api/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Erro ao cadastrar");
        }
        return response.json();
    },

    async login(email: string, password: string): Promise<{ token: string }> {
        const response = await fetch(`${API_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Erro ao fazer login");
        }
        return response.json();
    },

    async getTarefas(): Promise<Tarefa[]> {
        const response = await fetch(`${API_URL}/api/tarefas`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error("Falha ao buscar tarefas");
        return response.json();
    },

    async createTarefa(texto: string): Promise<Tarefa> {
        const response = await fetch(`${API_URL}/api/tarefas`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ texto }),
        });
        if (!response.ok) throw new Error("Falha ao criar tarefa");
        return response.json();
    },

    async toggleTarefa(id: number): Promise<{ novoStatus: number }> {
        const response = await fetch(`${API_URL}/api/tarefas/${id}`, {
            method: "PATCH",
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error("Falha ao atualizar tarefa");
        return response.json();
    },

    async updateTarefaTexto(id: number, texto: string): Promise<void> {
        const response = await fetch(`${API_URL}/api/tarefas/${id}`, {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify({ texto }),
        });
        if (!response.ok) throw new Error("Falha ao atualizar texto");
    },

    async deleteTarefa(id: number): Promise<void> {
        const response = await fetch(`${API_URL}/api/tarefas/${id}`, {
            method: "DELETE",
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error("Falha ao deletar tarefa");
    },
};
