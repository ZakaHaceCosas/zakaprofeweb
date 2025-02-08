// TODO - se cancela esta idea / this idea is cancelled
// TODO - pensar otra forma de ayudar a estudiar / think of another way to help study
import React, { useState } from "react";
import "../App.css";
import items from "../resources/videos";
import ExternalLink from "../utils/ext-link";

export default function Estudia() {
    const [searchEnabled, toggleSearch] = useState(false);

    const genKey = (str) => {
        return str.toLowerCase().trim().normalize("NFC");
    };

    return (
        <section className="main-body">
            {searchEnabled && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-top">
                            <h3 className="non-bold-header">Lista de documentos</h3>
                            <button
                                className="react-button-as-href"
                                onClick={() => {
                                    toggleSearch(false);
                                }}
                            >
                                <b>X</b>
                            </button>
                        </div>
                        <hr />
                        {items.map((item) => (
                            <div className="item" key={genKey(item.title)}>
                                <h2 style={{ fontWeight: 300 }}>{item.title}</h2>
                                <p>
                                    {item.topic} · {item.level}
                                </p>
                                <hr />
                                <div className="item-flex">
                                    {typeof item.pdfPro === "string" ? (
                                        <ExternalLink url={item.pdfPro}>PDF dinámico</ExternalLink>
                                    ) : (
                                        <p>PDF dinámico no disponible</p>
                                    )}
                                    <p className="item-flex-dot">·</p>
                                    {typeof item.pdfNah === "string" ? (
                                        <ExternalLink url={item.pdfNah}>PDF mínimo</ExternalLink>
                                    ) : (
                                        <p>PDF mínimo no disponible</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <h1 className="big-header">
                PONTE A ESTUDIAR &gt;&gt;&gt;
                <br />
                <span style={{ fontWeight: 300 }}>(Tranquilo, que te ayudo)</span>
            </h1>
            <div className="bg-grad">
                <div className="flex-container flex-container-maxed">
                    <h2 className="non-bold-header">¿No eres de videos? ¿Prefieres leer?</h2>
                    <p>
                        Pronto los videos vendrán con un PDF completo, con la explicación paso a
                        paso y ejercicios prácticos.
                        {/* Tienen dos versiones, una "dinámica" (más visual) y una versión mínima
                            en blanco y negro para imprimir en hojas DIN A4. */}
                    </p>
                    <button className="btn btn-disabled" onClick={() => {}}>
                        Ver todos <b>(No disponible todavía)</b>
                    </button>
                </div>
            </div>
        </section>
    );
}
