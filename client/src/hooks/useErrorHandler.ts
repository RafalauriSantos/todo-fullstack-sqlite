import { useState, useCallback } from "react";

/**
 * Hook DRY para tratamento de erros consistente
 * Elimina duplicação de lógica de erro em todos os componentes
 */
export function useErrorHandler() {
    const [error, setError] = useState<string | null>(null);

    const handleError = useCallback((err: any, defaultMsg: string) => {
        console.error(err);
        const errorMessage = err?.message || defaultMsg;
        setError(`❌ ${errorMessage}. Verifique sua conexão e tente novamente.`);

        // Auto-dismiss após 5 segundos
        setTimeout(() => setError(null), 5000);
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return { error, handleError, clearError };
}
