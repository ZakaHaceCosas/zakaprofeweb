/*
 * NOTA: SALVO ESTE COMENTARIO, TODO EL CONTENIDO DE ESTE ARCHIVO ESTÁ AUTOMÁTICAMENTE GENERADO
 * DIRÍJASE A fetch.ts EN LA RAÍZ DE ESTE REPOSITORIO PARA MÁS DETALLES
 *
 * POR HACER:
 * primero, cumplir con este estándar que escribí hace siglos
 * - QUE VIDEOS SE DESTACAN:
 * - - ultima temporada, todos
 * - - mejores videos de la temporada anterior si es que no hay al menos 6 videos
 * - - si hay videos extraordinariamente buenos, añadirlos sin importar la temporada
 segundo, reorganizar todo mejor para compaginar ZP y ZT
 */

// # INYECTAR AQUÍ AMIGO # //
// # types #
type Subject =
    | "Física y Química"
    | "Matemáticas"
    | "Ciencias Sociales"
    | "Biología y Geología"
    | "Lengua Castellana"
    | "Inglés"
    | "Desarrollo web"
    | "Programación"
    | "Sistemas Operativos";
type Course = "4to ESO" | "3ro ESO" | "(SMR | DAM | DAW | ASIR)";
export interface IVideo {
    title: string;
    channel: "ZakaProfe" | "ZakaTeka"; // compat.
    thumbnail: string;
    url: `https://www.youtube.com/watch?v=${string}`;
    subject: Subject;
    level: Course;
    likes: number;
    seen: number;
    season: number;
}
const ZPVDs: IVideo[] = [{"channel":"ZakaProfe","title":"Cinemática","subject":"Física y Química","level":"4to ESO","url":"https://www.youtube.com/watch?v=dPH94Xst8Vw","season":3,"thumbnail":"t/zp/fyq/4eso/cinematica.avif","likes":3,"seen":46},{"channel":"ZakaProfe","title":"Estequiometría","subject":"Física y Química","level":"4to ESO","url":"https://www.youtube.com/watch?v=2NGOxlhb9SQ","season":3,"thumbnail":"t/zp/fyq/4eso/estequiometria.avif","likes":11,"seen":318},{"channel":"ZakaProfe","title":"La Revolución Francesa","subject":"Ciencias Sociales","level":"4to ESO","url":"https://www.youtube.com/watch?v=F0YQWc0RDsg","season":3,"thumbnail":"t/zp/cis/4eso/la_revolucion_francesa.avif","likes":11,"seen":126},{"channel":"ZakaProfe","title":"Raíces, radicales, y logaritmos","subject":"Matemáticas","level":"4to ESO","url":"https://www.youtube.com/watch?v=uJcdRHFbjE8","season":3,"thumbnail":"t/zp/mate/4eso/raices_radicales_y_logaritmos.avif","likes":9,"seen":132},{"channel":"ZakaProfe","title":"The Ancién Regime (Antiguo régimen)","subject":"Ciencias Sociales","level":"4to ESO","url":"https://www.youtube.com/watch?v=0nDmB7EWZ-8","season":3,"thumbnail":"t/zp/cis/4eso/the_ancien_regime_antiguo_regimen.avif","likes":16,"seen":214},{"channel":"ZakaProfe","title":"Funciones","subject":"Matemáticas","level":"3ro ESO","url":"https://www.youtube.com/watch?v=TcuulLTJ23E","season":2,"thumbnail":"t/zp/mate/3eso/funciones.avif","likes":7,"seen":149},{"channel":"ZakaProfe","title":"La dinámica","subject":"Física y Química","level":"3ro ESO","url":"https://www.youtube.com/watch?v=27jDsxGWpnc","season":2,"thumbnail":"t/zp/fyq/3eso/la_dinamica.avif","likes":7,"seen":81},{"channel":"ZakaProfe","title":"Cinemática","subject":"Física y Química","level":"3ro ESO","url":"https://www.youtube.com/watch?v=tR0KRK6OSGw","season":2,"thumbnail":"t/zp/fyq/3eso/cinematica.avif","likes":6,"seen":40},{"channel":"ZakaProfe","title":"Sintaxis en Castellano","subject":"Lengua Castellana","level":"3ro ESO","url":"https://www.youtube.com/watch?v=CHgrGY5NdHU","season":2,"thumbnail":"t/zp/esp/3eso/sintaxis_en_castellano.avif","likes":7,"seen":59},{"channel":"ZakaProfe","title":"Teorema de Pitágoras","subject":"Matemáticas","level":"3ro ESO","url":"https://www.youtube.com/watch?v=sJ_UhcUBId8","season":2,"thumbnail":"t/zp/mate/3eso/teorema_de_pitagoras.avif","likes":6,"seen":38},{"channel":"ZakaProfe","title":"Sucesiones","subject":"Matemáticas","level":"3ro ESO","url":"https://www.youtube.com/watch?v=DB5Njh4gbT0","season":2,"thumbnail":"t/zp/mate/3eso/sucesiones.avif","likes":6,"seen":99},{"channel":"ZakaProfe","title":"Reacciones químicas","subject":"Física y Química","level":"3ro ESO","url":"https://www.youtube.com/watch?v=viivXTHioac","season":2,"thumbnail":"t/zp/fyq/3eso/reacciones_quimicas.avif","likes":8,"seen":70},{"channel":"ZakaProfe","title":"Aparato excretor","subject":"Biología y Geología","level":"3ro ESO","url":"https://www.youtube.com/watch?v=wZWR3jvr9mc","season":2,"thumbnail":"t/zp/bio/3eso/aparato_excretor.avif","likes":6,"seen":130},{"channel":"ZakaProfe","title":"Aparato circulatorio","subject":"Biología y Geología","level":"3ro ESO","url":"https://www.youtube.com/watch?v=mNu2JVjy1v4","season":2,"thumbnail":"t/zp/bio/3eso/aparato_circulatorio.avif","likes":10,"seen":93},{"channel":"ZakaProfe","title":"Verbos modales en inglés","subject":"Inglés","level":"3ro ESO","url":"https://www.youtube.com/watch?v=TSPC_rJzEX4","season":1,"thumbnail":"t/zp/eng/3eso/verbos_modales_en_ingles.avif","likes":5,"seen":44},{"channel":"ZakaProfe","title":"La ciudad","subject":"Ciencias Sociales","level":"3ro ESO","url":"https://www.youtube.com/watch?v=HwObqxE3fgQ","season":1,"thumbnail":"t/zp/cis/3eso/la_ciudad.avif","likes":8,"seen":103},{"channel":"ZakaProfe","title":"El átomo","subject":"Física y Química","level":"3ro ESO","url":"https://www.youtube.com/watch?v=Ouhi9hYIAi4","season":1,"thumbnail":"t/zp/fyq/3eso/el_atomo.avif","likes":6,"seen":74},{"channel":"ZakaProfe","title":"La materia y sus propiedades","subject":"Física y Química","level":"3ro ESO","url":"https://www.youtube.com/watch?v=OgVlCYGptZY","season":0,"thumbnail":"t/zp/fyq/3eso/la_materia_y_sus_propiedades.avif","likes":4,"seen":41},{"channel":"ZakaProfe","title":"La organización del ser humano","subject":"Biología y Geología","level":"3ro ESO","url":"https://www.youtube.com/watch?v=gYXIwBPD05E","season":0,"thumbnail":"t/zp/bio/3eso/la_organizacion_del_ser_humano.avif","likes":2,"seen":37},{"channel":"ZakaProfe","title":"Los números racionales","subject":"Matemáticas","level":"3ro ESO","url":"https://www.youtube.com/watch?v=Aaj9n3m-Q-M","season":0,"thumbnail":"t/zp/mate/3eso/los_numeros_racionales.avif","likes":3,"seen":66},{"channel":"ZakaProfe","title":"El estado","subject":"Ciencias Sociales","level":"3ro ESO","url":"https://www.youtube.com/watch?v=5P6UevN82bQ","season":0,"thumbnail":"t/zp/cis/3eso/el_estado.avif","likes":3,"seen":37}];
const ZTVDs: IVideo[] = [{"channel":"ZakaTeka","title":"Windows CMD y rutas de archivo en Windows | Explicación completa + ejemplos","level":"(SMR | DAM | DAW | ASIR)","url":"https://www.youtube.com/watch?v=ex70z2-sZqQ","season":4,"thumbnail":"t/zt/undefined/smr/windows_cmd_y_rutas_de_archivo_en_windows_|_explicacion_completa_+_ejemplos.avif","likes":12,"seen":149},{"channel":"ZakaTeka","title":"Visual Studio Code TUTORIAL BÁSICO · Como instalar y utilizar el editor | ZakaTeka","level":"(SMR | DAM | DAW | ASIR)","url":"https://www.youtube.com/watch?v=_EQB3Rq8bUo","season":4,"thumbnail":"t/zt/undefined/smr/visual_studio_code_tutorial_basico_·_como_instalar_y_utilizar_el_editor_|_zakateka.avif","likes":6,"seen":51},{"channel":"ZakaTeka","title":"Cómo tener un ordenador dentro del ordenador | Tutorial básico VirtualBox","level":"(SMR | DAM | DAW | ASIR)","url":"https://www.youtube.com/watch?v=1gkU5kU5WPE","season":4,"thumbnail":"t/zt/undefined/smr/como_tener_un_ordenador_dentro_del_ordenador_|_tutorial_basico_virtualbox.avif","likes":5,"seen":91},{"channel":"ZakaTeka","title":"Lenguaje HTML TUTORIAL BÁSICO · Como redactar una página web en HTML | ZakaTeka","level":"(SMR | DAM | DAW | ASIR)","url":"https://www.youtube.com/watch?v=EcqsGMrCRek","season":4,"thumbnail":"t/zt/undefined/smr/lenguaje_html_tutorial_basico_·_como_redactar_una_pagina_web_en_html_|_zakateka.avif","likes":4,"seen":32}];
export { ZPVDs, ZTVDs };