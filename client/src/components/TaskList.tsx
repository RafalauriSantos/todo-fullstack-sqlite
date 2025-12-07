import { useState } from "react";
import { Tarefa } from "../types";

interface TaskListProps {
	tarefas: Tarefa[];
	onToggle: (id: number) => void;
	onDeletar: (id: number) => void;
	onEditar: (id: number, novoTexto: string) => void;
}

function TaskList({ tarefas, onToggle, onDeletar, onEditar }: TaskListProps) {
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editText, setEditText] = useState("");

	function startEditing(tarefa: Tarefa) {
		setEditingId(tarefa.id);
		setEditText(tarefa.texto);
	}

	function cancelEditing() {
		setEditingId(null);
		setEditText("");
	}

	function saveEditing(id: number) {
		if (editText.trim()) {
			onEditar(id, editText);
		}
		setEditingId(null);
	}

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
					{editingId === tarefa.id ? (
						<div className="flex-1 flex gap-2 mr-2">
							<input
								type="text"
								value={editText}
								onChange={(e) => setEditText(e.target.value)}
								className="flex-1 bg-slate-900 text-white px-2 py-1 rounded border border-blue-500 focus:outline-none"
								autoFocus
								onKeyDown={(e) => {
									if (e.key === "Enter") saveEditing(tarefa.id);
									if (e.key === "Escape") cancelEditing();
								}}
							/>
							<button
								onClick={() => saveEditing(tarefa.id)}
								className="text-green-400 hover:bg-green-500/10 p-1 rounded"
								title="Salvar">
								✅
							</button>
							<button
								onClick={cancelEditing}
								className="text-red-400 hover:bg-red-500/10 p-1 rounded"
								title="Cancelar">
								❌
							</button>
						</div>
					) : (
						<>
							<div className="flex items-center gap-3 flex-1">
								<button
									onClick={() => onToggle(tarefa.id)}
									className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
										tarefa.concluida
											? "bg-blue-500 border-blue-500"
											: "border-slate-600 hover:border-blue-500 hover:bg-blue-500/10"
									}`}
									title={
										tarefa.concluida
											? "Marcar como pendente"
											: "Marcar como concluída"
									}>
									{tarefa.concluida && (
										<svg
											className="w-4 h-4 text-white"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="3"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path d="M5 13l4 4L19 7"></path>
										</svg>
									)}
								</button>

								<span
									onClick={() => onToggle(tarefa.id)}
									className={`cursor-pointer flex-1 text-lg select-none transition-all ${
										tarefa.concluida
											? "line-through text-slate-600 decoration-2 decoration-slate-600"
											: "text-slate-100"
									}`}>
									{tarefa.texto}
								</span>
							</div>

							<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
								<button
									onClick={() => startEditing(tarefa)}
									className="text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 p-2 rounded-lg transition-colors"
									title="Editar">
									✏️
								</button>
								<button
									onClick={() => onDeletar(tarefa.id)}
									className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
									title="Deletar">
									🗑️
								</button>
							</div>
						</>
					)}
				</li>
			))}
		</ul>
	);
}

export default TaskList;
