const vitalsUrl = "https://vitals.vercel-analytics.com/v1/vitals";

function getConnectionSpeed() {
    return "connection" in navigator
        && navigator["connection"]
        // @ts-expect-error (MOD)
        && "effectiveType" in navigator["connection"]
        ? navigator["connection"]["effectiveType"]
        : "";
}

// MOD
export function sendToVercelAnalytics(metric: { id: string; name: string; value: any }) {
    const analyticsId = import.meta.env.VITE_VERCEL_ANALYTICS_ID;
    if (!analyticsId) {
        return;
    }

    const body = {
        dsn: analyticsId,
        id: metric.id,
        page: window.location.pathname,
        href: window.location.href,
        event_name: metric.name,
        value: metric.value.toString(),
        // MOD
        speed: getConnectionSpeed() as string,
    };

    const blob = new Blob([new URLSearchParams(body).toString()], {
        // This content type is necessary for `sendBeacon`
        type: "application/x-www-form-urlencoded",
    });
    if (navigator.sendBeacon) {
        navigator.sendBeacon(vitalsUrl, blob);
    } else
        fetch(vitalsUrl, {
            body: blob,
            method: "POST",
            credentials: "omit",
            keepalive: true,
        });
}
