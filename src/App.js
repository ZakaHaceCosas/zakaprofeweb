import * as React from "react";
import "./App.css";
import Home from "./utils/home.js";
import Estudia from "./utils/estudia.js";
import Lost from "./utils/lost.js";
import Footer from "./utils/foot.js";

function App() {
    const getInitialPage = () => {
        const path = window.location.pathname.substring(1);
        return path || "home";
    };

    const getPageFromUrl = () => {
        const path = window.location.pathname.substring(1);
        return path || "home";
    };

    const [currentPage, setCurrentPage] = React.useState(getInitialPage());

    React.useEffect(() => {
        const handlePopState = () => {
            setCurrentPage(getPageFromUrl());
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    React.useEffect(() => {
        if (currentPage) {
            window.history.pushState(null, "", `/${currentPage}`);
        }
    }, [currentPage]);

    const changePage = (page) => {
        setCurrentPage(page);
    };

    const [theme, setTheme] = React.useState(() => {
        const savedTheme = document.cookie
            .split("; ")
            .find((row) => row.startsWith("theme="));
        return savedTheme ? savedTheme.split("=")[1] : "light";
    });

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    };

    // Intenté hacer que mostrara el logo blanco o el negro según el tema, pero no hay manera XD
    //let imagesrc = React.useRef(null);
    React.useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.style.setProperty("--ng1", "#0F0F0F");
            root.style.setProperty("--ng2", "#1F1F1F");
            root.style.setProperty("--txt", "#FFFFFF");
            root.style.setProperty("--blk", "#000000");
            root.style.setProperty("--blksha", "#000000");
            root.style.setProperty("--grey", "#999999");
            root.style.setProperty("--fff25", "#FFFFFF25");
            root.style.setProperty("--00080", "#00000080");
            root.style.setProperty("--000a5", "#000000A5");
            root.style.setProperty("--overlay", "#00000099");
            //imagesrc.current = "logohoridark.png";
        } else {
            root.style.setProperty("--ng1", "#F0F0F0");
            root.style.setProperty("--ng2", "#FEFEFE");
            root.style.setProperty("--txt", "#000000");
            root.style.setProperty("--blk", "#FFFFFF");
            root.style.setProperty("--blksha", "#00000010");
            root.style.setProperty("--grey", "#999999");
            root.style.setProperty("--fff25", "#00000025");
            root.style.setProperty("--00080", "#FFFFFF80");
            root.style.setProperty("--000a5", "#FFFFFFA5");
            root.style.setProperty("--overlay", "#00000099");
            //imagesrc.current = "logohori.png";
        }

        document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
    }, [theme]);

    return (
        <main className="App">
            <nav>
                <img
                    src="logohori.png"
                    alt="Logotipo de ZakaProfe"
                    id="zplogonav"
                />
                <div className="urls">
                    <button
                        onClick={() => changePage("home")}
                        className="reactbuttonashref"
                    >
                        Inicio
                    </button>
                    <button
                        onClick={() => changePage("estudiamas")}
                        className="reactbuttonashref"
                    >
                        Estudiar más
                    </button>
                    <button
                        onClick={() => toggleTheme()}
                        className="reactbuttonashref kindauseless"
                    >
                        Cambiar tema
                    </button>
                </div>
            </nav>
            {currentPage === "home" && <Home />}
            {currentPage === "estudiamas" && <Estudia />}
            {currentPage !== "estudiamas" && currentPage !== "home" && <Lost />}
            <Footer />
        </main>
    );
}

export default App;
