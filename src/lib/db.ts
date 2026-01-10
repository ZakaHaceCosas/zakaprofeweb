/*
 * POR HACER:

 primero, cumplir con este estándar que escribí hace siglos
 * QUE VIDEOS SE DESTACAN:
 * - ultima temporada, todos
 * - mejores videos de la temporada anterior si es que no hay al menos 6 videos
 * - si hay videos extraordinariamente buenos, añadirlos sin importar la temporada
 segundo, reorganizar todo mejor para compaginar ZP y ZT
 */

type Asig =
    | "Física y Química"
    | "Matemáticas"
    | "Ciencias Sociales"
    | "Biología y Geología"
    | "Lengua Castellana"
    | "Inglés"
    | "Desarrollo web"
    | "Programación"
    | "Sistemas Operativos";

type Curso = "4º ESO" | "3º ESO" | "(SMR | DAM | DAW | ASIR)";

export interface IVideo {
    title: string;
    thumbnail: string;
    url: `https://www.youtube.com/watch?v=${string}`;
    topic: Asig;
    channel: "ZakaProfe" | "ZakaTeka";
    level: Curso;
    season: "0" | "1" | "2" | "3" | "4";
}

type IVideoBase = Omit<IVideo, "season">;

const seasonThree: IVideoBase[] = [
    {
        title: "Cinemática",
        thumbnail: "/fyq/4eso/cinematica.webp",
        url: "https://www.youtube.com/watch?v=dPH94Xst8Vw",
        topic: "Física y Química",
        channel: "ZakaProfe",
        level: "4º ESO",
    },
    {
        title: "Radicales y logaritmos",
        thumbnail: "/mat/4eso/radicales.webp",
        url: "https://www.youtube.com/watch?v=uJcdRHFbjE8",
        topic: "Matemáticas",
        channel: "ZakaProfe",
        level: "4º ESO",
    },
    {
        title: "Estequiometría",
        thumbnail: "/fyq/4eso/estequiometria.webp",
        url: "https://www.youtube.com/watch?v=2NGOxlhb9SQ",
        topic: "Física y Química",
        channel: "ZakaProfe",
        level: "4º ESO",
    },
    {
        title: "Revolución Francesa",
        thumbnail: "/cis/4eso/french_revolution.webp",
        url: "https://www.youtube.com/watch?v=F0YQWc0RDsg",
        topic: "Ciencias Sociales",
        channel: "ZakaProfe",
        level: "4º ESO",
    },
    {
        title: "Ancien Regime",
        thumbnail: "/cis/4eso/ancien_regime.webp",
        url: "https://www.youtube.com/watch?v=0nDmB7EWZ-8",
        topic: "Ciencias Sociales",
        channel: "ZakaProfe",
        level: "4º ESO",
    },
];

const seasonTwo: IVideoBase[] = [
    {
        title: "Funciones",
        thumbnail: "/mat/3eso/funciones.webp",
        url: "https://www.youtube.com/watch?v=TcuulLTJ23E",
        topic: "Matemáticas",
        channel: "ZakaProfe",
        level: "3º ESO",
    },
    {
        title: "Sucesiones",
        thumbnail: "/mat/3eso/sucesiones.webp",
        url: "https://www.youtube.com/watch?v=DB5Njh4gbT0",
        topic: "Matemáticas",
        channel: "ZakaProfe",
        level: "3º ESO",
    },
    {
        title: "Cinemática",
        thumbnail: "/fyq/3eso/cinematica.webp",
        url: "https://www.youtube.com/watch?v=tR0KRK6OSGw",
        topic: "Física y Química",
        channel: "ZakaProfe",
        level: "3º ESO",
    },
    {
        title: "Reacciones químicas",
        thumbnail: "/fyq/3eso/reacciones.webp",
        url: "https://www.youtube.com/watch?v=viivXTHioac",
        topic: "Física y Química",
        channel: "ZakaProfe",
        level: "3º ESO",
    },
    {
        title: "Aparato Excretor",
        thumbnail: "/bio/3eso/ap_excretor.webp",
        url: "https://www.youtube.com/watch?v=wZWR3jvr9mc",
        topic: "Biología y Geología",
        channel: "ZakaProfe",
        level: "3º ESO",
    },
    {
        title: "Sintaxis en Castellano",
        thumbnail: "/esp/3eso/sintaxis.webp",
        url: "https://www.youtube.com/watch?v=CHgrGY5NdHU",
        topic: "Lengua Castellana",
        channel: "ZakaProfe",
        level: "3º ESO",
    },
    {
        title: "Teorema de Pitágoras",
        thumbnail: "/mat/3eso/pitagoras.webp",
        url: "https://www.youtube.com/watch?v=sJ_UhcUBId8",
        topic: "Matemáticas",
        channel: "ZakaProfe",
        level: "3º ESO",
    },
    {
        title: "Dinámica",
        thumbnail: "/fyq/3eso/dinamica.webp",
        url: "https://www.youtube.com/watch?v=27jDsxGWpnc",
        topic: "Física y Química",
        channel: "ZakaProfe",
        level: "3º ESO",
    },
    {
        title: "Aparato Circulatorio",
        thumbnail: "/bio/3eso/ap_circulatorio.webp",
        url: "https://www.youtube.com/watch?v=mNu2JVjy1v4",
        topic: "Biología y Geología",
        channel: "ZakaProfe",
        level: "3º ESO",
    },
];

