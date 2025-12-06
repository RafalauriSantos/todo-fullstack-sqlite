import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Header from "./Header";
import React from "react";

describe("Header", () => {
	it("renders the title correctly", () => {
		render(<Header />);
		expect(screen.getByText(/Task Manager/i)).toBeInTheDocument();
	});

	it("renders the subtitle correctly", () => {
		render(<Header />);
		expect(screen.getByText(/FULLSTACK REACT \+ NODE.JS/i)).toBeInTheDocument();
	});
});
