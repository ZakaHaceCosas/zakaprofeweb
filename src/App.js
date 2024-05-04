import React, { useState } from 'react';
import './App.css';
import Home from './utils/home.js';
import Estudia from './utils/estudia.js';
import Footer from './utils/foot.js';

function App() {
    const [currentPage, setCurrentPage] = useState('home');
    
    const changePage = (page) => {
        setCurrentPage(page);
    };

    return (
        <main className="App">
            <nav>
                <img src="https://zakaprofeweb.vercel.app/logohori.png" alt='Logotipo horizontal de ZakaProfe'/>
                <div className="urls">
                    <button onClick={() => changePage('home')} className='reactbuttonashref'>
                        Inicio
                    </button>
                    <button onClick={() => changePage('estudiamas')} className='reactbuttonashref'>
                        Estudiar más
                    </button>
                </div>
            </nav>
            { currentPage === 'home' && <Home></Home>}
            { currentPage === 'estudiamas' && <Estudia></Estudia>}
            <Footer />
        </main>
    );
}

export default App;
