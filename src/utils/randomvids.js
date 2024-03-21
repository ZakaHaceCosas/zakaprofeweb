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
