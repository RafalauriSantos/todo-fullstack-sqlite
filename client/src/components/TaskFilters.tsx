interface TaskFiltersProps {
	currentFilter: "all" | "active" | "completed";
	onFilterChange: (filter: "all" | "active" | "completed") => void;
}

export default function TaskFilters({
	currentFilter,
	onFilterChange,
}: TaskFiltersProps) {
	const filters = [
		{ value: "all" as const, label: "Todas" },
		{ value: "active" as const, label: "Pendentes" },
		{ value: "completed" as const, label: "Concluídas" },
	];

	return (
		<div className="flex gap-2 mb-6 justify-center">
			{filters.map(({ value, label }) => (
				<button
					key={value}
					onClick={() => onFilterChange(value)}
					className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 border ${
						currentFilter === value
							? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20"
							: "bg-slate-800 text-slate-400 border-slate-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1"
					}`}>
					{label}
				</button>
			))}
		</div>
	);
}
