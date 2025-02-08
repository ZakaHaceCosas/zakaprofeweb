import React, { useState, useEffect } from "react";
import ExternalLink from "./ext-link";

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
                <div className={`bola ${statusClass}`}></div>
                <h2 className={`non-bold-header ${statusClass}`}>
                    {status} · {currentSpanishTime}{" "}
                    <span style={{ fontSize: "medium" }}>(UTC+1)</span>
                </h2>
            </div>
            <p>{statusText}</p>
            <hr />
            <ExternalLink url={"https://instagram.com/zhc.zakaprofe/"}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24px"
                    height="24px"
                >
                    <path d="M 8 3 C 5.243 3 3 5.243 3 8 L 3 16 C 3 18.757 5.243 21 8 21 L 16 21 C 18.757 21 21 18.757 21 16 L 21 8 C 21 5.243 18.757 3 16 3 L 8 3 z M 8 5 L 16 5 C 17.654 5 19 6.346 19 8 L 19 16 C 19 17.654 17.654 19 16 19 L 8 19 C 6.346 19 5 17.654 5 16 L 5 8 C 5 6.346 6.346 5 8 5 z M 17 6 A 1 1 0 0 0 16 7 A 1 1 0 0 0 17 8 A 1 1 0 0 0 18 7 A 1 1 0 0 0 17 6 z M 12 7 C 9.243 7 7 9.243 7 12 C 7 14.757 9.243 17 12 17 C 14.757 17 17 14.757 17 12 C 17 9.243 14.757 7 12 7 z M 12 9 C 13.654 9 15 10.346 15 12 C 15 13.654 13.654 15 12 15 C 10.346 15 9 13.654 9 12 C 9 10.346 10.346 9 12 9 z" />
                </svg>
                Instagram
            </ExternalLink>
        </div>
    );
}
