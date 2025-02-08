import * as React from "react";
import "../App.css";

export default function Lost() {
    return (
        <div
            style={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
            }}
        >
            <h1>404</h1>
            <p>
                La página solicitada, <code>{window.location.pathname}</code>, no se encontró.
                ¡Vaya!
            </p>
            <hr />
            <a href="/">Volver</a>
        </div>
    );
}
