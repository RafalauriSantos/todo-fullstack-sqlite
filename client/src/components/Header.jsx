// client/src/components/Header.jsx

function Header() {
	const estiloTitulo = {
		textAlign: "center",
		color: "#333",
		marginBottom: "20px",
		borderBottom: "2px solid #ddd",
		paddingBottom: "10px",
	};

	return (
		<header>
			<h1 style={estiloTitulo}>Lista de Tarefas (React) ⚛️</h1>
		</header>
	);
}

export default Header;