const seasonOne: IVideoBase[] = [
    {
        title: "Verbos modales en inglés",
        thumbnail: "/eng/3eso/modals.webp",
        url: "https://www.youtube.com/watch?v=TSPC_rJzEX4",
        topic: "Inglés",
        channel: "ZakaProfe",
        level: "3º ESO",
    },
    {
        title: "El átomo",
        thumbnail: "/fyq/3eso/atomo.webp",
        url: "https://www.youtube.com/watch?v=Ouhi9hYIAi4",
        topic: "Física y Química",
        channel: "ZakaProfe",
        level: "3º ESO",
    },
    {
        title: "La ciudad",
        thumbnail: "/cis/3eso/ciudad.webp",
        url: "https://www.youtube.com/watch?v=HwObqxE3fgQ",
        topic: "Ciencias Sociales",
        channel: "ZakaProfe",
        level: "3º ESO",
    },
];

const seasonZero: IVideoBase[] = [
    {
        title: "La materia y sus propiedades",
        thumbnail: "/fyq/3eso/materia.webp",
        url: "https://www.youtube.com/watch?v=OgVlCYGptZY",
        topic: "Física y Química",
        channel: "ZakaProfe",
        level: "3º ESO",
    },
    {
        title: "La organización del ser humano",
        thumbnail: "/bio/3eso/org_humano.webp",
        url: "https://www.youtube.com/watch?v=gYXIwBPD05E",
        topic: "Biología y Geología",
        channel: "ZakaProfe",
        level: "3º ESO",
    },
    {
        title: "Los números racionales",
        thumbnail: "/mat/3eso/racionales.webp",
        url: "https://www.youtube.com/watch?v=Aaj9n3m-Q-M",
        topic: "Matemáticas",
        channel: "ZakaProfe",
        level: "3º ESO",
    },
    {
        title: "El Estado",
        thumbnail: "/cis/3eso/el_estado.webp",
        url: "https://www.youtube.com/watch?v=5P6UevN82bQ",
        topic: "Ciencias Sociales",
        channel: "ZakaProfe",
        level: "3º ESO",
    },
];

function addSeason(vidArray: IVideoBase[], season: "0" | "1" | "2" | "3"): IVideo[] {
    return vidArray.map(({ title, thumbnail, url, topic, level, channel }) => {
        return {
            title,
            thumbnail,
            url,
            topic,
            level,
            season,
            channel,
        };
    });
}

const ZPVDs: IVideo[] = [
    ...addSeason(seasonThree, "3"),
    ...addSeason(seasonTwo, "1"),
    ...addSeason(seasonOne, "2"),
    ...addSeason(seasonZero, "0"),
];

const ZTVDs: IVideo[] = [
    {
        channel: "ZakaTeka",
        level: "(SMR | DAM | DAW | ASIR)",
        season: "4",
        thumbnail: "/teka/html-basic.webp",
        title: "Básicos de HTML",
        topic: "Desarrollo web",
        url: "https://www.youtube.com/watch?v=EcqsGMrCRek",
    },
    {
        channel: "ZakaTeka",
        level: "(SMR | DAM | DAW | ASIR)",
        season: "4",
        thumbnail: "/teka/vscode-basic.webp",
        title: "Básicos de Visual Studio Code",
        topic: "Desarrollo web",
        url: "https://www.youtube.com/watch?v=_EQB3Rq8bUo",
    },
    {
        channel: "ZakaTeka",
        level: "(SMR | DAM | DAW | ASIR)",
        season: "4",
        thumbnail: "/teka/vbox-basic.webp",
        title: "Básicos de VirtualBox",
        topic: "Sistemas Operativos",
        url: "https://www.youtube.com/watch?v=1gkU5kU5WPE"
    }
];

const ALL_VDs = [...ZPVDs, ...ZTVDs];

export { ZPVDs, ZTVDs, ALL_VDs };
