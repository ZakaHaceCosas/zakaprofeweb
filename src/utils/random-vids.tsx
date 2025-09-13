import { useState, useEffect } from "preact/hooks";
import items, { IVideo } from "../resources/videos.ts";
import ExternalLink from "./ext-link.tsx";

export default function RandomVideoFeed() {
    const [videos, setVideos] = useState<{
        one: null | IVideo;
        two: null | IVideo;
    }>({
        one: null,
        two: null,
    });

    const RandomizeVids = () => {
        const randomIndex1 = Math.floor(Math.random() * items.length);
        let randomIndex2 = Math.floor(Math.random() * items.length);
        while (randomIndex2 === randomIndex1) {
            randomIndex2 = Math.floor(Math.random() * items.length);
        }
        setVideos({
            one: items[randomIndex1],
            two: items[randomIndex2],
        });
    };

    useEffect(() => {
        RandomizeVids();
    }, []);

    return (
        <div className="randoms">
            {videos.one && (
                <ExternalLink url={videos.one.url}>
                    <div className="video">
                        <img src={videos.one.thumbnail} alt={videos.one.title} />
                        <div className="overlay">
                            <p>
                                Ver <b>{videos.one.title}</b> &gt;&gt;&gt;
                            </p>
                        </div>
                    </div>
                </ExternalLink>
            )}
            {videos.two && (
                <ExternalLink url={videos.two.url}>
                    <div className="video">
                        <img src={videos.two.thumbnail} alt={videos.two.title} />
                        <div className="overlay">
                            <p>
                                Ver <b>{videos.two.title}</b> &gt;&gt;&gt;
                            </p>
                        </div>
                    </div>
                </ExternalLink>
            )}
        </div>
    );
}
