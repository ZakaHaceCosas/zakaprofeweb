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
                    newStatusText = "Si tienes cualquier duda, pregunta y te responderé.";
                    newStatusClass = "disponible";
                } else if (hour > 21 && hour <= 23) {
                    // 21-23: MÁS O MENOS
                    newStatus = "MÁS O MENOS";
                    newStatusText =
                        "Si tienes cualquier duda, pregunta y te responderé (igual tardo un poco)";
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
                    newStatusText = "Si tienes cualquier duda, pregunta y te responderé.";
                    newStatusClass = "disponible";
                } else if (hour > 21 && hour <= 23) {
                    // 21-24: MÁS O MENOS
                    newStatus = "MÁS O MENOS";
                    newStatusText =
                        "Si tienes cualquier duda, pregunta y te responderé (igual tardo un poco)";
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

        const interval = setInterval(getTimeStatus, 1000); // actualiza cada segundo
        getTimeStatus();
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex-container">
            <p>
                Puedes preguntarme tus dudas por un mensaje de Instagram cuando quieras.
                <br /> <br />
                Responderé cuando pueda; aquí tienes un "horario de referencia", por si te sirve.
            </p>
            <div className="row-ish">
                <div className={`bola ${statusClass}`}></div>
                <h2 className={`non-bold-header ${statusClass}`}>
                    {status} · {currentSpanishTime}{" "}
                    <span style={{ fontSize: "medium", fontWeight: 600 }}>(UTC+1)</span>
                </h2>
            </div>
            <hr />
            <p>
                <i>{statusText}</i>
            </p>
            <hr />
            <div className="row-ish">
                <ExternalLink url={"https://instagram.com/zhc.zakaprofe/"}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24px"
                        height="24px"
                    >
                        <path d="M 8 3 C 5.243 3 3 5.243 3 8 L 3 16 C 3 18.757 5.243 21 8 21 L 16 21 C 18.757 21 21 18.757 21 16 L 21 8 C 21 5.243 18.757 3 16 3 L 8 3 z M 8 5 L 16 5 C 17.654 5 19 6.346 19 8 L 19 16 C 19 17.654 17.654 19 16 19 L 8 19 C 6.346 19 5 17.654 5 16 L 5 8 C 5 6.346 6.346 5 8 5 z M 17 6 A 1 1 0 0 0 16 7 A 1 1 0 0 0 17 8 A 1 1 0 0 0 18 7 A 1 1 0 0 0 17 6 z M 12 7 C 9.243 7 7 9.243 7 12 C 7 14.757 9.243 17 12 17 C 14.757 17 17 14.757 17 12 C 17 9.243 14.757 7 12 7 z M 12 9 C 13.654 9 15 10.346 15 12 C 15 13.654 13.654 15 12 15 C 10.346 15 9 13.654 9 12 C 9 10.346 10.346 9 12 9 z" />
                    </svg>
                    Ir a Instagram &gt;
                </ExternalLink>
                <ExternalLink url={"mailto:zakaprofe@proton.me"}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        version="1.1"
                        viewBox="0 0 512 512"
                    >
                        <path d="M510.678,112.275c-2.308-11.626-7.463-22.265-14.662-31.054c-1.518-1.915-3.104-3.63-4.823-5.345   c-12.755-12.818-30.657-20.814-50.214-20.814H71.021c-19.557,0-37.395,7.996-50.21,20.814c-1.715,1.715-3.301,3.43-4.823,5.345   C8.785,90.009,3.63,100.649,1.386,112.275C0.464,116.762,0,121.399,0,126.087V385.92c0,9.968,2.114,19.55,5.884,28.203   c3.497,8.26,8.653,15.734,14.926,22.001c1.59,1.586,3.169,3.044,4.892,4.494c12.286,10.175,28.145,16.32,45.319,16.32h369.958   c17.18,0,33.108-6.145,45.323-16.384c1.718-1.386,3.305-2.844,4.891-4.43c6.27-6.267,11.425-13.741,14.994-22.001v-0.064   c3.769-8.653,5.812-18.171,5.812-28.138V126.087C512,121.399,511.543,116.762,510.678,112.275z M46.509,101.571   c6.345-6.338,14.866-10.175,24.512-10.175h369.958c9.646,0,18.242,3.837,24.512,10.175c1.122,1.129,2.179,2.387,3.112,3.637   L274.696,274.203c-5.348,4.687-11.954,7.002-18.696,7.002c-6.674,0-13.276-2.315-18.695-7.002L43.472,105.136   C44.33,103.886,45.387,102.7,46.509,101.571z M36.334,385.92V142.735L176.658,265.15L36.405,387.435   C36.334,386.971,36.334,386.449,36.334,385.92z M440.979,420.597H71.021c-6.281,0-12.158-1.651-17.174-4.552l147.978-128.959   l13.815,12.018c11.561,10.046,26.028,15.134,40.36,15.134c14.406,0,28.872-5.088,40.432-15.134l13.808-12.018l147.92,128.959   C453.137,418.946,447.26,420.597,440.979,420.597z M475.666,385.92c0,0.529,0,1.051-0.068,1.515L335.346,265.221L475.666,142.8   V385.92z" />
                    </svg>
                    Correo-e &gt;
                </ExternalLink>
            </div>
        </div>
    );
}
