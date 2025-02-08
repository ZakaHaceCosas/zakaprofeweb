export default function ExternalLink({ url, children }) {
    return (
        <a
            style={{ display: "flex", alignItems: "center" }}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
        >
            {children}
        </a>
    );
}
