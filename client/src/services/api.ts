import { Tarefa } from "../types";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function fetchAPI<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers: { ...getHeaders(), ...options.headers },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro na requisição");
    }

    return response.json();
}

export const api = {
    async register(email: string, password: string): Promise<{ id: number; email: string }> {
        return fetchAPI("/api/register", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
    },

    async login(email: string, password: string): Promise<{ token: string }> {
        return fetchAPI("/api/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
    },

    async getTarefas(): Promise<Tarefa[]> {
        return fetchAPI("/api/tarefas");
    },

    async createTarefa(texto: string): Promise<Tarefa> {
        return fetchAPI("/api/tarefas", {
            method: "POST",
            body: JSON.stringify({ texto }),
        });
    },

    async toggleTarefa(id: number): Promise<{ novoStatus: number }> {
        return fetchAPI(`/api/tarefas/${id}`, {
            method: "PATCH",
        });
    },

    async updateTarefaTexto(id: number, texto: string): Promise<void> {
        await fetchAPI(`/api/tarefas/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ texto }),
        });
    },

    async deleteTarefa(id: number): Promise<void> {
        await fetchAPI(`/api/tarefas/${id}`, {
            method: "DELETE",
        });
    },
};
