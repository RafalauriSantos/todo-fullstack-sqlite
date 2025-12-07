import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import GlassInput from "../components/GlassInput";
import { validatePassword } from "../utils/validators";
import { api } from "../services/api";
import {
	AuthContainer,
	GlassCard,
	BrandHeader,
	SectionTitle,
	ErrorBanner,
	PrimaryButton,
} from "../components/AuthUI";

export default function ResetPassword() {
	const { token } = useParams<{ token: string }>();
	const navigate = useNavigate();
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");

		const passwordError = validatePassword(password);
		if (passwordError) {
			setError(passwordError);
			return;
		}

		if (password !== confirmPassword) {
			setError("As senhas não coincidem");
			return;
		}

		setLoading(true);

		try {
			await api.resetPassword(token!, password);

			setSuccess(true);
			setTimeout(() => {
				navigate("/login");
			}, 2000);
		} catch (err: any) {
			setError(err.message || "Erro ao redefinir senha");
		} finally {
			setLoading(false);
		}
	}

	return (
		<AuthContainer>
			<GlassCard>
				<BrandHeader
					title="To Task"
					subtitle="Organize sua vida com elegância"
				/>

				<SectionTitle>Reset Password</SectionTitle>

				{success ? (
					<div className="text-center py-8">
						<div className="text-green-400 text-5xl mb-4">✓</div>
						<p className="text-white text-lg mb-2">
							Password reset successfully!
						</p>
						<p className="text-white/60 text-sm">Redirecting to login...</p>
					</div>
				) : (
					<>
						{error && <ErrorBanner error={error} />}

						<form onSubmit={handleSubmit}>
							<GlassInput
								icon={<FiLock />}
								type="password"
								placeholder="New Password"
								isPasswordToggle={true}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>

							<GlassInput
								icon={<FiLock />}
								type="password"
								placeholder="Confirm Password"
								isPasswordToggle={true}
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
							/>

							<PrimaryButton type="submit" disabled={loading}>
								{loading ? "Resetting..." : "Reset Password"}
							</PrimaryButton>
						</form>
					</>
				)}
			</GlassCard>
		</AuthContainer>
	);
}
