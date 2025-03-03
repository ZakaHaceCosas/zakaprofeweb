import { ReactNode } from "react";

export default function ExternalLink({ url, children }: { url: string; children: ReactNode }) {
    return (
        <a
            style={{ display: "flex", alignItems: "center", gap: 5 }}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
        >
            {children}
        </a>
    );
}
