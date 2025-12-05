import { useState } from "react";

// 1. O CONTRATO (Interface)
// Dizemos que este componente ACEITA uma prop chamada 'onAdicionar'
// E essa prop é uma FUNÇÃO que recebe um texto (string) e não devolve nada (void).
interface TaskInputProps {
	onAdicionar: (texto: string) => void;
}

// 2. APLICAÇÃO DO CONTRATO
// Adicionamos ": TaskInputProps" logo após desestruturar as props
function TaskInput({ onAdicionar }: TaskInputProps) {
	const [textoLocal, setTextoLocal] = useState("");

	// CSS in JS (com tipagem implícita)
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
		onAdicionar(textoLocal);
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
