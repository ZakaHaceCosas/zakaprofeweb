import React, { useState, useEffect } from 'react';

const RandomVideoFeed = () => {
    const videos = [
        {
            title: 'Sucesiones - 3º ESO',
            thumbnail: 'https://zakaprofeweb.vercel.app/vid_mate_sucesiones_3eso.png',
            url: 'https://youtu.be/DB5Njh4gbT0'
        },
        {
            title: 'Reacciones químicas - 3º ESO',
            thumbnail: 'https://zakaprofeweb.vercel.app/vid_fyq_reaccionesquimicas_3eso.png',
            url: 'https://youtu.be/viivXTHioac'
        },
        {
            title: 'Aparato Excretor - 3º ESO',
            thumbnail: 'https://zakaprofeweb.vercel.app/vid_byg_apexcretor_3eso.png',
            url: 'https://youtu.be/wZWR3jvr9mc'
        },
        {
            title: 'Verbos modales en inglés - 3º ESO',
            thumbnail: 'https://zakaprofeweb.vercel.app/vid_eng_modalverbs_3eso.png',
            url: 'https://youtu.be/TSPC_rJzEX4'
        },
        {
            title: 'Aparato Circulatorio - 3º ESO',
            thumbnail: 'https://zakaprofeweb.vercel.app/vid_bio_apcirculatorio_3eso.png',
            url: 'https://youtu.be/mNu2JVjy1v4'
        },
        {
            title: 'Sintaxis en Castellano - 3º ESO',
            thumbnail: 'https://zakaprofeweb.vercel.app/vid_esp_sintaxis_3eso.png',
            url: 'https://www.youtube.com/watch?v=CHgrGY5NdHU'
        },
        {
            title: 'El átomo - 3º ESO',
            thumbnail: 'https://zakaprofeweb.vercel.app/vid_fyq_teoriaatomica_3eso.png',
            url: 'https://www.youtube.com/watch?v=Ouhi9hYIAi4'
        },
        {
            title: 'La ciudad - 3º ESO',
            thumbnail: 'https://zakaprofeweb.vercel.app/vid_cis_laciudad_3eso.png',
            url: 'https://www.youtube.com/watch?v=HwObqxE3fgQ'
        },
        {
            title: 'La materia y sus propiedades - 3º ESO',
            thumbnail: 'https://zakaprofeweb.vercel.app/vid_fyq_lamateriaysusprops_3eso.png',
            url: 'https://www.youtube.com/watch?v=OgVlCYGptZY'
        },
        {
            title: 'La organización del ser humano - 3º ESO',
            thumbnail: 'https://zakaprofeweb.vercel.app/vid_bio_laorgdelserhumano_3eso.png',
            url: 'https://www.youtube.com/watch?v=gYXIwBPD05E'
        },
        {
            title: 'Los números racionales - 3º ESO',
            thumbnail: 'https://zakaprofeweb.vercel.app/vid_mate_numerosracionales_3eso.png',
            url: 'https://www.youtube.com/watch?v=Aaj9n3m-Q-M'
        },
        {
        title: 'El Estado - 3º ESO',
        thumbnail: 'https://zakaprofeweb.vercel.app/vid_cis_elestado_3eso.png',
        url: 'https://www.youtube.com/watch?v=5P6UevN82bQ'
        },
        {
        title: 'Teorema de Pitágoras - 3º ESO',
        thumbnail: 'https://zakaprofeweb.vercel.app/vid_mate_trmapitagoras_3eso.png',
        url: 'https://www.youtube.com/watch?v=sJ_UhcUBId8'
        },
    ];

    const [video1, setVideo1] = useState(null);
    const [video2, setVideo2] = useState(null);

    const RandomiseVids = () => {
        const randomIndex1 = Math.floor(Math.random() * videos.length);
        let randomIndex2 = Math.floor(Math.random() * videos.length);
        while (randomIndex2 === randomIndex1) {
            randomIndex2 = Math.floor(Math.random() * videos.length);
        }
        setVideo1(videos[randomIndex1]);
        setVideo2(videos[randomIndex2]);
    };

    useEffect(() => {
        RandomiseVids();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="randoms">
            {video1 && (
                <a href={video1.url} target="_blank" rel="noopener noreferrer">
                    <div className="bggrad">
                        <div className="video">
                            <img src={video1.thumbnail} alt={video1.title} />
                            <div className="overlay">
                                <p>Ver <b>{video1.title}</b> en YouTube</p>
                            </div>
                        </div>
                    </div>
                </a>
            )}
            {video2 && (
                <a href={video2.url} target="_blank" rel="noopener noreferrer">
                    <div className="bggrad">
                        <div className="video">
                            <img src={video2.thumbnail} alt={video2.title} />
                            <div className="overlay">
                                <p>Ver <b>{video2.title}</b> en YouTube</p>
                            </div>
                        </div>
                    </div>
                </a>
            )}
        </div>
    );
};

export default RandomVideoFeed;
