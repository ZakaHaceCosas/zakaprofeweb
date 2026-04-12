import * as Bun from "bun";
import { $ } from "bun";

console.log(Bun.color("blue", "ansi"), "===> ZPW INIT");

const ws = Bun.argv[2];

if (!["profe", "teka"].includes(ws)) {
    console.error(Bun.color("#ff3232", "ansi"), "Esa no es una web conocida:", ws);
    process.exit(1);
}

const RT = `apps/${ws}`;

await $`cd ${RT} && bun dev`;

console.log(Bun.color("lightgreen", "ansi"), "¡OK! ZPW INIT", Bun.color("white", "ansi"));
