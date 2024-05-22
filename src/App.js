import React, { useState } from 'react';
import './App.css';
import Home from './utils/home.js';
import Estudia from './utils/estudia.js';
import Footer from './utils/foot.js';

function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [theme, setTheme] = useState(() => {
        const savedTheme = document.cookie.split('; ').find(row => row.startsWith('theme='));
        return savedTheme ? savedTheme.split('=')[1] : 'light';
    });

    React.useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.style.setProperty('--ng1', '#0F0F0F');
            root.style.setProperty('--ng2', '#1F1F1F');
            root.style.setProperty('--txt', '#FFFFFF');
            root.style.setProperty('--blk', '#000000');
            root.style.setProperty('--grey', '#999999');
            root.style.setProperty('--fff25', '#FFFFFF25');
            root.style.setProperty('--00080', '#00000080');
            root.style.setProperty('--000a5', '#000000A5');
        } else {
            root.style.setProperty('--ng1', '#F0F0F0');
            root.style.setProperty('--ng2', '#FEFEFE');
            root.style.setProperty('--txt', '#000000');
            root.style.setProperty('--blk', '#FFFFFF');
            root.style.setProperty('--grey', '#999999');
            root.style.setProperty('--fff25', '#00000025');
            root.style.setProperty('--00080', '#FFFFFF80');
            root.style.setProperty('--000a5', '#FFFFFFA5');
        }

        document.cookie = `theme=${theme}; path=/; max-age=31536000`;
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

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
                    <button onClick={() => toggleTheme()} className='reactbuttonashref'>
                        Cambiar tema
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
