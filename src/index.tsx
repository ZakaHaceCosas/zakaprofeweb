import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import reportWebVitals from "./reportWebVitals.ts";
import { sendToVercelAnalytics } from "./vitals.ts";

const root = createRoot(document.getElementById("root")!);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

reportWebVitals(sendToVercelAnalytics);
