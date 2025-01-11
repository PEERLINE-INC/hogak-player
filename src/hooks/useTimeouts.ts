import { useCallback, useEffect, useState } from "react";

const idleTimeout = 1000 * 5; // 기본 5초

const useEventTimeout = (
  callback: () => void,
  events: string[] = ["click", "keypress"],
  timeout: number = idleTimeout,
  isPlay?: boolean  // 재생 상태를 prop으로 받음
) => {
  const [lastActivity, setLastActivity] = useState<number>(Date.now()); // 마지막 활동 시간(ms)

  const resetTimer = useCallback(() => {
    console.log('resetTimer');
    setLastActivity(Date.now());
  }, []);

  useEffect(() => {
    // 이벤트 리스너 추가
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      // 이벤트 리스너 제거
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [events, resetTimer]);

  useEffect(() => {
    const idleTimer = setTimeout(() => {
      callback();
    }, timeout);

    return () => {
      clearTimeout(idleTimer);
    };
  }, [lastActivity, timeout, callback]);

  // 재생 상태가 변경될 때마다 타이머 리셋
  useEffect(() => {
    if (isPlay) {
      setLastActivity(Date.now());
    }
  }, [isPlay]);
};

export default useEventTimeout;