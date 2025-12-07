import React from "react";

/**
 * ✅ SoC - Toggle Remember Me com Tailwind
 * Substitui authStyles inline styles complexos
 */
export function RememberMeToggle({
	checked,
	onChange,
}: {
	checked: boolean;
	onChange: () => void;
}) {
	return (
		<label className="flex items-center cursor-pointer">
			<span className="text-sm text-white/80 mr-3">Remember me</span>
			<div className="relative">
				<input
					type="checkbox"
					className="sr-only"
					checked={checked}
					onChange={onChange}
				/>
				<div
					className={`w-9 h-5 rounded-full transition-colors duration-300 ${
						checked ? "bg-blue-500" : "bg-white/20"
					}`}>
					<div
						className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
							checked ? "translate-x-4" : "translate-x-0"
						}`}
					/>
				</div>
			</div>
		</label>
	);
}

/**
 * ✅ SoC - Linha de ações (Remember Me + Forgot Password)
 */
export function ActionsRow({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex justify-between items-center mb-8 text-sm text-white/80">
			{children}
		</div>
	);
}

/**
 * ✅ SoC - Link de ação
 */
export function ActionLink({
	children,
	onClick,
	title,
}: {
	children: React.ReactNode;
	onClick?: () => void;
	title?: string;
}) {
	return (
		<span
			className="text-white/80 no-underline cursor-pointer hover:underline"
			onClick={onClick}
			title={title}>
			{children}
		</span>
	);
}
