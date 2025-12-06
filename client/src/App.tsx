import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import { Tarefa } from "./types";
import { api } from "./services/api";

function App() {
	const [tarefas, setTarefas] = useState<Tarefa[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

	useEffect(() => {
		async function carregarDados() {
			setIsLoading(true);
			setError(null);
			try {
				const data = await api.getTarefas();
				setTarefas(data);
			} catch (error) {
				console.error("Erro ao buscar:", error);
				setError(
					"Falha ao carregar tarefas. Verifique se o servidor está rodando."
				);
			} finally {
				setIsLoading(false);
			}
		}
		carregarDados();
	}, []);

	async function adicionarTarefa(texto: string) {
		try {
			setError(null);
			const novaTarefa = await api.createTarefa(texto);
			setTarefas([...tarefas, novaTarefa]);
		} catch (error) {
			console.error("Erro ao adicionar:", error);
			setError("Erro ao criar tarefa. Tente novamente.");
		}
	}

	async function toggleTarefa(id: number) {
		try {
			await api.toggleTarefa(id);
			setTarefas(
				tarefas.map((t) => {
					if (t.id === id) return { ...t, concluida: t.concluida ? 0 : 1 };
					return t;
				})
			);
		} catch (error) {
			console.error("Erro ao atualizar:", error);
			setError("Erro ao atualizar tarefa.");
		}
	}

	async function deletarTarefa(id: number) {
		try {
			await api.deleteTarefa(id);
			setTarefas(tarefas.filter((t) => t.id !== id));
		} catch (error) {
			console.error("Erro ao deletar:", error);
			setError("Erro ao deletar tarefa.");
		}
	}

	async function editarTarefa(id: number, novoTexto: string) {
		try {
			await api.updateTarefaTexto(id, novoTexto);
			setTarefas(
				tarefas.map((t) => {
					if (t.id === id) return { ...t, texto: novoTexto };
					return t;
				})
			);
		} catch (error) {
			console.error("Erro ao editar:", error);
			setError("Erro ao editar tarefa.");
		}
	}

	const filteredTarefas = tarefas.filter((t) => {
		if (filter === "active") return t.concluida === 0;
		if (filter === "completed") return t.concluida === 1;
		return true;
	});

	return (
		<div className="min-h-screen py-10 px-4">
			<div className="w-full max-w-xl mx-auto">
				<Header />

				<TaskInput onAdicionar={adicionarTarefa} />

				{/* Filtros */}
				<div className="flex gap-2 mb-6 justify-center">
					{(["all", "active", "completed"] as const).map((f) => (
						<button
							key={f}
							onClick={() => setFilter(f)}
							className={`px-4 py-2 rounded-lg font-medium transition-colors ${
								filter === f
									? "bg-blue-600 text-white"
									: "bg-slate-800 text-slate-400 hover:bg-slate-700"
							}`}>
							{f === "all"
								? "Todas"
								: f === "active"
								? "Pendentes"
								: "Concluídas"}
						</button>
					))}
				</div>

				{/* Feedback de Erro */}
				{error && (
					<div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 text-center">
						{error}
					</div>
				)}

				{/* Loading ou Lista */}
				{isLoading ? (
					<div className="text-center py-10">
						<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
						<p className="text-slate-400">Carregando tarefas...</p>
					</div>
				) : (
					<TaskList
						tarefas={filteredTarefas}
						onToggle={toggleTarefa}
						onDeletar={deletarTarefa}
						onEditar={editarTarefa}
					/>
				)}
			</div>
			<Analytics />
		</div>
	);
}

export default App;
