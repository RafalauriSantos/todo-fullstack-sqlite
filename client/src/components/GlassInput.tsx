import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface GlassInputProps {
	icon?: React.ReactNode;
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
		<div className="relative mb-5">
			{icon && (
				<span className="absolute left-0 top-1/2 -translate-y-1/2 text-white/60 text-xl flex items-center">
					{icon}
				</span>
			)}
			<input
				type={inputType}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				required={required}
				className={`w-full py-3 ${icon ? 'px-9' : 'px-4'} bg-transparent border-0 border-b border-white/30 text-white text-base outline-none transition-colors focus:border-blue-400`}
			/>
			{isPasswordToggle && (
				<span
					className="absolute right-0 top-1/2 -translate-y-1/2 text-white/60 cursor-pointer text-xl flex items-center hover:text-white/80"
					onClick={() => setShowPassword(!showPassword)}>
					{showPassword ? <FiEyeOff /> : <FiEye />}
				</span>
			)}
		</div>
	);
};

export default GlassInput;
