import { version } from "../../package.json";

export default function Footer() {
    return (
        <footer>
            <p>
                &copy; ZakaProfe 2024. Todos los elementos de marca y otros diseños de "ZakaProfe"
                son propiedad intelectual. Aplican derechos de autor.
                <br />
                <b>ZakaProfe Web {version}</b>
            </p>
        </footer>
    );
}
