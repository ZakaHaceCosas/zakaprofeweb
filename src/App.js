import React from 'react';
import RandomVideoFeed from './utils/randomvids.js';
import './App.css';
import Navigation from './utils/nav.js';
import Footer from './utils/foot.js';

function App() {
    return (
        <main className="App">
            <Navigation></Navigation>
            <section className="hero">
                <section className="side1">
                    <h1 className="bigh">VIDEOS &gt;&gt;&gt;</h1>
                    <div className="bggrad">
                        <div className="flexcont">
                            <div className="flexcont2">
                                <h2 className="nonboldh">ZakaProfe en YouTube</h2>
                                <RandomVideoFeed/>
                                <a href="https://youtube.com/@ZakaProfe" target="_blank" rel='noopener noreferrer'>
                                    Ver más en YouTube
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="main">
                    <img id="zplogo" src="./logo512.png" alt="Logotipo de ZakaProfe" />
                </section>
            </section>
            <Footer />
        </main>
    );
}

export default App;
