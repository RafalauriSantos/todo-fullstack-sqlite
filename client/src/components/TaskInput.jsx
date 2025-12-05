import { useState } from "react";

function TaskInput({ onAdicionar }) {
	const [textoLocal, setTextoLocal] = useState("");

	const estiloContainer = {
		display: "flex",
		gap: "10px",
		marginBottom: "20px",
	};
	const estiloInput = { flex: 1, padding: "10px", fontSize: "16px" };
	const estiloBotao = {
		padding: "10px 20px",
		background: "#28a745",
		color: "white",
		border: "none",
		cursor: "pointer",
	};

	function handleClick() {
		if (!textoLocal) return;

		// AQUI A MÁGICA: Chama a função do Pai passando o texto
		onAdicionar(textoLocal);

		// Limpa o input
		setTextoLocal("");
	}

	return (
		<div style={estiloContainer}>
			<input
				type="text"
				placeholder="O que precisa ser feito?"
				style={estiloInput}
				value={textoLocal}
				onChange={(e) => setTextoLocal(e.target.value)}
				onKeyDown={(e) => e.key === "Enter" && handleClick()}
			/>
			<button onClick={handleClick} style={estiloBotao}>
				Adicionar
			</button>
		</div>
	);
}

export default TaskInput;
