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
        thumbnail: "/zp-vd-mat-radicales-4eso.png",
        url: "https://youtube.com/watch?v=uJcdRHFbjE8",
        topic: "Matemáticas",
        level: "4º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "Estequiometría",
        thumbnail: "/zp-vd-fyq-estequio-4eso.png",
        url: "https://youtube.com/watch?v=2NGOxlhb9SQ",
        topic: "Física y Química",
        level: "4º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "Revolución Francesa",
        thumbnail: "/vid_cis_frenchRevolution_4eso.png",
        url: "https://youtube.com/watch?v=F0YQWc0RDsg",
        topic: "Ciencias Sociales",
        level: "4º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "Ancien Regime",
        thumbnail: "/vid_cis_ancienRegime_4eso.png",
        url: "https://youtube.com/watch?v=0nDmB7EWZ-8",
        topic: "Ciencias Sociales",
        level: "4º ESO",
        pdfPro: null,
        pdfNah: null,
    },
];

/** Only some videos to reach the min of 6 (and go a lil beyond) */
const seasonTwo = [
    {
        title: "Funciones",
        thumbnail: "/vid_mate_funciones_3eso.png",
        url: "https://www.youtube.com/watch?v=TcuulLTJ23E",
        topic: "Matemáticas",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "Sucesiones",
        thumbnail: "/vid_mate_sucesiones_3eso.png",
        url: "https://youtu.be/DB5Njh4gbT0",
        topic: "Matemáticas",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "Cinemática",
        thumbnail: "/vid_fyq_cinematica_3eso.png",
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
        thumbnail: "/vid_fyq_reaccionesquimicas_3eso.png",
        url: "https://youtu.be/viivXTHioac",
        topic: "Física y Química",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "Aparato Excretor",
        thumbnail: "/vid_byg_apexcretor_3eso.png",
        url: "https://youtu.be/wZWR3jvr9mc",
        topic: "Biología y Geología",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "Verbos modales en inglés",
        thumbnail: "/vid_eng_modalverbs_3eso.png",
        url: "https://youtu.be/TSPC_rJzEX4",
        topic: "Inglés",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "Sintaxis en Castellano",
        thumbnail: "/vid_esp_sintaxis_3eso.png",
        url: "https://www.youtube.com/watch?v=CHgrGY5NdHU",
        topic: "Lengua Castellana",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "El átomo",
        thumbnail: "/vid_fyq_teoriaatomica_3eso.png",
        url: "https://www.youtube.com/watch?v=Ouhi9hYIAi4",
        topic: "Física y Química",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "La ciudad",
        thumbnail: "/vid_cis_laciudad_3eso.png",
        url: "https://www.youtube.com/watch?v=HwObqxE3fgQ",
        topic: "Ciencias Sociales",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "La materia y sus propiedades",
        thumbnail: "/vid_fyq_lamateriaysusprops_3eso.png",
        url: "https://www.youtube.com/watch?v=OgVlCYGptZY",
        topic: "Física y Química",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "La organización del ser humano",
        thumbnail: "/vid_bio_laorgdelserhumano_3eso.png",
        url: "https://www.youtube.com/watch?v=gYXIwBPD05E",
        topic: "Biología y Geología",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "Los números racionales",
        thumbnail: "/vid_mate_numerosracionales_3eso.png",
        url: "https://www.youtube.com/watch?v=Aaj9n3m-Q-M",
        topic: "Matemáticas",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "El Estado",
        thumbnail: "/vid_cis_elestado_3eso.png",
        url: "https://www.youtube.com/watch?v=5P6UevN82bQ",
        topic: "Ciencias Sociales",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "Teorema de Pitágoras",
        thumbnail: "/vid_mate_trmapitagoras_3eso.png",
        url: "https://www.youtube.com/watch?v=sJ_UhcUBId8",
        topic: "Matemáticas",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "Dinámica",
        thumbnail: "/vid_fyq_dinamica_3eso.png",
        url: "https://www.youtube.com/watch?v=27jDsxGWpnc",
        topic: "Física y Química",
        level: "3º ESO",
        pdfPro: null,
        pdfNah: null,
    },
    {
        title: "Aparato Circulatorio",
        thumbnail: "/vid_bio_apcirculatorio_3eso.png",
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
