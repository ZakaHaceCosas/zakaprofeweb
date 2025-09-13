import { ChangeEvent } from "preact/compat";
import { useEffect, useState } from "preact/hooks";

// Definir los tipos de las propiedades de cada nota
interface Nota {
    nota: string;
    pondering: string;
}

export default function Notas() {
    const [notas, setNotas] = useState<Nota[]>([{ nota: "", pondering: "" }]);
    const [average, setAverage] = useState<number | null>(null);
    const [isPonderingOne, setIsPonderingOne] = useState<boolean>(false);

    // manage changes to grades (notas)
    const handleInputChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedNotas = [...notas];
        updatedNotas[index][name as keyof Nota] = value;
        setNotas(updatedNotas);
    };

    const addNota = () => {
        setNotas([...notas, { nota: "", pondering: "" }]);
    };

    const deleteNota = (index: number) => {
        const updatedNotas = [...notas];
        updatedNotas.splice(index, 1);
        setNotas(updatedNotas);
    };

    // check if pondering is consistently 1
    // (which means all grade are equally worth)
    useEffect(() => {
        setIsPonderingOne(
            notas.every((nota) => parseFloat(nota.pondering) === 1) && notas.length > 1,
        );
    }, [notas]);

    const calculateAverage = () => {
        let sumaNotas = 0;
        let sumaPonderaciones = 0;

        const pondersOne = notas.every((nota) => parseFloat(nota.pondering) === 1);

        if (pondersOne) {
            // normalize pondering vals if they're all 1
            const normalizadas = notas.map((nota) => ({
                ...nota,
                pondering: (1 / notas.length).toString(),
            }));
            setNotas(normalizadas);
        }

        notas.forEach((nota) => {
            const notaValue = parseFloat(nota.nota);
            const ponderingValue = parseFloat(nota.pondering);

            if (!isNaN(notaValue) && !isNaN(ponderingValue) && ponderingValue >= 0) {
                sumaNotas += notaValue * ponderingValue;
                sumaPonderaciones += ponderingValue;
            }
        });

        if (sumaPonderaciones > 0) {
            setAverage(sumaNotas / sumaPonderaciones);
        } else {
            setAverage(null);
        }
    };

    return (
        <div className="notas">
            <h1>Calculadora de Notas Medias</h1>
            <p>
                Calculadora básica para promediar notas.
                <br />
                <br />
                Dale un valor de entre 0 y 1 a cada ponderación y pon la nota que deseas. Luego dale
                a "Calcular promedio" y obtendrás tu media.
                <br />
                Por ejemplo, en exámenes, si dos exámenes valían un 40% de la nota final y un
                tercero valía un 20%, pondrías como ponderaciones 0.4, 0.4, y 0.2.
                <br />
                <br />
                Las ponderaciones deberían sumar siempre 1, a menos que pongas "1" a <i>todas</i> -
                caso en el que se asume que todas las notas valen lo mismo.
            </p>
            {notas.map((nota, index) => (
                <div key={index} className="nota_wrapper">
                    <p className="nota_lbl">Nota {index + 1}</p>
                    <input
                        type="number"
                        name="nota"
                        value={nota.nota}
                        onChange={(e) => handleInputChange(index, e)}
                        placeholder="Nota"
                        required
                        className="nota_input"
                    />
                    <input
                        className="ponder_input"
                        style={{
                            backgroundColor:
                                parseFloat(nota.pondering) <= 0
                                    ? "#FF3232"
                                    : parseFloat(nota.pondering) > 1
                                      ? "#FFc832"
                                      : "",
                        }}
                        type="number"
                        name="pondering"
                        id={`ponder_${index}`}
                        value={nota.pondering}
                        onChange={(e) => handleInputChange(index, e)}
                        placeholder="Ponderación (0 - 1)"
                        step="0.01"
                        min="0"
                        max="1"
                        required
                    />
                    <button className="btn" onClick={() => deleteNota(index)}>
                        Eliminar
                    </button>
                </div>
            ))}

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                    width: "100%",
                }}
            >
                <button className="btn" onClick={addNota} style={{ flex: 1 }}>
                    Agregar Nota
                </button>

                <button className="btn" onClick={calculateAverage} style={{ flex: 1 }}>
                    Calcular Promedio
                </button>
            </div>

            {isPonderingOne && (
                <p>
                    Ponderando con 1 como valor total ya que todas las ponderaciones son 1. Se asume
                    que todas las notas valen por igual.
                </p>
            )}
            {!isPonderingOne
                && notas.filter((s) => s.pondering.trim() != "").length > 0
                && notas
                    .filter((s) => s.pondering.trim() != "")
                    .reduce((a, b) => a + parseFloat(b.pondering || "0"), 0) !== 1 && (
                    <p>
                        ¡Ojo! El valor podría no ser lógico, mira que las ponderaciones sumen 1 (no
                        lo hacen).
                    </p>
                )}

            {average && (
                <h3 id="result">
                    La media sería de{" "}
                    <span
                        style={{
                            fontSize: "xx-large",
                            color: "var(--zakaProfe)",
                        }}
                    >
                        {average.toFixed(2)}
                    </span>
                </h3>
            )}
        </div>
    );
}
