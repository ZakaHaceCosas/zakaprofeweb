import type { PlayerStep } from "@zpw/types/types";

const stuff: Record<string, PlayerStep[]> = {
    lkDUdY2tO6g: [
        {
            timestamp: 171,
            title: "¿Por qué se usa una muestra en vez de la población entera?",
            desc: "Elige la razón correcta.",
            type: "choose",
            options: [
                {
                    label: "Porque la muestra siempre da resultados más precisos.",
                    correct: false,
                    explanation:
                        "No, la muestra es menos precisa que estudiar toda la población, pero es suficientemente representativa y mucho más viable.",
                },
                {
                    label: "Porque estudiar a toda la población suele ser inviable.",
                    correct: true,
                    explanation:
                        "Exacto. Estudiar a toda la población es muy complicado en la práctica, así que se coge una muestra suficientemente grande para representar los datos con mediana precisión.",
                },
                {
                    label: "Porque la ley exige que los estudios usen muestras.",
                    correct: false,
                    explanation: "Nada que ver.",
                },
            ],
        },
        {
            timestamp: 237,
            title: "¿Cuál de estas variables es cualitativa?",
            desc: "Piensa en cuáles se pueden medir o contar y cuáles no.",
            type: "choose",
            options: [
                {
                    label: "El peso de una persona en kilos.",
                    correct: false,
                    explanation:
                        "El peso es un número que puedes medir, así que es cuantitativa continua.",
                },
                {
                    label: "Cuántas veces a la semana hace ejercicio alguien.",
                    correct: false,
                    explanation:
                        "Es un número que puedes contar, así que es cuantitativa discreta.",
                },
                {
                    label: "La marca de coche que conduces.",
                    correct: true,
                    explanation:
                        "Correcto. «SEAT», «Renault», «Mercedes»… no puedes medir ni contar esos valores de por sí. Es una variable cualitativa.",
                },
            ],
        },
        {
            timestamp: 272,
            title: "Una variable cuantitativa continua puede tomar valores intermedios (como 50,43 kg).",
            desc: "¿Verdad o mentira?",
            type: "tof",
            answer: true,
        },
        {
            timestamp: 322,
            title: "Cuántas veces a la semana compras ropa, ¿es discreta o continua?",
            desc: "Escribe tu respuesta.",
            type: "input",
            answers: ["discreta", "cuantitativa discreta"],
        },
        {
            timestamp: 356,
            title: "Contexto",
            desc: "Estos datos representan un estudio de una variable cuantitativa discreta («cuántas veces por semana compras ropa»).",
            type: "check",
        },
        {
            timestamp: 912,
            title: "¿Qué representa fi minúscula en la tabla de frecuencias?",
            desc: "Elige la opción correcta.",
            type: "choose",
            options: [
                {
                    label: "La frecuencia absoluta acumulada.",
                    correct: false,
                    explanation: "Esa es Fi mayúscula, que va sumando los valores poco a poco.",
                },
                {
                    label: "La cantidad de veces que aparece cada valor.",
                    correct: true,
                    explanation:
                        "Correcto. fi minúscula es la frecuencia absoluta: cuántas veces te ha dado alguien ese valor como respuesta.",
                },
                {
                    label: "La proporción de cada valor respecto al total.",
                    correct: false,
                    explanation: "Esa es hi minúscula, la frecuencia relativa.",
                },
                {
                    label: "El total de personas encuestadas.",
                    correct: false,
                    explanation:
                        "El total de personas es n mayúscula, que además es igual a la suma de todos los valores de fi.",
                },
            ],
        },
        {
            timestamp: 566,
            title: "La suma de todos los valores de hi debe dar aproximadamente 1.",
            desc: "¿Es esto correcto?",
            type: "tof",
            answer: true,
        },
        {
            timestamp: 610,
            title: "¿Cómo se calcula el porcentaje a partir de la tabla de frecuencias?",
            desc: "Escribe la operación.",
            type: "input",
            answers: [
                "hi por 100",
                "hi * 100",
                "hi x 100",
                "frecuencia relativa por 100",
                "frecuencia relativa * 100",
            ],
        },
        {
            timestamp: 0, // TODO
            title: "¿Cómo se calcula la media aritmética?",
            desc: "Elige la fórmula correcta.",
            type: "choose",
            options: [
                {
                    label: "Sumatorio de xi entre n.",
                    correct: false,
                    explanation:
                        "Casi, pero falta algo. Es el sumatorio de xi·fi dividido entre n, no solo xi.",
                },
                {
                    label: "Sumatorio de xi·fi dividido entre n.",
                    correct: true,
                    explanation:
                        "Exacto. Multiplicas cada valor por su frecuencia absoluta, sumas todo y divides entre el total de datos.",
                },
                {
                    label: "El valor de xi que más se repite.",
                    correct: false,
                    explanation: "Eso es la moda, no la media.",
                },
            ],
        },
        {
            timestamp: 0, // TODO (colocar ANTES de la explicación, a ver si lo asocian bien)
            title: "La moda es el valor de Xi con mayor fi.",
            desc: "¿Verdad o mentira?",
            type: "tof",
            answer: true,
        },
        // TODO: pensar más (y mejores) preguntas
    ],
};

export const PlayerData = new Map(Object.entries(stuff));
