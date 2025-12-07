import { useState, useEffect } from "react";
import Header from "../components/Header";
import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";
import { Tarefa } from "../types";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { authStyles } from "../styles/authStyles";
import { useErrorHandler } from "../hooks/useErrorHandler";

export default function Home() {
	const [tarefas, setTarefas] = useState<Tarefa[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
	const { logout, user } = useAuth();
	const { error, handleError } = useErrorHandler(); // ✅ DRY - Hook reutilizável

	useEffect(() => {
		async function carregarDados() {
			setIsLoading(true);
			try {
				const data = await api.getTarefas();
				setTarefas(data);
			} catch (err) {
				handleError(err, "Falha ao carregar tarefas");
			} finally {
				setIsLoading(false);
			}
		}
		carregarDados();
	}, [handleError]);

	async function adicionarTarefa(texto: string) {
		try {
			const novaTarefa = await api.createTarefa(texto);
			setTarefas([...tarefas, novaTarefa]);
		} catch (err) {
			handleError(err, "Erro ao criar tarefa");
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
		} catch (err) {
			handleError(err, "Erro ao atualizar tarefa");
		}
	}

	async function deletarTarefa(id: number) {
		try {
			await api.deleteTarefa(id);
			setTarefas(tarefas.filter((t) => t.id !== id));
		} catch (err) {
			handleError(err, "Erro ao deletar tarefa");
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
		} catch (err) {
			handleError(err, "Erro ao editar tarefa");
		}
	}

	const filteredTarefas = tarefas.filter((t) => {
		if (filter === "active") return t.concluida === 0;
		if (filter === "completed") return t.concluida === 1;
		return true;
	});

	return (
		<div className="min-h-screen py-10 px-4" style={authStyles.pageBackground}>
			<div className="w-full max-w-xl mx-auto">
				<div className="flex justify-between items-center mb-4">
					<span className="text-slate-400 text-sm">Olá, {user}</span>
					<button
						onClick={logout}
						className="text-red-400 text-sm hover:underline">
						Sair
					</button>
				</div>

				<Header />

				<TaskInput onAdicionar={adicionarTarefa} />

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

				{error && (
					<div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 text-center">
						{error}
					</div>
				)}

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
		</div>
	);
}
