import React, { useState, useEffect } from 'react';

function Zakavailable() {
  const [status, setStatus] = useState('');
  const [statusp, setStatusp] = useState('');
  const [statusClass, setStatusClass] = useState('');

  useEffect(() => {
    const getTimeStatus = () => {
      const now = new Date();
      const hour = now.getUTCHours() + 1;
      let newStatus = '';
      let newStatusp = '';
      let newStatusClass = '';

      if (hour >= 13 && hour < 21) {
        newStatus = 'DISPONIBLE';
        newStatusp = 'Si tienes cualquier duda, pregunta que te responderé.';
        newStatusClass = 'disponible';
      } else if (hour >= 21 && hour < 22) {
        newStatus = 'MAS O MENOS';
        newStatusp = 'Si tienes cualquier duda, pregunta que te responderé (igual tardo un poco)';
        newStatusClass = 'maomeno';
      } else if (hour >= 9 && hour < 13) {
        newStatus = 'EN CLASE';
        newStatusp = 'Estoy en clase.';
        newStatusClass = 'ocupado';
      } else {
        newStatus = 'OCUPADO';
        newStatusp = 'Esto... soy humano, tengo que dormir XD.';
        newStatusClass = 'ocupado';
      }

      setStatus(newStatus);
      setStatusp(newStatusp);
      setStatusClass(newStatusClass);
    };

    const interval = setInterval(getTimeStatus, 60000); // actualiza cada 60 segundos
    getTimeStatus();
    return () => clearInterval(interval);
  }, []);

  return (
      <>
      <div className="rowy">
        <div className="oneside">
          <div className={`bola ${statusClass}`}></div>
          <h2 className={`nonboldh ${statusClass}`}>{status}</h2>
        </div>
        <p>
          {statusp}
        </p>
      </div>
      <div className="rowy">
        <div className="oneside">
          <h2 className={`hora ${statusClass}`}>{hour}</h2>
        </div>
        <p>
          Trato de responder siempre lo antes que puedo.
        </p>
      </div>
      </>
  );
}

export default Zakavailable;
