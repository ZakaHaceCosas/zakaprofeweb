/**
 * Te da la cantidad de días que tiene este año (365 o 366).
 *
 * https://stackoverflow.com/a/43819507 - Retrieved 2026-03-31, License - CC BY-SA 4.0
 */
export const yearSize = (): 365 | 366 =>
    new Date(new Date().getFullYear(), 1, 29).getDate() === 29 ? 366 : 365;

/**
 * Cadena a número de forma segura (si no es válido devuelve un cero).
 */
export const num = (v: string): number => {
    const n = Number(v);
    return isNaN(n) ? 0 : n;
};
