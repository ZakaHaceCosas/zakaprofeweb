import React from 'react';
import Logo from './utils/Logo.js';
import OcuFeed from './utils/OcuFeed.js';
import CesOcuFeed from './utils/CesOcuFeed.js';
import './App.css';

function App() {
  return (
    <main className="App">
      <header className="header">
        <Logo></Logo>
        <h1>ZakaProfe</h1>
      </header>
      <section>
        <h2>Videos</h2>
        <OcuFeed>
        </OcuFeed>
      </section>
      <section>
        <h2>CES name</h2>
        <CesOcuFeed ces='ega'>
        </CesOcuFeed>
      </section>
      <section className="comingsoon">
        <h2>Herramientas</h2>
        <p>Coming soon...</p>
      </section>
    </main>
  );
}

export default App;
