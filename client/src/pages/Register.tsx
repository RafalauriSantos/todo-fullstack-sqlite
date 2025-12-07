import React, { useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GlassInput from "../components/GlassInput";
import {
	validateEmail,
	validatePassword,
	validatePasswordMatch,
} from "../utils/validators";
import {
	AuthContainer,
	GlassCard,
	BrandHeader,
	SectionTitle,
	ErrorBanner,
	PrimaryButton,
	FormSwitchText,
} from "../components/AuthUI";

export default function Register() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const { register } = useAuth();
	const navigate = useNavigate();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");

		// ✅ FAIL FAST - Valida tudo antes de fazer request HTTP
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

		const matchError = validatePasswordMatch(password, confirmPassword);
		if (matchError) {
			setError(matchError);
			return;
		}

		try {
			await register(email, password);
			navigate("/");
		} catch (err: any) {
			setError(err.message || "Erro ao cadastrar");
		}
	}

	return (
		<AuthContainer>
			<GlassCard>
				<BrandHeader title="To Task" subtitle="Junte-se a nós hoje" />

				<SectionTitle>Sign Up</SectionTitle>

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

					<GlassInput
						icon={<FiLock />}
						type="password"
						placeholder="Confirm Password"
						isPasswordToggle={true}
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>

					<div className="mt-5">
						<PrimaryButton type="submit">Create Account</PrimaryButton>
					</div>
				</form>

				<FormSwitchText
					text="Already have an account?"
					linkText="Login"
					linkTo="/login"
				/>
			</GlassCard>
		</AuthContainer>
	);
}

export default function Register() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const { register } = useAuth();
	const navigate = useNavigate();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");

		// ✅ FAIL FAST - Valida tudo antes de fazer request HTTP
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

		const matchError = validatePasswordMatch(password, confirmPassword);
		if (matchError) {
			setError(matchError);
			return;
		}

		try {
			await register(email, password);
			navigate("/");
		} catch (err: any) {
			setError(err.message || "Erro ao cadastrar");
		}
	}

	return (
		<div style={styles.container}>
			<div style={{ ...styles.blobBase, ...styles.blob1 }}></div>
			<div style={{ ...styles.blobBase, ...styles.blob2 }}></div>
			<div style={styles.glassCard}>
				<div style={styles.brandContainer}>
					<h1 style={styles.brandTitle}>To Task</h1>
					<p style={styles.brandSubtitle}>Junte-se a nós hoje</p>
				</div>

				<h2 style={styles.title}>Sign Up</h2>

				{error && (
					<div
						style={{
							backgroundColor: "rgba(239, 68, 68, 0.2)",
							color: "#fca5a5",
							padding: "10px",
							borderRadius: "8px",
							marginBottom: "20px",
							fontSize: "14px",
						}}>
						{error}
					</div>
				)}

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

					<GlassInput
						icon={<FiLock />}
						type="password"
						placeholder="Confirm Password"
						isPasswordToggle={true}
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>

					<button
						type="submit"
						style={{ ...styles.mainButton, marginTop: "20px" }}
						onMouseOver={(e) => {
							e.currentTarget.style.transform = "scale(1.02)";
							e.currentTarget.style.boxShadow =
								"0 6px 20px rgba(59, 130, 246, 0.6)";
						}}
						onMouseOut={(e) => {
							e.currentTarget.style.transform = "scale(1)";
							e.currentTarget.style.boxShadow =
								"0 4px 15px rgba(59, 130, 246, 0.4)";
						}}>
						Create Account
					</button>
				</form>

				<p style={styles.switchFormText}>
					Already have an account?
					<Link to="/login" style={styles.switchFormLink}>
						Login
					</Link>
				</p>
			</div>
		</div>
	);
}
