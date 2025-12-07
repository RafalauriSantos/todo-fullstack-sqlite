/**
 * Validadores client-side para feedback instantâneo
 * Evita requests desnecessários ao servidor (~200-500ms economizados)
 */

export const validateEmail = (email: string): string | null => {
    if (!email.trim()) return "Email é obrigatório";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Email inválido";

    return null;
};

export const validatePassword = (password: string): string | null => {
    if (!password) return "Senha é obrigatória";
    if (password.length < 6) return "Senha deve ter no mínimo 6 caracteres";
    if (password.length > 100) return "Senha muito longa (máx 100 caracteres)";
    return null;
};

export const validateTaskText = (text: string): string | null => {
    const trimmed = text.trim();
    if (!trimmed) return "Tarefa não pode estar vazia";
    if (trimmed.length > 200) return "Tarefa muito longa (máx 200 caracteres)";
    return null;
};

export const validatePasswordMatch = (
    password: string,
    confirmPassword: string
): string | null => {
    if (password !== confirmPassword) return "As senhas não coincidem";
    return null;
};
