import React, { useState } from 'react';
import '../App.css';

function Estudia() {
    const [modalEnabled, setModalEnabled] = useState(false);

    // eslint-disable-next-line
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
                            <h2 className='nonboldh'>Buscador de PDFs</h2>
                            <button className='boton' onClick={exitsearch}>Cerrar buscador</button>
                        </div>
                    </div>
                )}
                <h1 className="bigh">PONTE A ESTUDIAR &gt;&gt;&gt;<br></br><span style={{fontWeight: 300}}>(Tranquilo, que te ayudo)</span></h1>
                <div className="bggrad">
                    <div className="flexcont flexcontmaxed">
                        <div className="flexcont2">
                            <h2 className="nonboldh">¿No eres de videos? ¿Prefieres estudiar leyendo?</h2>
                            <p>Dentro de poco, todos los videos tendrán un documento hecho por mi, explicando de forma detallada y fácil de entender todos los puntos, y con ejercicios para practicar. Los tendrás tanto a versión con colorines como a versión para imprimir (tamaño DIN A4).</p>
                            {/*onClick={() => searchpdfs()}*/}
                            <button className='boton deshabi'>
                                Buscador de PDFs (¡Pronto disponible!)
                            </button>
                        </div>
                    </div>
                </div>
        </section>
    )
}

export default Estudia;