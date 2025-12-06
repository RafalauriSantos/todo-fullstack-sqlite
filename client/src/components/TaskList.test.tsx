import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaskList from "./TaskList";
import { Tarefa } from "../types";
import React from "react";

const mockTarefas: Tarefa[] = [
	{ id: 1, texto: "Tarefa 1", concluida: 0 },
	{ id: 2, texto: "Tarefa 2", concluida: 1 },
];

describe("TaskList", () => {
	it("renders empty state when no tasks", () => {
		render(
			<TaskList
				tarefas={[]}
				onToggle={vi.fn()}
				onDeletar={vi.fn()}
				onEditar={vi.fn()}
			/>
		);
		expect(screen.getByText(/Nenhuma tarefa ainda/i)).toBeInTheDocument();
	});

	it("renders tasks correctly", () => {
		render(
			<TaskList
				tarefas={mockTarefas}
				onToggle={vi.fn()}
				onDeletar={vi.fn()}
				onEditar={vi.fn()}
			/>
		);
		expect(screen.getByText("Tarefa 1")).toBeInTheDocument();
		expect(screen.getByText("Tarefa 2")).toBeInTheDocument();
	});

	it("calls onToggle when task text is clicked", () => {
		const onToggle = vi.fn();
		render(
			<TaskList
				tarefas={mockTarefas}
				onToggle={onToggle}
				onDeletar={vi.fn()}
				onEditar={vi.fn()}
			/>
		);
		fireEvent.click(screen.getByText("Tarefa 1"));
		expect(onToggle).toHaveBeenCalledWith(1);
	});

	it("calls onDeletar when delete button is clicked", () => {
		const onDeletar = vi.fn();
		render(
			<TaskList
				tarefas={mockTarefas}
				onToggle={vi.fn()}
				onDeletar={onDeletar}
				onEditar={vi.fn()}
			/>
		);
		const deleteButtons = screen.getAllByTitle("Deletar");
		fireEvent.click(deleteButtons[0]);
		expect(onDeletar).toHaveBeenCalledWith(1);
	});
});
