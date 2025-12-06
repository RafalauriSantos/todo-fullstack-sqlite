import "./index.css"; // <--- ESSA LINHA É OBRIGATÓRIA
import React from "react";
import ReactDOM from "react-dom/client";
import { injectSpeedInsights } from "@vercel/speed-insights";
import App from "./App.tsx";

// Initialize Vercel Speed Insights (runs only on client side)
injectSpeedInsights();

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
