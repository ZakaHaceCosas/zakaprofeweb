import * as React from "react";
import "./App.css";
import Home from "./utils/home.js";
import Estudia from "./utils/estudia.js";
import Lost from "./utils/lost.js";
import Footer from "./utils/foot.js";

export default function App() {
    const getPage = () => {
        const path = window.location.pathname.substring(1);
        return path || "home";
    };

    const [currentPage, setCurrentPage] = React.useState(getPage());

    React.useEffect(() => {
        const handlePopState = () => {
            setCurrentPage(getPage());
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

    const [theme, setTheme] = React.useState(() => {
        const savedTheme = document.cookie.split("; ").find((row) => row.startsWith("theme="));
        return savedTheme ? savedTheme.split("=")[1] : "light";
    });

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    };

    // Intenté hacer que mostrara el logo blanco o el negro según el tema, pero no hay manera XD
    // let imageSrc = React.useRef(null);
    React.useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.style.setProperty("--ng1", "#0F0F0F");
            root.style.setProperty("--ng2", "#1F1F1F");
            root.style.setProperty("--txt", "#FFFFFF");
            root.style.setProperty("--blk", "#000000");
            root.style.setProperty("--blkSha", "#000000");
            root.style.setProperty("--grey", "#999999");
            root.style.setProperty("--fff25", "#FFFFFF25");
            root.style.setProperty("--modal-bg", "#00000080");
            root.style.setProperty("--overlay", "#00000099");
        } else {
            root.style.setProperty("--ng1", "#F0F0F0");
            root.style.setProperty("--ng2", "#FEFEFE");
            root.style.setProperty("--txt", "#000000");
            root.style.setProperty("--blk", "#FFFFFF");
            root.style.setProperty("--blkSha", "#00000010");
            root.style.setProperty("--grey", "#999999");
            root.style.setProperty("--fff25", "#00000025");
            root.style.setProperty("--modal-bg", "#FFFFFF80");
            root.style.setProperty("--overlay", "#000000AA");
        }

        document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
    }, [theme]);

    return (
        <main className="App">
            <nav>
                <img src="logo-horizon.png" alt="Logotipo de ZakaProfe" id="zp-logo-nav" />
                <div className="urls">
                    {/* <button onClick={() => setCurrentPage("home")} className="react-button-as-href">
                        Inicio
                    </button>
                    <button onClick={() => changePage("estudia")} className="react-button-as-href">
                        Estudiar más
                    </button> */}
                    <button onClick={() => toggleTheme()} className="react-button-as-href">
                        Cambiar tema
                    </button>
                </div>
            </nav>
            {currentPage.trim().toLowerCase() === "home" && <Home />}
            {currentPage.trim().toLowerCase() === "estudia" && <Estudia />}
            {!["home", "estudia"].includes(currentPage.trim().toLowerCase()) && <Lost />}
            <Footer />
        </main>
    );
}
