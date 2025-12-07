import React from "react";

export function AuthContainer({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen w-full relative overflow-hidden bg-slate-950 flex justify-center items-center p-5 font-['Inter']">
			<div
				className="absolute top-[10%] left-[10%] w-[60vw] max-w-[450px] h-[60vw] max-h-[450px] rounded-full bg-indigo-700 opacity-50 blur-[80px] animate-[moveFirst_25s_infinite_ease-in-out_alternate] -z-10"
				style={{ animation: "moveFirst 25s infinite ease-in-out alternate" }}
			/>

			<div
				className="absolute bottom-[10%] right-[10%] w-[50vw] max-w-[400px] h-[50vw] max-h-[400px] rounded-full bg-blue-500 opacity-50 blur-[80px] animate-[moveSecond_20s_infinite_ease-in-out_alternate] -z-10"
				style={{ animation: "moveSecond 20s infinite ease-in-out alternate" }}
			/>

			{children}
		</div>
	);
}

export function GlassCard({ children }: { children: React.ReactNode }) {
	return (
		<div className="w-full max-w-[400px] p-10 rounded-3xl bg-white/[0.03] shadow-[0_4px_30px_rgba(0,0,0,0.2)] backdrop-blur-[20px] border border-white/10 text-white z-10">
			{children}
		</div>
	);
}

export function BrandHeader({
	title,
	subtitle,
}: {
	title: string;
	subtitle: string;
}) {
	return (
		<div className="text-center mb-10">
			<h1 className="font-['Poppins'] text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1 tracking-tighter">
				{title}
			</h1>
			<p className="text-sm text-white/60 font-light">{subtitle}</p>
		</div>
	);
}

/**
 * ✅ SoC - Título de seção
 */
export function SectionTitle({ children }: { children: React.ReactNode }) {
	return (
		<h2 className="text-2xl font-semibold mb-6 text-left text-white/90">
			{children}
		</h2>
	);
}

/**
 * ✅ SoC - Banner de erro
 */
export function ErrorBanner({ error }: { error: string }) {
	return (
		<div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-5 text-sm">
			{error}
		</div>
	);
}

/**
 * ✅ SoC - Botão principal com gradiente
 */
export function PrimaryButton({
	children,
	type = "button",
	onClick,
	disabled = false,
}: {
	children: React.ReactNode;
	type?: "button" | "submit";
	onClick?: () => void;
	disabled?: boolean;
}) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className="w-full py-4 border-none rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-lg font-bold cursor-pointer shadow-[0_4px_15px_rgba(59,130,246,0.4)] transition-all duration-200 hover:scale-105 hover:shadow-[0_6px_20px_rgba(59,130,246,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
			{children}
		</button>
	);
}

/**
 * ✅ SoC - Texto de troca de formulário
 */
export function FormSwitchText({
	text,
	linkText,
	linkTo,
}: {
	text: string;
	linkText: string;
	linkTo: string;
}) {
	return (
		<p className="text-center mt-5 text-white/60 text-sm">
			{text}
			<a
				href={linkTo}
				className="text-blue-400 font-bold cursor-pointer ml-1 no-underline hover:underline">
				{linkText}
			</a>
		</p>
	);
}
