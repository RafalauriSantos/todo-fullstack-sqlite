import { describe, test, expect } from 'vitest';
import {
    validateEmail,
    validatePassword,
    validateTaskText,
    validatePasswordMatch,
} from './validators';

describe('validateEmail', () => {
    test('aceita emails válidos', () => {
        expect(validateEmail('user@example.com')).toBe(null);
        expect(validateEmail('teste123@gmail.com')).toBe(null);
        expect(validateEmail('nome.sobrenome@empresa.com.br')).toBe(null);
    });

    test('rejeita emails inválidos', () => {
        expect(validateEmail('semArroba')).toBe('Email inválido');
        expect(validateEmail('sem@dominio')).toBe('Email inválido');
        expect(validateEmail('@semlocal.com')).toBe('Email inválido');
        expect(validateEmail('user@.com')).toBe('Email inválido');
    });

    test('rejeita email vazio', () => {
        expect(validateEmail('')).toBe('Email é obrigatório');
        expect(validateEmail('   ')).toBe('Email é obrigatório');
    });
});

describe('validatePassword', () => {
    test('aceita senhas válidas (6+ caracteres)', () => {
        expect(validatePassword('123456')).toBe(null);
        expect(validatePassword('senhaSegura123')).toBe(null);
        expect(validatePassword('a'.repeat(100))).toBe(null);
    });

    test('rejeita senhas curtas', () => {
        expect(validatePassword('12345')).toBe('Senha deve ter no mínimo 6 caracteres');
        expect(validatePassword('abc')).toBe('Senha deve ter no mínimo 6 caracteres');
    });

    test('rejeita senhas muito longas', () => {
        expect(validatePassword('a'.repeat(101))).toBe('Senha muito longa (máx 100 caracteres)');
    });

    test('rejeita senha vazia', () => {
        expect(validatePassword('')).toBe('Senha é obrigatória');
    });
});

describe('validateTaskText', () => {
    test('aceita textos válidos', () => {
        expect(validateTaskText('Comprar pão')).toBe(null);
        expect(validateTaskText('  Tarefa com espaços  ')).toBe(null);
        expect(validateTaskText('a'.repeat(200))).toBe(null);
    });

    test('rejeita texto vazio', () => {
        expect(validateTaskText('')).toBe('Tarefa não pode estar vazia');
        expect(validateTaskText('   ')).toBe('Tarefa não pode estar vazia');
    });

    test('rejeita texto muito longo', () => {
        expect(validateTaskText('a'.repeat(201))).toBe('Tarefa muito longa (máx 200 caracteres)');
    });
});

describe('validatePasswordMatch', () => {
    test('aceita senhas iguais', () => {
        expect(validatePasswordMatch('123456', '123456')).toBe(null);
        expect(validatePasswordMatch('senhaSegura', 'senhaSegura')).toBe(null);
    });

    test('rejeita senhas diferentes', () => {
        expect(validatePasswordMatch('123456', '654321')).toBe('As senhas não coincidem');
        expect(validatePasswordMatch('senha', 'Senha')).toBe('As senhas não coincidem');
    });
});
