import { ComponentChildren } from "preact";

export default function ExternalLink({
    url,
    children,
}: {
    url: string;
    children: ComponentChildren;
}) {
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
