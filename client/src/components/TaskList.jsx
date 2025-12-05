// client/src/components/TaskList.jsx

function TaskList({ tarefas, onToggle, onDeletar }) {
	const styles = {
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

	return (
		<ul style={styles.list}>
			{tarefas.map((tarefa) => (
				<li key={tarefa.id} style={styles.item}>
					<span
						onClick={() => onToggle(tarefa.id)}
						style={
							tarefa.concluida
								? { ...styles.texto, ...styles.riscado }
								: styles.texto
						}>
						{tarefa.texto}
					</span>

					<button onClick={() => onDeletar(tarefa.id)} style={styles.btnDelete}>
						🗑️
					</button>
				</li>
			))}
		</ul>
	);
}

export default TaskList;
