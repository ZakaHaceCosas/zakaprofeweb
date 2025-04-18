import { version } from "../../package.json";

export default function Footer() {
    return (
        <footer>
            <p
                onClick={() =>
                    alert(
                        `\u00A9 ZakaProfe 2024.\n\nTodos los elementos de  marca y otros diseños de \"ZakaProfe\" son propiedad intelectual. Aplican derechos de autor, queda prohibida la reutilización, modificación, o redistribución de estos y otros materiales asociados sin autorización expresa.`,
                    )
                }
            >
                <b>ZakaProfe Web {version}</b> <u>Aviso de derechos de autor.</u>
            </p>
        </footer>
    );
}
