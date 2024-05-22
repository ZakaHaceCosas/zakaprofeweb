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
                                    X
                                </button>
                            </div>
                            <hr />
                            { items.map(item => (
                                <div className="item" key={item.id}>
                                    <h2 style={{ fontWeight: 300 }}>{item.title}</h2>
                                    <div className="itemflex">
                                        <p>{item.asig}</p>
                                        <p>·</p>
                                        {typeof item.pdfpro === 'string' ? (
                                            <a href={item.pdfpro} rel='noopener noreferrer' target='_blank'>
                                                PDF dinámico
                                            </a>
                                        ) : (
                                            <p>PDF dinámico pronto disponible</p>
                                        )}
                                        <p>·</p>
                                        {typeof item.pdfnah === 'string' ? (
                                            <a href={item.pdfnah} rel='noopener noreferrer' target='_blank'>
                                                PDF para imprimir
                                            </a>
                                        ) : (
                                            <p>PDF para imprimir pronto disponible</p>
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