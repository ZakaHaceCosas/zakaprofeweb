import React, { useState } from 'react';
import '../App.css';
import items from '../resources/videos';

function Estudia() {
    const [modalEnabled, setModalEnabled] = useState(false);

    const searchpdfs = () => {
        setModalEnabled(true);
    };

    const exitsearch = () => {
        setModalEnabled(false);
    };

    return (
        <section className="bodo">
                {modalEnabled && (
                    <div className="modal">
                        <div className="modal-content">
                            <div className="modal-top">
                                <h3 className='nonboldh'>Lista de documentos</h3>
                                <button className='reactbuttonashref' onClick={exitsearch}>
                                    <b>X</b>
                                </button>
                            </div>
                            <hr />
                            { items.map(item => (
                                <div className="item" key={item.id}>
                                    <h2 style={{ fontWeight: 300 }}>{item.title}</h2>
                                    <p>{item.asig} · {item.curso}</p>
                                    <hr />
                                    <div className="itemflex">
                                        {typeof item.pdfpro === 'string' ? (
                                            <a href={item.pdfpro} rel='noopener noreferrer' target='_blank'>
                                                PDF dinámico
                                            </a>
                                        ) : (
                                            <p>PDF dinámico no disponible</p>
                                        )}
                                        <p className='itemflexdot'>·</p>
                                        {typeof item.pdfnah === 'string' ? (
                                            <a href={item.pdfnah} rel='noopener noreferrer' target='_blank'>
                                                PDF mínimo
                                            </a>
                                        ) : (
                                            <p>PDF mínimo no disponible</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <h1 className="bigh">PONTE A ESTUDIAR &gt;&gt;&gt;<br/><span style={{fontWeight: 300}}>(Tranquilo, que te ayudo)</span></h1>
                <div className="bggrad">
                    <div className="flexcont flexcontmaxed">
                        <div className="flexcont2">
                            <h2 className="nonboldh">¿No eres de videos? ¿Prefieres leer?</h2>
                            <p>Ahora los videos vienen con un PDF completo, con la explicación paso a paso y ejercicios prácticos. Tienen dos versiones, una "dinámica" (más visual) y una versión mínima en blanco y negro para imprimir en hojas DIN A4.</p>
                            <button className='boton' onClick={() => searchpdfs()}>
                                Ver todos
                            </button>
                        </div>
                    </div>
                </div>
        </section>
    )
}

export default Estudia;