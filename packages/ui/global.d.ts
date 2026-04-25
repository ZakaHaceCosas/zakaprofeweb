declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
    }

    namespace YT {
        const Player: new (
            elementId: string,
            options: {
                videoId?: string;
                events?: {
                    onReady?: () => void;
                    onStateChange?: (event: any) => void;
                };
            }
        ) => any;
    }
}

export {};
