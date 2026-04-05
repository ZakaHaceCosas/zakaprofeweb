<script lang="ts">
    import { onMount } from "svelte";
    import Button from "$lib/Button.svelte";
    import Textarea from "$lib/Textarea.svelte";
    import { isBetween } from "@zhc.js/number-utils";
    import { validateAgainst } from "@zhc.js/string-utils";

    type orClause = { or: [string, string]; basis: string };
    type expr = {
        utility: string;
        positionals: string[];
        switches: string[];
        prediction:
            | null
            | { err: string }
            | {
                  prints?: string | orClause;
                  action?: string;
                  clears?: true;
                  exits?: number;
                  /**
                   * 1 = help general
                   * string = help de ese comando
                   */
                  help?: 1 | string;
                  takes?: string;
                  /**
                   * 1er arg = query
                   *
                   * 2do arg:
                   * - 1 = busca lo que le viene del pipe
                   * - string = busca en ese archivo
                   */
                  finds?: [string, 1 | string];
                  dev?: string;
              };
    };
    type op = "|" | "||" | ">>" | ">" | "&&" | "&" | "2>" | "2>>" | "1>";
    let cmd = "";
    let val: null | (expr | op | { comment: string })[][] = null;

    const knownUtils: Record<string, string> = {
        cd: "Cambiar directorio",
        dir: "Listar contenido de un directorio",
        cls: "Limpiar la pantalla",
        copy: "Copiar archivos",
        xcopy: "Copiar archivos y directorios (avanzado)",
        robocopy: "Copia robusta de archivos/directorios",
        del: "Eliminar archivos",
        mkdir: "Crear directorio",
        md: "Crear directorio (alias de mkdir)",
        rmdir: "Eliminar directorio",
        rd: "Eliminar directorio (alias de rmdir)",
        move: "Mover archivos",
        rename: "Renombrar archivos",
        ren: "Renombrar archivos (alias de rename)",
        type: "Mostrar contenido de un archivo",
        echo: "Mostrar texto o activar/desactivar eco",
        set: "Mostrar o definir variables de entorno",
        path: "Mostrar o establecer variable PATH",
        pause: "Pausar ejecución",
        exit: "Salir de CMD",
        help: "Mostrar ayuda de comandos",
        assoc: "Mostrar o modificar asociaciones de archivos",
        attrib: "Cambiar atributos de archivos",
        chdir: "Cambiar directorio (alias de cd)",
        chkdsk: "Comprobar disco",
        color: "Cambiar colores de la consola",
        date: "Mostrar o cambiar fecha",
        time: "Mostrar o cambiar hora",
        hostname: "Mostrar nombre del equipo",
        ipconfig: "Mostrar configuración de red",
        ping: "Probar conectividad de red",
        tracert: "Rastrear ruta de red",
        netstat: "Mostrar conexiones de red",
        tasklist: "Listar procesos en ejecución",
        taskkill: "Finalizar procesos",
        shutdown: "Apagar o reiniciar el sistema",
        systeminfo: "Información del sistema",
        whoami: "Mostrar usuario actual",
        where: "Buscar ejecutables en PATH",
        find: "Buscar texto en archivos",
        findstr: "Buscar texto (más avanzado)",
        fc: "Comparar archivos",
        tree: "Mostrar estructura de directorios",
        call: "Llamar a otro script",
        start: "Abrir programa o ventana",
        title: "Cambiar título de la ventana",
        pushd: "Guardar y cambiar directorio",
        popd: "Restaurar directorio anterior",
    };

    onMount(() => {
        if (!window.location.search) return;

        const params = new URLSearchParams(window.location.search);
        cmd = params.get("cmd") ?? "";

        if (cmd !== "") parseCMDs();
    });

    /**
     * TODO: Esto NO es suficiente, porque puedes tener cosas entre paréntesis y demás. No puedes partir, hay que hacer un analizador en condiciones, cosa que tengo que aprender a hacer...
     * He hecho el 90% de este "parser" (el 10% es la IA haciendo esta función para soportar comillas y escapes), y me está hartando un poco. Ya veré cuando lo extraigo a su propio fichero y lo trabajo bien.
     * @param command
     */
    function splitCommand(command: string) {
        const operatorsRegex = /2>&1|2>>|2>|>>|&&|\|\||\||>|&/;

        const args: string[] = [];
        const operators: string[] = [];

        let current = "";
        let inQuotes = false;
        let escapeNext = false;

        for (let i = 0; i < command.length; i++) {
            const char = command[i];

            if (escapeNext) {
                current += char;
                escapeNext = false;
                continue;
            }

            if (char === "^") {
                escapeNext = true;
                continue;
            }

            if (char === '"') {
                inQuotes = !inQuotes;
                current += char;
                continue;
            }

            if (!inQuotes) {
                const rest = command.slice(i);

                const match = rest.match(operatorsRegex);
                if (match && match.index === 0) {
                    args.push(current);
                    operators.push(match[0]);
                    current = "";
                    i += match[0].length - 1;
                    continue;
                }
            }

            current += char;
        }

        if (escapeNext) current += "^";
        if (current) args.push(current);

        return { args, operators };
    }

    function parseCMDs() {
        val = null;
        history.replaceState(null, "", `?cmd=${encodeURIComponent(cmd)}`);
        cmd.trim()
            .split("\n")
            .map((s) => s.trim())
            .forEach((v) => {
                if (v == "") return;
                if (!val) val = [];
                if (v.startsWith("::"))
                    val.push([
                        {
                            comment: v.slice(2).trim(),
                        },
                    ]);
                else if (v.toLowerCase() == "@echo off") {
                    val.push([
                        {
                            positionals: [],
                            switches: [],
                            utility: "@echo off",
                            prediction: {
                                action: "Desactiva ECHO.",
                            },
                        },
                    ]);
                } else if (v.toLowerCase() == "@echo on") {
                    val.push([
                        {
                            positionals: [],
                            switches: [],
                            utility: "@echo on",
                            prediction: {
                                action: "Activa ECHO.",
                            },
                        },
                    ]);
                } else {
                    const c = parseCMD(v);
                    if (!c) return;
                    val.push(c);
                }
            });
    }

    function parseCMD(baseCmd: string): (expr | op)[] | null {
        try {
            const command = baseCmd.trim();
            if (command == "") return null;

            // hardcoding, sí señor
            // para el contenido la verdad es que estoy usando bastante a Claude
            // escribir el código mola (que eso lo he hecho yo eh), hacer listas con los comandos de MicroSlop W*ndows ya no
            // tendría que bajarme Cursor y poner a un agente a rellenar este y los demás objetos
            // es copiar y pegar la documentación de microsoft, no deberían alucinar mucho... ¿no?
            // TODO: hacer eso en otro momento
            const switchesWithArgs: Record<string, Set<string>> = {
                ping: new Set(["/n", "/l", "/w", "/i", "/f"]),
                dir: new Set(["/o", "/t"]),
                taskkill: new Set(["/pid", "/im", "/fi"]),
                findstr: new Set(["/c", "/f", "/g", "/d"]),
                shutdown: new Set(["/t", "/c", "/d"]),
                xcopy: new Set(["/d", "/exclude"]),
            };

            const { args, operators } = splitCommand(command);
            const preparation: (expr | op)[] = [];

            args.forEach((_, i) => {
                if (_ === "") {
                    if (operators[i]) preparation.push(operators[i] as op);
                    return;
                }
                // este regex no es mio
                const tokens = _.match(/"[^"]*"|\S+/g) ?? [];
                const utility = tokens[0]!.toLowerCase();
                const positionals: string[] = [];
                const switches: string[] = [];

                for (let j = 1; j < tokens.length; j++) {
                    const acceptsArg = switchesWithArgs[utility]?.has(tokens[j]) ?? false;
                    const next = tokens[j + 1];

                    if (tokens[j].startsWith("/")) {
                        if (acceptsArg && next !== undefined && !next.startsWith("/")) {
                            switches.push(`${tokens[j]} ${next}`);
                            j++;
                        } else {
                            switches.push(tokens[j]);
                        }
                    } else {
                        positionals.push(tokens[j]);
                    }
                }

                preparation.push(
                    predictExit({ utility, positionals, switches }, operators[i - 1] == "|")
                );
                if (operators[i]) preparation.push(operators[i] as op);
            });

            if (typeof preparation.at(-1) == "string") throw "Comando incompleto.";
            return preparation;
        } catch (e) {
            alert(e);
            return null; // TODO: devolver algo tipo {err: x} para mostrar en UI
        }
    }

    function tryCMDColor(code: string): [string] | [string, string] | null {
        if (!isBetween(code.length, 1, 2)) return null;
        code = code.toLowerCase();
        const colors: Record<string, string> = {
            "0": "Negro",
            "1": "Azul",
            "2": "Verde",
            "3": "Aqua",
            "4": "Rojo",
            "5": "Púrpura",
            "6": "Amarillo",
            "7": "Blanco",
            "8": "Gris",
            "9": "Azul claro",
            "a": "Verde claro",
            "b": "Aqua claro",
            "c": "Rojo claro",
            "d": "Púrpura claro",
            "e": "Amarillo claro",
            "f": "Blanco brillante",
        };
        const k = Object.keys(colors);
        if (!validateAgainst(code[0], k)) return null;
        if (code.length == 1) return [colors[code[0]]];
        if (!validateAgainst(code[1], k)) return null;
        return [colors[code[0]], colors[code[1]]];
    }

    function predictExit(expression: Omit<expr, "prediction">, wasPiped: boolean): expr {
        const { utility, positionals, switches } = expression;

        switch (utility) {
            case "echo": {
                if (positionals.length === 0)
                    return {
                        ...expression,
                        prediction: {
                            prints: {
                                or: ["ECHO is on.", "ECHO is off."],
                                basis: "Según si está activo o no",
                            },
                        },
                    };
                if (positionals[0].toLowerCase() === "on" || positionals[0].toLowerCase() === "off")
                    return {
                        ...expression,
                        prediction: {
                            action:
                                positionals[0].toLowerCase() === "on"
                                    ? "Habilita ECHO."
                                    : "Deshabilita ECHO.",
                        },
                    };
                return { ...expression, prediction: { prints: positionals.join(" ") } };
            }

            case "mkdir":
            case "md": {
                if (positionals.length === 0)
                    return {
                        ...expression,
                        prediction: {
                            err: "Falta un argumento, ¿qué directorio vas a crear?",
                        },
                    };
                return {
                    ...expression,
                    prediction: {
                        action: `Crea ${positionals.length == 1 ? "el directorio" : "los directorios"} ${positionals.join(" & ")}`,
                    },
                };
            }

            case "rmdir":
            case "rd": {
                if (positionals.length === 0)
                    return {
                        ...expression,
                        prediction: {
                            err: "Falta un argumento, ¿qué directorio vas a eliminar?",
                        },
                    };
                return {
                    ...expression,
                    prediction: {
                        action: `Elimina ${positionals.length == 1 ? "el directorio" : "los directorios"} ${positionals.join(" & ")}`,
                    },
                };
            }

            case "del":
            case "erase": {
                if (positionals.length === 0)
                    return {
                        ...expression,
                        prediction: {
                            err: "Falta un argumento, ¿qué vas a eliminar?",
                        },
                    };
                return {
                    ...expression,
                    prediction: {
                        action: `Elimina ${positionals.length == 1 ? "el fichero" : "los ficheros"} ${positionals.join(" & ")}`,
                    },
                };
            }

            case "copy": {
                if (positionals.length < 2)
                    return {
                        ...expression,
                        prediction: {
                            err: "Faltan argumentos. Deberías especificar qué copiar y a dónde.",
                        },
                    };
                return {
                    ...expression,
                    prediction: {
                        action: `Copia el fichero o directorio ${positionals[0]} a la ruta ${positionals[1]}`,
                    },
                };
            }

            case "ren":
            case "rename": {
                if (positionals.length < 2)
                    return {
                        ...expression,
                        prediction: {
                            err: "Faltan argumentos. Deberías especificar qué renombrar y a dónde.",
                        },
                    };
                return {
                    ...expression,
                    prediction: {
                        action: `Mueve (o, al uso, renombra) ${positionals[0]} a ${positionals[1]}`,
                    },
                };
            }

            case "cls": {
                return { ...expression, prediction: { clears: true } };
            }

            case "ver": {
                return {
                    ...expression,
                    prediction: {
                        prints: "Microsoft Windows [Version 10.0.x.x] (donde x y x cambian según tu versión de Windows)",
                    },
                };
            }

            case "exit": {
                const code = positionals[0] ?? "0";
                return {
                    ...expression,
                    prediction: { exits: parseInt(code) },
                };
            }

            case "date": {
                if (switches.includes("/t"))
                    return {
                        ...expression,
                        prediction: { prints: new Date().toLocaleDateString("en-US") },
                    };
                return {
                    ...expression,
                    prediction: {
                        prints: new Date().toLocaleDateString("en-US"),
                        takes: "Nueva fecha en formato mm-dd-yyyy para cambiar la fecha del sistema.",
                    },
                };
            }

            case "time": {
                if (switches.includes("/t"))
                    return {
                        ...expression,
                        prediction: {
                            prints: new Date().toLocaleTimeString("en-US", { hour12: false }),
                        },
                    };
                return {
                    ...expression,
                    prediction: {
                        prints: new Date().toLocaleTimeString("en-US", { hour12: false }),
                        takes: "Nueva hora en formato TODO para cambiar la fecha del sistema.",
                    },
                };
            }

            case "help": {
                if (positionals.length === 0)
                    return {
                        ...expression,
                        prediction: {
                            help: 1,
                        },
                    };
                return { ...expression, prediction: { help: positionals[0] } };
            }

            case "dir": {
                const target = positionals[0] ?? ".";
                const bare = switches.includes("/b");
                const wide = switches.includes("/w");
                const recursive = switches.includes("/s");

                const lastSegment = target.split(/[\\/]/).pop() ?? "";
                const hasGlob = lastSegment.includes("*") || lastSegment.includes("?");
                const dirPath = hasGlob
                    ? target.substring(0, target.length - lastSegment.length) || "."
                    : target;
                const pattern = hasGlob ? lastSegment : "*";

                let action = hasGlob
                    ? `Imprime (si existe "${dirPath}") los archivos que coincidan con "${pattern}"`
                    : `Imprime el contenido de "${dirPath}"`;

                if (recursive) action += `, incluyendo subdirectorios de forma recursiva`;
                if (bare) action += `. Formato: solo nombres de archivo, sin cabecera`;
                else if (wide) action += `. Formato: nombres en columnas anchas`;

                return { ...expression, prediction: { action } };
            }

            case "type": {
                if (positionals.length === 0)
                    return {
                        ...expression,
                        prediction: { err: "Falta un argumento. ¿Qué fichero quieres leer?" },
                    };
                return {
                    ...expression,
                    prediction: {
                        action: `Imprime el contenido del archivo "${positionals[0]}" como texto plano`,
                    },
                };
            }

            case "cd":
            case "chdir": {
                if (positionals.length === 0)
                    return {
                        ...expression,
                        prediction: {
                            // TODO: podemos implementar CWD a esto, pedimos que especifiquen el inicial y detectamos CHDIRs a lo largo de la secuencia
                            action: "Imprime la ruta del directorio de trabajo actual",
                        },
                    };
                return {
                    ...expression,
                    prediction: {
                        action: `Cambia el directorio de trabajo a "${positionals[0]}"`,
                    },
                };
            }

            case "set": {
                if (positionals.length === 0)
                    return {
                        ...expression,
                        prediction: {
                            action: "Imprime todas las variables de entorno de la sesión actual",
                        },
                    };
                if (positionals[0].includes("=")) {
                    const [name] = positionals[0].split("=");
                    return {
                        ...expression,
                        prediction: {
                            action: `Asigna un valor a la variable de entorno "${name}"`,
                        },
                    };
                }
                return {
                    ...expression,
                    prediction: {
                        action: `Imprime las variables de entorno cuyo nombre empieza por "${positionals[0]}"`,
                    },
                };
            }

            case "ping": {
                if (positionals.length === 0)
                    return {
                        ...expression,
                        prediction: {
                            err: "Falta un argumento. ¿A quién haces la petición?",
                        },
                    };
                const count = switches.find((s) => s.startsWith("/n"))?.split(" ")[1] ?? "4";
                const continuous = switches.includes("/t");
                return {
                    ...expression,
                    prediction: {
                        action: continuous
                            ? `Envía paquetes continuamente a "${positionals[0]}" hasta que se interrumpa`
                            : `Envía ${count} paquetes a "${positionals[0]}" e imprime estadísticas de latencia`,
                    },
                };
            }

            case "ipconfig": {
                if (switches.includes("/flushdns"))
                    return {
                        ...expression,
                        prediction: { action: "Vacía la caché DNS del sistema" },
                    };
                if (switches.includes("/release"))
                    return {
                        ...expression,
                        prediction: {
                            action: "Libera la dirección IP asignada por DHCP",
                        },
                    };
                if (switches.includes("/renew"))
                    return {
                        ...expression,
                        prediction: {
                            action: "Solicita una nueva dirección IP al servidor DHCP",
                        },
                    };

                return {
                    ...expression,
                    prediction: {
                        action: switches.includes("/all")
                            ? "Imprime la configuración completa de todos los adaptadores de red (IP, MAC, DNS, gateway…)"
                            : "Imprime un resumen de la configuración IP de todos los adaptadores de red",
                    },
                };
            }

            case "move": {
                if (positionals.length < 2)
                    return {
                        ...expression,
                        prediction: { err: "Falta un argumento. ¿Qué vas a mover?" },
                    };
                return {
                    ...expression,
                    prediction: {
                        action: `Mueve "${positionals[0]}" a "${positionals[1]}"${
                            positionals[0].includes("*")
                                ? " (todos los archivos que coincidan con el patrón)"
                                : ""
                        }`,
                    },
                };
            }

            case "title": {
                if (positionals.length == 0) {
                    return {
                        ...expression,
                        prediction: {
                            err: "Falta un argumento. ¿Qué titulo vas a darle a la ventana?",
                        },
                    };
                }
                return {
                    ...expression,
                    prediction: {
                        action: `Cambiará el título de la ventana de CMD a "${positionals.join(" ")}"`,
                    },
                };
            }

            case "color": {
                if (positionals.length == 0) {
                    return {
                        ...expression,
                        prediction: {
                            err: "Falta un argumento. ¿Qué color vas a darle a la ventana?",
                        },
                    };
                }
                const color = tryCMDColor(positionals[0]);
                if (!color)
                    return {
                        ...expression,
                        prediction: {
                            err: `El color especificado, ${positionals[0]}, no es válido.`,
                        },
                    };
                return {
                    ...expression,
                    prediction: {
                        action:
                            color.length == 2
                                ? `Cambiará el color de la ventana de CMD; el texto será ${color[0]} y el fondo ${color[1]}.`
                                : `Cambiará el color del texto a ${color[0]}.`,
                    },
                };
            }

            case "systeminfo": {
                return {
                    ...expression,
                    prediction: {
                        action: "Mostrará la información del sistema.",
                    },
                };
            }

            case "tree": {
                return {
                    ...expression,
                    prediction: {
                        action: positionals.length
                            ? `Mostrará el árbol de directorios de ${positionals[0]}`
                            : "Mostrará el árbol del directorio actual.",
                    },
                };
            }

            case "find": {
                if (positionals.length == 0)
                    return {
                        ...expression,
                        prediction: {
                            err: "Falta al menos un argumento. ¿Qué vas a buscar?",
                        },
                    };
                if (!wasPiped && positionals.length == 1)
                    return {
                        ...expression,
                        prediction: {
                            err: "Falta un argumento. ¿En qué fichero vas a buscar? Tampoco estás redirigiendo una salida a este comando.",
                        },
                    };
                return {
                    ...expression,
                    prediction: {
                        finds: [positionals[0], wasPiped ? 1 : positionals[1]],
                    },
                };
            }

            case "nul":
            case "con":
            case "prn": {
                return {
                    ...expression,
                    prediction: {
                        dev:
                            utility == "nul"
                                ? "Basura, equivale a /dev/null en Linux."
                                : utility == "con"
                                  ? "Consola. Útil para usar el comando COPY como un mini-editor de texto."
                                  : "Impresora. Esto existe por compatibilidad, no sé muy bien cómo se usa 😅",
                    },
                };
            }

            default:
                return { ...expression, prediction: null };
        }
    }

    function isStringToEvalEnvVariable(str: string) {
        return str.startsWith("%") && str.endsWith("%") && !str.includes(" ");
    }

    function formatStringToEvalEnvVariable(str: string, low: boolean = false) {
        return isStringToEvalEnvVariable(str)
            ? `${low ? "l" : "L"}a variable de entorno «${str.slice(1, -1)}»`
            : str;
    }

    function share() {
        navigator.clipboard.writeText(
            `https://profe.zhc.es/apps/windows-cmd-parser?cmd=${encodeURIComponent(cmd)}`
        );
    }
