import { useState, useEffect } from "react";
import Header from "../components/Header";
import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";
import HomeHeader from "../components/HomeHeader";
import TaskFilters from "../components/TaskFilters";
import { Tarefa } from "../types";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { ErrorBanner } from "../components/AuthUI";

export default function Home() {
	const [tarefas, setTarefas] = useState<Tarefa[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
	const { logout, user } = useAuth();
	const { error, handleError } = useErrorHandler();

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
		<div className="min-h-screen py-10 px-4 bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 relative overflow-hidden">
			<div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob" />
			<div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
			<div className="w-full max-w-xl mx-auto">
				<HomeHeader user={user} onLogout={logout} />
				<Header />
				<TaskInput onAdicionar={adicionarTarefa} />
				<TaskFilters currentFilter={filter} onFilterChange={setFilter} />
				{error && <ErrorBanner error={error} />}

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
