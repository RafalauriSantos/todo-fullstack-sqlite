import { useState } from "react";

interface TaskInputProps {
	onAdicionar: (texto: string) => void;
}

function TaskInput({ onAdicionar }: TaskInputProps) {
	const [textoLocal, setTextoLocal] = useState("");

	function handleClick() {
		if (!textoLocal) return;
		onAdicionar(textoLocal);
		setTextoLocal("");
	}

	return (
		<div className="flex gap-3 mb-8 shadow-xl">
			<input
				type="text"
				placeholder="O que vamos fazer hoje?"
				className="flex-1 p-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
				value={textoLocal}
				onChange={(e) => setTextoLocal(e.target.value)}
				onKeyDown={(e) => e.key === "Enter" && handleClick()}
			/>
			<button
				onClick={handleClick}
				className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg shadow-blue-500/30">
				<span>Add</span> 🚀
			</button>
		</div>
	);
}

export default TaskInput;
