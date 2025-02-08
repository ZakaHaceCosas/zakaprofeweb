import React, { useState, useEffect } from "react";

export default function ZakAvailable() {
    const [status, setStatus] = useState("");
    const [statusText, setStatusText] = useState("");
    const [statusClass, setStatusClass] = useState("");
    const [currentSpanishTime, setSpanishTime] = useState("");

    useEffect(() => {
        const getTimeStatus = () => {
            const now = new Date();
            const day = now.getUTCDay();
            const hour = now.getUTCHours() + 1;
            const minutes = now.getUTCMinutes();
            const fmt = (s) => s.toString().padStart(2, "0");
            const formattedTime = `${fmt(hour)}:${fmt(minutes)}:${fmt(now.getUTCSeconds())}`;
            setSpanishTime(formattedTime);
            let newStatus = "";
            let newStatusText = "";
            let newStatusClass = "";

            // LUN-VIE
            if (day >= 1 && day <= 5) {
                if (hour >= 8 && hour < 16) {
                    // 8-15: OCUPADO (clase)
                    newStatus = "OCUPADO";
                    newStatusText = "Estoy en clase.";
                    newStatusClass = "ocupado";
                } else if (hour >= 16 && hour <= 21) {
                    // 16-21: DISPONIBLE
                    newStatus = "DISPONIBLE";
                    newStatusText = "Si tienes cualquier duda, pregunta que te responderé.";
                    newStatusClass = "disponible";
                } else if (hour > 21 && hour <= 23) {
                    // 21-23: MAS O MENOS
                    newStatus = "MAS O MENOS";
                    newStatusText =
                        "Si tienes cualquier duda, pregunta que te responderé (igual tardo un poco)";
                    newStatusClass = "mas-o-menos";
                } else {
                    // 24-8: OCUPADO (dormir)
                    newStatus = "OCUPADO";
                    newStatusText = "Esto... soy humano, tengo que dormir XD.";
                    newStatusClass = "ocupado";
                }
            }

            // SAB, DOM
            else if (day === 0 || day === 6) {
                if (hour >= 10 && hour <= 21) {
                    // 10-21: DISPONIBLE
                    newStatus = "DISPONIBLE";
                    newStatusText = "Si tienes cualquier duda, pregunta que te responderé.";
                    newStatusClass = "disponible";
                } else if (hour > 21 && hour <= 23) {
                    // 21-24: MAS O MENOS
                    newStatus = "MAS O MENOS";
                    newStatusText =
                        "Si tienes cualquier duda, pregunta que te responderé (igual tardo un poco)";
                    newStatusClass = "mas-o-menos";
                } else {
                    // 24-10: OCUPADO (dormir)
                    newStatus = "OCUPADO";
                    newStatusText = "Esto... soy humano, tengo que dormir XD.";
                    newStatusClass = "ocupado";
                }
            }

            setStatus(newStatus);
            setStatusText(newStatusText);
            setStatusClass(newStatusClass);
        };

        const interval = setInterval(getTimeStatus, 1000); // actualiza cada 60 segundos
        getTimeStatus();
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex-container">
            <div className="row-ish">
                <div className="one-side">
                    <div className={`bola ${statusClass}`}></div>
                    <h2 className={`non-bold-header ${statusClass}`}>
                        {status} · {currentSpanishTime}{" "}
                        <span style={{ fontSize: "medium" }}>(UTC+1)</span>
                    </h2>
                </div>
            </div>
            <div className="row-ish">
                <div className="one-side">
                    <p style={{ textAlign: "start" }}>{statusText}</p>
                </div>
            </div>
        </div>
    );
}
