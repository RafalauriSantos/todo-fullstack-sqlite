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
					className={`px-4 py-2 rounded-lg font-medium transition-colors ${
						currentFilter === value
							? "bg-blue-600 text-white"
							: "bg-slate-800 text-slate-400 hover:bg-slate-700"
					}`}>
					{label}
				</button>
			))}
		</div>
	);
}
