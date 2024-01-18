import React, { useState, useEffect } from 'react';

const OcuFeed = () => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('./content.json');
        const data = await response.json();
        setDatos(data);
      } catch (error) {
        console.error('Error al acceder a content.json:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="feed">
      {datos.map((entrada, index) => (
        <div className="vidprev" key={index}>
          <img src={entrada.miniatura} alt={`Miniatura ${index}`} />
          <h3>{entrada.titulo}</h3>
          <p>{entrada.descripcion}</p>
          <div className="vidflex">
            <p className="tag">{entrada.asig}</p>
            <p className={`tag ${entrada.dificult}`}>{entrada.dificult_str}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OcuFeed;
