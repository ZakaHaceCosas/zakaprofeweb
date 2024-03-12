import React from 'react';
import RandomVideoFeed from './utils/randomvids.js';
import Zakavailable from './utils/zakavailable.js';
import './App.css';

function App() {
  return (
    <main className="App">
      <img src="./colors.png" id="bgcolors" alt="Colores" />
      <section className="side1">
        <h1>VIDEOS</h1>
        <div className="bggrad">
        <div className="flexcont">
          <h3>ZakaProfe en YouTube</h3>
          <RandomVideoFeed/>
          <a href="https://youtube.com/@ZakaProfe" target="_blank">
            <h3>Ver más (hay muchos más)</h3>
          </a>
        </div>
        </div>
      </section>
      <section id="main">
        <img id="zplogo" src="./logodetails.png" alt="Logotipo de ZakaProfe" />
      </section>
      <section className="side2">
          <h1>CONTACTO</h1>
          <div className="flexcont">
            <Zakavailable />
          </div>
      </section>
    </main>
  );
}

export default App;
