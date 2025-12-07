import React, { useState, useEffect } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GlassInput from "../components/GlassInput";
import { validateEmail, validatePassword } from "../utils/validators";
import {
	AuthContainer,
	GlassCard,
	BrandHeader,
	SectionTitle,
	ErrorBanner,
	PrimaryButton,
	FormSwitchText,
} from "../components/AuthUI";
import {
	RememberMeToggle,
	ActionsRow,
	ActionLink,
} from "../components/AuthControls";
import { ForgotPasswordModal } from "../components/ForgotPasswordModal";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [error, setError] = useState("");
	const [showForgotModal, setShowForgotModal] = useState(false);
	const { login } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const savedEmail = localStorage.getItem("rememberedEmail");
		if (savedEmail) {
			setEmail(savedEmail);
			setRememberMe(true);
		}
	}, []);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");

		const emailError = validateEmail(email);
		if (emailError) {
			setError(emailError);
			return;
		}

		const passwordError = validatePassword(password);
		if (passwordError) {
			setError(passwordError);
			return;
		}

		try {
			if (rememberMe) {
				localStorage.setItem("rememberedEmail", email);
			} else {
				localStorage.removeItem("rememberedEmail");
			}
			await login(email, password);
			navigate("/");
		} catch (err: any) {
			setError(err.message || "Erro ao fazer login");
		}
	}

	return (
		<AuthContainer>
			<GlassCard>
				<BrandHeader
					title="To Task"
					subtitle="Organize sua vida com elegância"
				/>

				<SectionTitle>Login</SectionTitle>

				{error && <ErrorBanner error={error} />}

				<form onSubmit={handleSubmit}>
					<GlassInput
						icon={<FiMail />}
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>

					<GlassInput
						icon={<FiLock />}
						type="password"
						placeholder="Password"
						isPasswordToggle={true}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>

					<ActionsRow>
						<RememberMeToggle
							checked={rememberMe}
							onChange={() => setRememberMe(!rememberMe)}
						/>
						<ActionLink onClick={() => setShowForgotModal(true)}>
							Forgot Password?
						</ActionLink>
					</ActionsRow>

					<PrimaryButton type="submit">Login</PrimaryButton>
				</form>

				<FormSwitchText
					text="Don't have an account?"
					linkText="Sign Up"
					linkTo="/register"
				/>
			</GlassCard>

			<ForgotPasswordModal
				isOpen={showForgotModal}
				onClose={() => setShowForgotModal(false)}
			/>
		</AuthContainer>
	);
}
