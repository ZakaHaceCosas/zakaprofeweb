export type IVideo = {
    title: string;
    duration: string;
    thumbnail: string;
    id: string;
    subject: string;
    level: string;
    likes: number;
    seen: number;
    season: number;
    player: PlayerStep[] | null;
};
export const ZP_SUBJECTS = [
    "Física y Química",
    "Matemáticas",
    "Ciencias Sociales",
    "Biología y Geología",
    "Lengua Castellana",
    "Inglés",
] as const;
export const ZP_COURSES = ["4to ESO", "3ro ESO", "1ro bach"] as const;
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
export type Parameter = {
    key: string;
    type: "text" | "number" | "textarea" | "select";
    title: string;
    onchange?: "none" | "calc" | "calc-no-throw";
    onenter?: "none" | "calc" | "calc-no-throw";
    list?:
        | {
              pairs: false;
              title: string;
          }
        | {
              pairs: true;
              title: [string, string];
          };
    options?: { value: string; label: string }[];
    req?: boolean;
    tail?: string;
};
export type ParameterForField = Parameter & { id: string };
export type ParameterValue = string | string[] | [string, string][];
export type ParameterValueObject = Record<string, ParameterValue>;
export const IsParameterATuple = (a: ParameterValue): a is [string, string][] =>
    Array.isArray(a) && a.at(0) != undefined && Array.isArray(a[0]);
export type PlayerStep = {
    timestamp: number;
    title: string;
    desc: string;
} & (
    | { type: "check" }
    | { type: "freestanding"; hideAt: number }
    | { type: "choose"; options: { label: string; correct: boolean; explanation: string }[] }
    | {
          type: "tof";
          answer: boolean;
      }
    | { type: "input"; answers: string[] }
);
