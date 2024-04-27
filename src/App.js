import React from 'react';
import RandomVideoFeed from './utils/randomvids.js';
import Zakavailable from './utils/zakavailable.js';
import './App.css';

function App() {
  return (
    <main className="App">
      <img src="./colors.png" id="bgcolors" alt="Colores" />
      <section className="side1">
        <h1>VIDEOS &gt;&gt;&gt;</h1>
        <div className="bggrad">
        <div className="flexcont">
          <div className="flexcont2">
            <h2 className="nonboldh">ZakaProfe en YouTube</h2>
            <RandomVideoFeed/>
            <a href="https://youtube.com/@ZakaProfe" target="_blank">
              <p>Ver más (hay muchos más)</p>
            </a>
          </div>
        </div>
        </div>
      </section>
      <section id="main">
        <img id="zplogo" src="./logobig.png" alt="Logotipo de ZakaProfe" />
      </section>
      {/*
      <section className="side2">
          <h1>&lt;&lt;&lt; CONTACTO</h1>
          <div className="bggrad">
          <div className="flexcont">
            <Zakavailable />
          </div>
          </div>
      </section>
      */}
    </main>
  );
}

export default App;
