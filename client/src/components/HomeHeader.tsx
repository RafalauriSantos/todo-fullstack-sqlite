interface HomeHeaderProps {
	user: string;
	onLogout: () => void;
}

export default function HomeHeader({ user, onLogout }: HomeHeaderProps) {
	return (
		<div className="flex justify-between items-center mb-4">
			<span className="text-slate-400 text-sm">Olá, {user}</span>
			<button
				onClick={onLogout}
				className="text-red-400 text-sm hover:underline">
				Sair
			</button>
		</div>
	);
}
