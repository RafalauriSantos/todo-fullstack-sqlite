// 1. DEFINIMOS O FORMATO DO DADO (O "Molde")
// Exportamos essa interface porque vamos precisar dela no App.tsx também
export interface Tarefa {
	id: number;
	texto: string;
	concluida: number; // Lembra que o SQLite usa 0 ou 1? Por isso é number.
}

// 2. DEFINIMOS AS PROPS DO COMPONENTE
interface TaskListProps {
	tarefas: Tarefa[]; // É uma Lista [] de Tarefas
	onToggle: (id: number) => void;
	onDeletar: (id: number) => void;
}

// 3. APLICAMOS A TIPAGEM
function TaskList({ tarefas, onToggle, onDeletar }: TaskListProps) {
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
						// O TS adora isso: ele sabe que 'tarefa' tem a propriedade 'concluida'
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
