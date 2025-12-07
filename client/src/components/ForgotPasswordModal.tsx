import { useState } from "react";
import GlassInput from "./GlassInput";
import { PrimaryButton } from "./AuthUI";
import { validateEmail } from "../utils/validators";
import { API_URL } from "../services/api";

interface ForgotPasswordModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function ForgotPasswordModal({
	isOpen,
	onClose,
}: ForgotPasswordModalProps) {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	if (!isOpen) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		const emailError = validateEmail(email);
		if (emailError) {
			setError(emailError);
			return;
		}

		setLoading(true);

		try {
			const response = await fetch(`${API_URL}/api/forgot-password`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Erro ao enviar email");
			}

			setSuccess(true);
			setTimeout(() => {
				onClose();
				setSuccess(false);
				setEmail("");
			}, 3000);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao enviar email");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
			onClick={onClose}>
			<div
				className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border border-white/20 shadow-2xl"
				onClick={(e) => e.stopPropagation()}>
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-white">Forgot Password?</h2>
					<button
						onClick={onClose}
						className="text-white/60 hover:text-white text-2xl leading-none"
						aria-label="Close">
						×
					</button>
				</div>

				{success ? (
					<div className="text-center py-8">
						<div className="text-green-400 text-5xl mb-4">✓</div>
						<p className="text-white text-lg">Email sent! Check your inbox.</p>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-6">
						<p className="text-white/80 text-sm mb-4">
							Enter your email address and we'll send you a link to reset your
							password.
						</p>
						{error && (
							<div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
								{error}
							</div>
						)}
						<GlassInput
							type="email"
							placeholder="Your email"
							value={email}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setEmail(e.target.value)
							}
							required
						/>{" "}
						<PrimaryButton type="submit" disabled={loading}>
							{loading ? "Sending..." : "Send Reset Link"}
						</PrimaryButton>
					</form>
				)}
			</div>
		</div>
	);
}
