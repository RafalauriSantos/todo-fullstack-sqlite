import { useState, useEffect } from "react";
import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList"; // <--- IMPORT NOVO

function App() {
	const [tarefas, setTarefas] = useState([]);

	// Container principal
	const containerStyle = {
		maxWidth: "600px",
		margin: "0 auto",
		padding: "20px",
		fontFamily: "Arial",
	};

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

	async function adicionarTarefa(texto) {
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

	async function toggleTarefa(id) {
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

	async function deletarTarefa(id) {
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
		<div style={containerStyle}>
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
