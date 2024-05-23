import * as React from 'react';
import '../App.css';

function Lost() {
    return (
        <div style={{ height: "100vh", width: "100vw", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 10}}>
            <h1>404</h1>
            <p>La <code>/URL</code> especificada no se encontró.</p>
            <hr />
            <a href='https://zakaprofeweb.vercel.app/' rel='noopener noreferrer'>Volver</a>
        </div>
    )
}

export default Lost;