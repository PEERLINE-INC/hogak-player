export function isSafari() {
    const userAgent = navigator.userAgent;
    const isSafari =
        /Safari/.test(userAgent) || /Version\/[\d.]+.*Safari/.test(userAgent);
    const isIos = /iPad|iPhone/.test(userAgent);

    return isSafari && isIos;
};

export function isSupportAirplay() {
    // @ts-ignore
    return !!window.WebKitPlaybackTargetAvailabilityEvent;
};