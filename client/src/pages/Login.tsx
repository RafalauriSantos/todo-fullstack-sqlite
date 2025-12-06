import React, { useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authStyles as styles } from "../styles/authStyles";
import GlassInput from "../components/GlassInput";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [error, setError] = useState("");
	const { login } = useAuth();
	const navigate = useNavigate();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		try {
			await login(email, password);
			navigate("/");
		} catch (err: any) {
			setError(err.message || "Erro ao fazer login");
		}
	}

	return (
		<div style={styles.container}>
			<div style={{ ...styles.blobBase, ...styles.blob1 }}></div>
			<div style={{ ...styles.blobBase, ...styles.blob2 }}></div>
			<div style={styles.glassCard}>
				<div style={styles.brandContainer}>
					<h1 style={styles.brandTitle}>To Task</h1>
					<p style={styles.brandSubtitle}>Organize sua vida com elegância</p>
				</div>

				<h2 style={styles.title}>Login</h2>

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

					<div style={styles.actionsRow}>
						<label style={styles.rememberMeToggle}>
							Remember me
							<input
								type="checkbox"
								style={styles.toggleInput}
								checked={rememberMe}
								onChange={() => setRememberMe(!rememberMe)}
							/>
							<div
								style={{
									...styles.toggleSlider,
									...(rememberMe ? styles.toggleSliderActive : {}),
								}}>
								<div
									style={{
										...styles.toggleKnob,
										...(rememberMe ? styles.toggleKnobActive : {}),
									}}></div>
							</div>
						</label>
						<span style={styles.link}>Forgot Password?</span>
					</div>

					<button
						type="submit"
						style={styles.mainButton}
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
						Login
					</button>
				</form>

				<p style={styles.switchFormText}>
					Don't have an account?
					<Link to="/register" style={styles.switchFormLink}>
						Sign Up
					</Link>
				</p>
			</div>
		</div>
	);
}
