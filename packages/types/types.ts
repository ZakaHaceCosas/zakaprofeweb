export type IVideo = {
    title: string;
    duration: string;
    thumbnail: string;
    url: `https://www.youtube.com/watch?v=${string}`;
    subject: string;
    level: string;
    likes: number;
    seen: number;
    season: number;
};
export const ZP_SUBJECTS = [
    "Física y Química",
    "Matemáticas",
    "Ciencias Sociales",
    "Biología y Geología",
    "Lengua Castellana",
    "Inglés",
] as const;
export const ZP_COURSES = ["4to ESO", "3ro ESO"] as const;
export type ZPSubject = (typeof ZP_SUBJECTS)[number];
export type ZPCourse = (typeof ZP_COURSES)[number];
export const ZT_SUBJECTS = ["Desarrollo web", "Programación", "Sistemas Operativos"] as const;
export const ZT_COURSES = ["(SMR | DAM | DAW | ASIR)"] as const;
export type ZTSubject = (typeof ZT_SUBJECTS)[number];
export type ZTCourse = (typeof ZT_COURSES)[number];
export const ISSubject_ZP = (a: unknown): a is ZPSubject =>
    typeof a == "string" && ZP_SUBJECTS.includes(a as ZPSubject);
export const ISSubject_ZT = (a: unknown): a is ZTSubject =>
    typeof a == "string" && ZT_SUBJECTS.includes(a as ZTSubject);
export const ISCourse_ZP = (a: unknown): a is ZPCourse =>
    typeof a == "string" && ZP_COURSES.includes(a as ZPCourse);
export const ISCourse_ZT = (a: unknown): a is ZTCourse =>
    typeof a == "string" && ZT_COURSES.includes(a as ZTCourse);
