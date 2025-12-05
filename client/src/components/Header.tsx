// client/src/components/Header.tsx

function Header() {
	// Dica de TypeScript:
	// "as const" diz pro TS: "Isso não é qualquer string, é exatamente 'center'"
	// Isso evita erros chatos de tipagem no CSS.
	const estiloTitulo = {
		textAlign: "center" as const,
		color: "#333",
		marginBottom: "20px",
		borderBottom: "2px solid #ddd",
		paddingBottom: "10px",
	};

	return (
		<header>
			<h1 style={estiloTitulo}>Lista de Tarefas (React + TS) ⚛️</h1>
		</header>
	);
}

export default Header;
