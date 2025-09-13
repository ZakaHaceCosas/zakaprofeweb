import "./index.css";
import App from "./App.tsx";
import reportWebVitals from "./reportWebVitals.ts";
import { sendToVercelAnalytics } from "./vitals.ts";
import { createRoot } from "preact/compat/client";
import { StrictMode } from "preact/compat";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);

reportWebVitals(sendToVercelAnalytics);
