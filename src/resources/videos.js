// videos.js
/*
 * QUE VIDEOS SE DESTACAN:
 * - ultima temporada, todos
 * - mejores videos de la temporada anterior si es que no hay al menos 6 videos
 * - si hay videos extraordinariamente buenos, añadirlos sin importar la temporada
 */

const seasonThree = [
    {
        title: "Radicales y logaritmos",
        thumbnail: "/mat/4eso/radicales.webp",
        url: "https://youtube.com/watch?v=uJcdRHFbjE8",
        topic: "Matemáticas",
        level: "4º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "Estequiometría",
        thumbnail: "/fyq/4eso/estequiometria.webp",
        url: "https://youtube.com/watch?v=2NGOxlhb9SQ",
        topic: "Física y Química",
        level: "4º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "Revolución Francesa",
        thumbnail: "/cis/4eso/french_revolution.webp",
        url: "https://youtube.com/watch?v=F0YQWc0RDsg",
        topic: "Ciencias Sociales",
        level: "4º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "Ancien Regime",
        thumbnail: "/cis/4eso/ancien_regime.webp",
        url: "https://youtube.com/watch?v=0nDmB7EWZ-8",
        topic: "Ciencias Sociales",
        level: "4º ESO",
        pdfPro: null,
        pdfNah: null,
    },
];

const seasonTwo = [
    {
        title: "Funciones",
        thumbnail: "/mat/3eso/funciones.webp",
        url: "https://www.youtube.com/watch?v=TcuulLTJ23E",
        topic: "Matemáticas",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "Sucesiones",
        thumbnail: "/mat/3eso/sucesiones.webp",
        url: "https://youtu.be/DB5Njh4gbT0",
        topic: "Matemáticas",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "Cinemática",
        thumbnail: "/fyq/3eso/cinematica.webp",
        url: "https://www.youtube.com/watch?v=tR0KRK6OSGw",
        topic: "Física y Química",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
];

const __no_utilizar_bro = [
    {
        title: "Reacciones químicas",
        thumbnail: "/fyq/3eso/reacciones.webp",
        url: "https://youtu.be/viivXTHioac",
        topic: "Física y Química",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "Aparato Excretor",
        thumbnail: "/bio/3eso/ap_excretor.webp",
        url: "https://youtu.be/wZWR3jvr9mc",
        topic: "Biología y Geología",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "Verbos modales en inglés",
        thumbnail: "/eng/3eso/modals.webp",
        url: "https://youtu.be/TSPC_rJzEX4",
        topic: "Inglés",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "Sintaxis en Castellano",
        thumbnail: "/esp/3eso/sintaxis.webp",
        url: "https://www.youtube.com/watch?v=CHgrGY5NdHU",
        topic: "Lengua Castellana",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "El átomo",
        thumbnail: "/fyq/3eso/atomo.webp",
        url: "https://www.youtube.com/watch?v=Ouhi9hYIAi4",
        topic: "Física y Química",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "La ciudad",
        thumbnail: "/cis/3eso/ciudad.webp",
        url: "https://www.youtube.com/watch?v=HwObqxE3fgQ",
        topic: "Ciencias Sociales",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "La materia y sus propiedades",
        thumbnail: "/fyq/3eso/materia.webp",
        url: "https://www.youtube.com/watch?v=OgVlCYGptZY",
        topic: "Física y Química",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "La organización del ser humano",
        thumbnail: "/bio/3eso/org_humano.webp",
        url: "https://www.youtube.com/watch?v=gYXIwBPD05E",
        topic: "Biología y Geología",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "Los números racionales",
        thumbnail: "/mat/3eso/racionales.webp",
        url: "https://www.youtube.com/watch?v=Aaj9n3m-Q-M",
        topic: "Matemáticas",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "El Estado",
        thumbnail: "/cis/3eso/el_estado.webp",
        url: "https://www.youtube.com/watch?v=5P6UevN82bQ",
        topic: "Ciencias Sociales",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "Teorema de Pitágoras",
        thumbnail: "/mat/3eso/pitagoras.webp",
        url: "https://www.youtube.com/watch?v=sJ_UhcUBId8",
        topic: "Matemáticas",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "Dinámica",
        thumbnail: "/fyq/3eso/dinamica.webp",
        url: "https://www.youtube.com/watch?v=27jDsxGWpnc",
        topic: "Física y Química",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "Aparato Circulatorio",
        thumbnail: "/bio/3eso/ap_circulatorio.webp",
        url: "https://youtube.com/watch?v=mNu2JVjy1v4",
        topic: "Biología",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
];

const items = [
    ...seasonThree,
    ...seasonTwo,
    // de momento se usarán todos los videos de todos modos
    ...__no_utilizar_bro,
];

export default items;
