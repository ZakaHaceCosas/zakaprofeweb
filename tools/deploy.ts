import { $ } from "bun";
import * as Bun from "bun";

console.log(Bun.color("blue", "ansi"), "===> ZPW DEPLOY");

const ws = Bun.argv[2];

if (!["profe", "teka"].includes(ws)) {
    console.error(Bun.color("#ff3232", "ansi"), "Esa no es una web conocida:", ws);
    process.exit(1);
}

const RT = `apps/${ws}`;

const prod = confirm("¿Te atreves a ir a prod?");

console.log(
    Bun.color("lightgreen", "ansi"),
    prod ? "¡Vamos allá!" : "Veamos si funciona esto.",
    Bun.color("white", "ansi")
);

await $`cd ${RT} && bun vercel ${prod ? "--prod" : ""}`;

console.log(Bun.color("lightgreen", "ansi"), "¡OK! ZPW INIT", Bun.color("white", "ansi"));
