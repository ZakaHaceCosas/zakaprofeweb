// parece ser que los genios detrás de Bun, con su gran ingenio y financiados por la IA de programación más lista del mundo
// llevan años sin pensar que 'bun update' debería actualizar las versiones de los catalogs
// parezco low level ahora, tengo que programar mis propias herramientas para que no duela usarlas

console.log(Bun.color("blue", "ansi"), "===> Actualización de dependencias globales");

const packageJsonFile = Bun.file("package.json");
const originalContent = await packageJsonFile.text();
const originalJson = JSON.parse(originalContent);

const catalogs = originalJson.workspaces.catalogs;

const tempPackageJson = {
    ...originalJson,
    dependencies: catalogs.dep,
    devDependencies: catalogs.dev,
};

await packageJsonFile.write(JSON.stringify(tempPackageJson, null, 4));

await Bun.$`bun update`;
console.log("Actualizado (1/2)");

const updatedJson = JSON.parse(await packageJsonFile.text());

const restored = {
    ...originalJson,
    workspaces: {
        ...originalJson.workspaces,
        catalogs: {
            dev: updatedJson.devDependencies,
            dep: updatedJson.dependencies,
        },
    },
};

await packageJsonFile.write(JSON.stringify(restored, null, 4));

await Bun.$`bun update`;
console.log("Actualizado (2/2)");

await Bun.$`bun run format`;

console.log(
    Bun.color("lightgreen", "ansi"),
    "¡OK! Actualización de dependencias globales",
    Bun.color("white", "ansi")
);

export {};
