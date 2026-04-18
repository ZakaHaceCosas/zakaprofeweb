// renombrado a .ts para evitar que se ejecute ahora, que no estoy trabajando en ello
// quitar .ts dejando .zpwapp para que se use
import type { Param } from "@zpw/types/types";
function zpw_input<T>(n: 1 | 0 = 0) {
    return "" as any as T;
}
const values: Record<string, string> = {};
type MDef = { title: string; desc: string[]; calc: string; calcLite: string };
type IDef = (Param | Param[])[];
/*S*/
// TODO
// definir el formato
// hacer la app en sí, lol
const pairs = zpw_input<[number, number][]>();
const test = zpw_input<string>(1);

let i = 0;
const avg = 1.93;

const w: "DM" | "Varian" = "Varian" as "DM" | "Varian";

function method() {
    values.pairs.forEach((p) => {
        const a = w == "DM" ? Math.abs(p[0] - avg) : Math.pow(p[0] - avg, 2);
        i += a * p[1];
    });

    i = i / 74;
    console.log(i);
    if (w == "Varian") console.log(Math.sqrt(i));
}
/*_*/
const Q: IDef = [
    {
        type: "text",
        title: "test de ZPWAPP code-gen",
        key: "foo",
        req: true,
    },
];
const M: MDef = {
    title: "Calculadora para estadística",
    desc: [
        "Calculadora completa para estudios estadísticos unidimensionales o bidimensionales.",
        "Una calculadora que, recibiendo datos de un estudio estadístico, genera todas las tablas, parámetros y gráficas que pudieras necesitar.",
    ],
    calc: "Analizar",
    calcLite: "Computar los datos proveídos y hacer todo el trabajo.",
};
