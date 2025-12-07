import { useState } from "react";
import { validateTaskText } from "../utils/validators";

interface TaskInputProps {
	onAdicionar: (texto: string) => void;
}

function TaskInput({ onAdicionar }: TaskInputProps) {
	const [textoLocal, setTextoLocal] = useState("");
	const [error, setError] = useState<string | null>(null);

	function handleClick() {
		const validationError = validateTaskText(textoLocal);
		if (validationError) {
			setError(validationError);
			setTimeout(() => setError(null), 3000);
			return;
		}
		setError(null);
		onAdicionar(textoLocal.trim());
		setTextoLocal("");
	}

	return (
		<div>
			<div className="flex gap-3 mb-2 shadow-xl">
				<input
					type="text"
					placeholder="O que vamos fazer hoje?"
					className={`flex-1 p-4 rounded-xl bg-slate-800 border text-white placeholder-slate-500 focus:outline-none transition-all duration-300 ${
						error
							? "border-red-500 focus:border-red-500 shadow-lg shadow-red-500/10"
							: "border-slate-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20"
					}`}
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
			{error && (
				<p className="text-red-400 text-sm mb-6 animate-pulse">⚠️ {error}</p>
			)}
		</div>
	);
}

export default TaskInput;
