import { useState, useEffect } from "react";
import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
// Importamos a interface Tarefa que criamos no outro arquivo
import TaskList, { Tarefa } from "./components/TaskList";

const styles = {
	container: {
		maxWidth: "600px",
		margin: "0 auto",
		padding: "20px",
		fontFamily: "Arial",
	},
};

function App() {
	// AQUI A MÁGICA: <Tarefa[]>
	// Dizemos: "O estado é um Array de Tarefa"
	const [tarefas, setTarefas] = useState<Tarefa[]>([]);

	useEffect(() => {
		async function carregarDados() {
			try {
				const response = await fetch("http://localhost:3000/api/tarefas");
				const data = await response.json();
				setTarefas(data);
			} catch (error) {
				console.error("Erro ao buscar:", error);
			}
		}
		carregarDados();
	}, []);

	// Tipamos o argumento 'texto' como string
	async function adicionarTarefa(texto: string) {
		try {
			const response = await fetch("http://localhost:3000/api/tarefas", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ texto }),
			});
			const novaTarefa = await response.json();
			setTarefas([...tarefas, novaTarefa]);
		} catch (error) {
			console.error("Erro ao adicionar:", error);
		}
	}

	// Tipamos o 'id' como number
	async function toggleTarefa(id: number) {
		try {
			await fetch(`http://localhost:3000/api/tarefas/${id}`, {
				method: "PATCH",
			});
			setTarefas(
				tarefas.map((t) => {
					if (t.id === id) return { ...t, concluida: t.concluida ? 0 : 1 };
					return t;
				})
			);
		} catch (error) {
			console.error("Erro ao atualizar:", error);
		}
	}

	async function deletarTarefa(id: number) {
		try {
			await fetch(`http://localhost:3000/api/tarefas/${id}`, {
				method: "DELETE",
			});
			setTarefas(tarefas.filter((t) => t.id !== id));
		} catch (error) {
			console.error("Erro ao deletar:", error);
		}
	}

	return (
		<div style={styles.container}>
			<Header />
			<TaskInput onAdicionar={adicionarTarefa} />
			<TaskList
				tarefas={tarefas}
				onToggle={toggleTarefa}
				onDeletar={deletarTarefa}
			/>
		</div>
	);
}

export default App;