</script>

<svelte:head>
    <title>Analizador sintáctico CMD</title>
    <meta
        name="description"
        content="Analiza por tí una secuencia de comandos de Windows CMD y te la explica en detalle, además de predecir su salida."
    />
</svelte:head>

<h1>Analizador sintáctico de comandos Windows CMD</h1>
<br />
<p>
    Escribe una secuencia de CMD y la analizará por ti, prediciendo la salida.<br /><br /><b
        >Aún está en desarrollo y solo soporta un subset de comandos y funciones limitado.</b
    >
    Que se sepa, falta soporte para algunos comandos (PAUSE, NET, ICACLS ...) y para sintaxis de guiones
    (IF, paréntesis, ...).
    <br />Puede que falten predicciones o que no acierte del todo con el control de flujo. Sigo
    trabajando en ello y lo iré actualizando con el tiempo.
    <br />
</p>
<br />
<Textarea
    name="cmd"
    bind:value={cmd}
    oninput={(e) => (cmd = e.currentTarget.value)}
    onkeydown={(e) => {
        if (e.key !== "Enter") return;
        parseCMDs();
    }}
    title="Introduce una secuencia, como 'cd \Windows && tree > \Users\yo\tree.txt"
    required
    channel="ZakaTeka"
    tail="w-full! font-mono!"
