import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { authStyles as styles } from "../styles/authStyles";

interface GlassInputProps {
	icon: React.ReactNode;
	type: string;
	placeholder: string;
	isPasswordToggle?: boolean;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	required?: boolean;
}

const GlassInput: React.FC<GlassInputProps> = ({
	icon,
	type,
	placeholder,
	isPasswordToggle,
	value,
	onChange,
	required,
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const inputType =
		type === "password" ? (showPassword ? "text" : "password") : type;

	return (
		<div style={styles.inputGroup}>
			<span style={styles.inputIcon}>{icon}</span>
			<input
				type={inputType}
				placeholder={placeholder}
				style={styles.inputField}
				value={value}
				onChange={onChange}
				required={required}
				onFocus={(e) => (e.target.style.borderBottomColor = "#60a5fa")}
				onBlur={(e) =>
					(e.target.style.borderBottomColor = "rgba(255, 255, 255, 0.3)")
				}
			/>
			{isPasswordToggle && (
				<span
					style={styles.passwordToggleIcon}
					onClick={() => setShowPassword(!showPassword)}>
					{showPassword ? <FiEyeOff /> : <FiEye />}
				</span>
			)}
		</div>
	);
};

export default GlassInput;
