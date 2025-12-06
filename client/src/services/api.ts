import { Tarefa } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = {
    async getTarefas(): Promise<Tarefa[]> {
        const response = await fetch(`${API_URL}/api/tarefas`);
        return response.json();
    },

    async createTarefa(texto: string): Promise<Tarefa> {
        const response = await fetch(`${API_URL}/api/tarefas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texto }),
        });
        return response.json();
    },

    async toggleTarefa(id: number): Promise<{ novoStatus: number }> {
        const response = await fetch(`${API_URL}/api/tarefas/${id}`, {
            method: "PATCH",
        });
        return response.json();
    },

    async updateTarefaTexto(id: number, texto: string): Promise<void> {
        await fetch(`${API_URL}/api/tarefas/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texto }),
        });
    },

    async deleteTarefa(id: number): Promise<void> {
        await fetch(`${API_URL}/api/tarefas/${id}`, {
            method: "DELETE",
        });
    },
};
