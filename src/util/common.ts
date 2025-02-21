export function isSafari() {
    const userAgent = navigator.userAgent;
    const isSafari =
        /Safari/.test(userAgent) || /Version\/[\d.]+.*Safari/.test(userAgent);

    return isSafari;
};