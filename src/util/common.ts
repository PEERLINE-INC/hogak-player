export function isSafari() {
    const userAgent = navigator.userAgent;
    const isSafari =
        /Safari/.test(userAgent) || /Version\/[\d.]+.*Safari/.test(userAgent);
    const isIos = /iPad|iPhone|Macintosh/.test(userAgent);

    // console.log('isSafari', { userAgent, isSafari, isIos })
    return isSafari && isIos;
};

export function isIos() {
  const userAgent = navigator.userAgent;
  const isIos = /iPad|iPhone|Macintosh/.test(userAgent);
  return isIos;
}

export function isHogakApp() {
  const userAgent = navigator.userAgent;
  const isHogakApp = /HOGAK_APP/.test(userAgent);
  return isHogakApp;
}

export function isSupportAirplay() {
    // @ts-ignore
    return !!window.WebKitPlaybackTargetAvailabilityEvent;
};

export function formatTime(seconds: number) {
    if (!Number.isFinite(seconds) || seconds < 0) {
      seconds = 0; // 유효하지 않은 값일 경우 0초로 설정
    }
  
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());
  
    if (hh) {
      return `${hh}:${pad(mm)}:${ss}`;
    }
    return `${hh}:${pad(mm)}:${ss}`;
  }
  
  function pad(string: string | number) {
    return ('0' + string).slice(-2);
  }
  