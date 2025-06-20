import Player from "video.js/dist/types/player";

export function isSafari() {
    const userAgent = navigator.userAgent;
    const isSafari =
        /Safari/.test(userAgent) || /Version\/[\d.]+.*Safari/.test(userAgent) || userAgent.includes('HOGAK_APP');
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
  

export function hasAudio(player: Player): boolean {
  // 1.  Video.js’ own wrapper (works for HLS/DASH where audio is signalled separately)
  // @ts-ignore
  const vjsTracks = player.audioTracks?.();
  if (vjsTracks && vjsTracks.length > 0) return true;

  // 2.  Fall back to the native <video> element
  const el = player.tech({ IWillNotUseThisInPlugins: true }).el() as HTMLVideoElement;

  //    Firefox exposes a boolean
  if (typeof (el as any).mozHasAudio !== 'undefined') {
    return (el as any).mozHasAudio;
  }

  //    Chrome/Safari expose the decoded-byte counter
  if (typeof (el as any).webkitAudioDecodedByteCount !== 'undefined') {
    return (el as any).webkitAudioDecodedByteCount > 0;
  }

  // Couldn’t find evidence of audio
  return false;
}