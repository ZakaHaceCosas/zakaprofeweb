import React, { useState, useEffect } from 'react';
import items from '../resources/videos';

const RandomVideoFeed = () => {
    const [video1, setVideo1] = useState(null);
    const [video2, setVideo2] = useState(null);

    const RandomiseVids = () => {
        const randomIndex1 = Math.floor(Math.random() * items.length);
        let randomIndex2 = Math.floor(Math.random() * items.length);
        while (randomIndex2 === randomIndex1) {
            randomIndex2 = Math.floor(Math.random() * items.length);
        }
        setVideo1(items[randomIndex1]);
        setVideo2(items[randomIndex2]);
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
