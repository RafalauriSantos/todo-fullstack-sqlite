import { useState, useEffect } from "react";

const styles = {
	container: {
		maxWidth: "600px",
		margin: "0 auto",
		padding: "20px",
		fontFamily: "Arial",
	},
	inputGroup: { display: "flex", gap: "10px", marginBottom: "20px" },
	input: { flex: 1, padding: "10px", fontSize: "16px" },
	buttonAdd: {
		padding: "10px 20px",
		background: "#28a745",
		color: "white",
		border: "none",
		cursor: "pointer",
	},
	list: { listStyle: "none", padding: 0 },
	item: {
		background: "#f4f4f4",
		padding: "10px",
		margin: "5px 0",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
	texto: { cursor: "pointer", flex: 1 },
	riscado: { textDecoration: "line-through", color: "#888" },
	btnDelete: {
		background: "transparent",
		border: "none",
		color: "red",
		cursor: "pointer",
		fontSize: "18px",
	},
};

function App() {
	const [tarefas, setTarefas] = useState([]);
	const [novoTexto, setNovoTexto] = useState("");

	// --- 1. CARREGAR DADOS (Blindado dentro do useEffect) ---
	useEffect(() => {
		// Definimos a função aqui dentro para evitar conflitos e loops
		async function fetchDados() {
			try {
				const response = await fetch("http://localhost:3000/api/tarefas");
				const data = await response.json();
				setTarefas(data);
			} catch (error) {
				console.error("Erro ao buscar:", error);
			}
		}

		fetchDados(); // Chamamos ela imediatamente
	}, []); // O array vazio [] garante que só roda UMA vez (no início)

	// --- 2. FUNÇÕES DE USUÁRIO (Botões) ---

	async function adicionarTarefa() {
		if (!novoTexto) return;

		try {
			const response = await fetch("http://localhost:3000/api/tarefas", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ texto: novoTexto }),
			});
			const novaTarefa = await response.json();

			setTarefas([...tarefas, novaTarefa]);
			setNovoTexto("");
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

	// --- 3. VISUAL (JSX) ---
	return (
		<div style={styles.container}>
			<h1>Lista de Tarefas (React) ⚛️</h1>

			<div style={styles.inputGroup}>
				<input
					type="text"
					placeholder="O que precisa ser feito?"
					style={styles.input}
					value={novoTexto}
					onChange={(e) => setNovoTexto(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && adicionarTarefa()}
				/>
				<button onClick={adicionarTarefa} style={styles.buttonAdd}>
					Adicionar
				</button>
			</div>

			<ul style={styles.list}>
				{tarefas.map((tarefa) => (
					<li key={tarefa.id} style={styles.item}>
						<span
							onClick={() => toggleTarefa(tarefa.id)}
							style={
								tarefa.concluida
									? { ...styles.texto, ...styles.riscado }
									: styles.texto
							}>
							{tarefa.texto}
						</span>

						<button
							onClick={() => deletarTarefa(tarefa.id)}
							style={styles.btnDelete}>
							🗑️
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
