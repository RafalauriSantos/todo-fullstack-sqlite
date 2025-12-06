export interface Tarefa {
	id: number;
	texto: string;
	concluida: number;
}

interface TaskListProps {
	tarefas: Tarefa[];
	onToggle: (id: number) => void;
	onDeletar: (id: number) => void;
}

function TaskList({ tarefas, onToggle, onDeletar }: TaskListProps) {
	if (tarefas.length === 0) {
		return (
			<div className="text-center text-slate-500 mt-10 p-10 border-2 border-dashed border-slate-800 rounded-xl bg-slate-800/30">
				<p className="text-lg">Nenhuma tarefa ainda... 🎉</p>
				<p className="text-sm opacity-70">Adicione uma acima!</p>
			</div>
		);
	}

	return (
		<ul className="space-y-3">
			{tarefas.map((tarefa) => (
				<li
					key={tarefa.id}
					className={`
			  flex justify-between items-center p-4 rounded-xl border transition-all duration-300 group
			  ${
					tarefa.concluida
						? "bg-slate-900/50 border-slate-800/50"
						: "bg-slate-800 border-slate-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1"
				}
			`}>
					<span
						onClick={() => onToggle(tarefa.id)}
						className={`
				cursor-pointer flex-1 text-lg select-none transition-all
				${
					tarefa.concluida
						? "line-through text-slate-600 decoration-2 decoration-slate-600"
						: "text-slate-100"
				}
			`}>
						{tarefa.texto}
					</span>

					<button
						onClick={() => onDeletar(tarefa.id)}
						className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
						title="Deletar">
						🗑️
					</button>
				</li>
			))}
		</ul>
	);
}

export default TaskList;