/>
<br />
<code class="text-sm opacity-50">
    <kbd class="bg-gray-600 px-1.5 py-1">ENTER</kbd> para analizar
</code>

<br />
<div style="display: flex; flex-direction: row; gap: 10px; width: 100%;">
    <Button onclick={parseCMDs} channel="ZakaTeka" title="Calcular el FLSM."
        ><b>&starf;</b> Analizar comando</Button
    >
    <Button
        onclick={share}
        channel="ZakaTeka"
        popovertarget="share-popover"
        title="Generar un enlace para compartir el resultado."
        ><b>&nearr;</b> Compartir
    </Button>
</div>
<div id="share-popover" class="absolute mx-auto mt-[80vh] border-2 border-(--fff25) p-4" popover>
    ¡Enlace copiado al portapapeles!
</div>

{#if val !== null}
    <br />
    {#each val as expression, idx (idx)}
        <h3 class="opacity-50">Línea {idx + 1}</h3>
        {#if expression.some((v) => typeof v != "string" && !("comment" in v) && v.prediction && "err" in v.prediction)}
            <div class="mt-2 bg-red-700 p-4 text-white">
                <b
                    >Se han detectado errores de sintaxis, tu comando fallará sí o sí en algún lado.<br
                    />Baja y busca los bloques rojos, te indicarán qué pasa.</b
                >
            </div>
            <br />
        {/if}
        {#each expression as c, idx (idx)}
            {#if typeof c == "string"}
                <p>
                    <b
                        >{{
                            "|": "Y SE REDIRIGE A",
                            "||": "Y SI SALE MAL",
                            "&&": "Y SI SALE BIEN",
                            "&": "Y DESPUÉS",
                            ">": "Y CON SU SALIDA ESTÁNDAR, (CREA O) SOBRESCRIBE",
                            "1>": "Y CON ESPECÍFICAMENTE SU SALIDA ESTÁNDAR, (CREA O) SOBRESCRIBE",
                            ">>": "Y CON SU SALIDA ESTÁNDAR, (CREA O) AÑADE A",
                            "2>": "Y CON SU ERROR ESTÁNDAR, (CREA O) SOBRESCRIBE",
                            "2>>": "Y CON SU ERROR ESTÁNDAR, (CREA O) AÑADE A",
                        }[c]}</b
                    >
                </p>
            {:else if "comment" in c}
                <span class="text-italic font-mono! opacity-60">Comentario: <b>{c.comment}</b></span
                >
            {:else}
                <div class="flex flex-row gap-4">
                    {#if c.utility in knownUtils}
                        <abbr title={knownUtils[c.utility]}>
                            <h2 class="font-mono!">
                                {c.utility}
                            </h2>
                        </abbr>
                    {:else}
                        <h2 class="font-mono!">
                            {c.utility}
                        </h2>
                    {/if}
                    <h2 class="font-mono!">
                        {#each c.positionals as p, i (i)}
                            {#if isStringToEvalEnvVariable(p)}
                                <abbr
                                    title={`Variable de entorno «${p.slice(1, -1)}»`}
                                    class="font-mono! opacity-70">{p}</abbr
                                >{" "}
                            {:else}
                                <span class="font-mono! opacity-70">{p}</span>{" "}
                            {/if}
                        {/each}
                    </h2>
                    <h2 class="font-mono!">
                        {#each c.switches as p, i (i)}
                            <span class="font-mono! font-light opacity-50">{p}</span>{" "}
                        {/each}
                    </h2>
                </div>
                {#if c.prediction}
                    {#if "err" in c.prediction}
                        <div class="mt-2 bg-red-700 p-4 font-mono text-white">
                            <b>Esto va a fallar. ¿El motivo?</b>
                            {c.prediction.err}
                        </div>
                    {/if}{#if "action" in c.prediction}
                        <div class="mt-2 bg-blue-700 p-4 font-mono text-white">
                            <b>{c.prediction.action}</b>
                        </div>
                    {/if}{#if "takes" in c.prediction}
                        <div class="mt-2 bg-teal-700 p-4 font-mono text-white">
                            Toma la siguiente entrada:<br /><b>{c.prediction.takes}</b>
                        </div>
                    {/if}{#if "exits" in c.prediction}
                        <div class="mt-2 bg-black p-4 font-mono text-white">
                            <b>Sale de CMD.</b> Devuelve el código de salida {c.prediction.exits}.
                        </div>
                    {/if}{#if "clears" in c.prediction}
                        <div class="mt-2 bg-gray-700 p-4 font-mono text-white">
                            Limpia la pantalla. Lo que sea que se haya impreso antes se borrará.
                        </div>
                    {/if}{#if "help" in c.prediction}
                        <div class="mt-2 bg-cyan-700 p-4 font-mono text-white">
                            Muestra la ayuda {#if typeof c.prediction.help == "number"}general{:else}con
                                el comando {c.prediction.help}{/if}.
                        </div>
                    {/if}{#if "finds" in c.prediction}
                        <div class="mt-2 bg-amber-700 p-4 font-mono text-white">
                            Busca la cadena <b>{c.prediction.finds![0]}</b> en
                            <b
                                >{#if c.prediction.finds![1] == 1}la salida del comando anterior{:else}{c
                                        .prediction.finds![1]}{/if}</b
                            >.
                        </div>
                    {/if}{#if "dev" in c.prediction}
                        <div class="mt-2 bg-gray-500 p-4 font-mono text-white">
                            Esto actúa como dispositivo, puede recibir salidas y usarse de forma
                            especial. Este es <b>{c.prediction.dev}</b>
                        </div>
                    {/if}{#if "prints" in c.prediction}
                        <div class="mt-2 bg-slate-700 p-4 font-mono text-white">
                            {#if typeof c.prediction.prints == "string"}
                                Imprime <b
                                    >{formatStringToEvalEnvVariable(c.prediction.prints, true)}</b
                                >
                                a la salida estándar.<br />
                            {:else}
                                Imprime una de dos:
                                <ul>
                                    <li>
                                        {c.prediction.prints!.or[0]}
                                    </li>
                                    <li>
                                        {c.prediction.prints!.or[1]}
                                    </li>
                                </ul>
                                ¿El criterio? {c.prediction.prints!.basis}
                            {/if}
                        </div>
                    {/if}
                {:else if typeof expression[idx - 1] == "string" && [">", ">>"].includes(expression[idx - 1] as string)}
                    <div class="mt-2 bg-teal-800 p-4 font-mono text-white">
                        Esto de arriba es la ruta a un fichero que se creará/(sobre)escribirá con la
                        salida del comando anterior.
                    </div>
                {:else}
                    <p>
                        No se puede predecir con exactitud la salida de este comando. Si es un
                        ejecutable esto es normal, si es una función de CMD, no estará (aún)
                        soportada por este analizador sintáctico.
                    </p>
                {/if}
            {/if}
            <br />
        {/each}
    {/each}
{/if}

<!--
probar con esto:
TITLE ZakaCMD && COLOR 0A && ECHO Iniciando proceso... > log.txt && MKDIR backup 2>nul && DIR /B *.txt | FIND /I "report" > encontrados.txt && IF EXIST encontrados.txt (TYPE encontrados.txt | MORE && COPY encontrados.txt backup\encontrados_%DATE:~-4%%DATE:~3,2%%DATE:~0,2%.txt >> log.txt) || ECHO No se encontraron archivos >> log.txt && SYSTEMINFO | FIND "OS Name" >> log.txt && ECHO Proceso finalizado correctamente. >> log.txt

esto tmb:
date && echo hello world && echo on && echo off && echo && dir && dir C:\Windows && dir C:\foo\*.txt /b && dir . /s /w && type && cd && cd C:\Windows && mkdir test_dir && rmdir test_dir && del test_file.txt && copy file1.txt file2.txt && move file2.txt file3.txt && ren file3.txt file4.txt && set && set PATH && set VAR=hello && ver && date /t && time /t && help && ping google.com && ping google.com -t && ping google.com -n 10 && ipconfig && ipconfig /all && ipconfig /flushdns && ipconfig /release && ipconfig /renew && cls && pause && exit 0

TODO: (ambas tienen comandos y cosas que aún no están implementadas o no van del todo bien)
-->
