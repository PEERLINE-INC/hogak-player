import { useState, useEffect } from 'react';

// 두 손가락 사이 거리 계산 함수
function getDistance(touch1: Touch, touch2: Touch) {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// 한 손가락 이동을 추적하기 위해 (이전 좌표 저장)
interface PanState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isPanning: boolean;
}

export default function usePinchZoomAndMove(
  videoRef: React.RefObject<HTMLDivElement>,
  zoomPluginRef: React.MutableRefObject<any>
) {
  const [initialPinchDistance, setInitialPinchDistance] = useState(0);
  const [initialScale, setInitialScale] = useState(1);

  const [pan, setPan] = useState<PanState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isPanning: false,
  });

  useEffect(() => {
    const container = videoRef.current;
    if (!container) return;

    // 터치 시작
    function handleTouchStart(e: TouchEvent) {
      // 핀치(두 손가락)
      if (e.touches.length === 2 && zoomPluginRef.current) {
        const dist = getDistance(e.touches[0], e.touches[1]);
        setInitialPinchDistance(dist);

        // plugin 내부에서 현재 스케일을 관리하는 경우가 많습니다.
        // 혹은 직접 state 로 scale 을 관리하는 경우도 있음
        const plugin = zoomPluginRef.current;
        const currentScale = plugin.getScale 
          ? plugin.getScale() 
          : plugin.scale ?? 1;

        setInitialScale(currentScale);
      }
      // 이동(한 손가락)
      else if (e.touches.length === 1 && zoomPluginRef.current) {
        setPan({
          startX: e.touches[0].clientX,
          startY: e.touches[0].clientY,
          currentX: e.touches[0].clientX,
          currentY: e.touches[0].clientY,
          isPanning: true,
        });
      }
    }

    // 터치 이동
    function handleTouchMove(e: TouchEvent) {
      // 두 손가락: pinch zoom
      if (e.touches.length === 2 && zoomPluginRef.current) {
        console.log('handleTouchMove (pinch zoom)');
        e.preventDefault(); // 일부 브라우저에서 스크롤 방지

        const dist = getDistance(e.touches[0], e.touches[1]);
        if (initialPinchDistance === 0) return;

        const scaleFactor = dist / initialPinchDistance;
        const newScale = initialScale * scaleFactor;

        // plugin 의 zoom 메소드 호출
        zoomPluginRef.current.zoom(newScale);
      }
      // 한 손가락: move (pan)
      else if (e.touches.length === 1 && zoomPluginRef.current) {
        console.log('handleTouchMove (move)');
        e.preventDefault();

        setPan((prev) => {
          if (!prev.isPanning) return prev;

          const deltaX = e.touches[0].clientX - prev.currentX;
          const deltaY = e.touches[0].clientY - prev.currentY;

          const newX = e.touches[0].clientX;
          const newY = e.touches[0].clientY;

          // plugin 의 move 메소드 호출
          console.log('handleTouchMove (move) deltaX', deltaX, 'deltaY', deltaY);
          zoomPluginRef.current.move(deltaX, deltaY);

          return {
            ...prev,
            currentX: newX,
            currentY: newY,
          };
        });
      }
    }

    // 터치 종료
    function handleTouchEnd(e: TouchEvent) {
      // 손가락이 하나라도 떨어지면 pinch 종료
      if (e.touches.length < 2) {
        setInitialPinchDistance(0);
        setInitialScale(1);
      }
      // 손가락이 0개(모두 떨어짐)
      if (e.touches.length === 0) {
        setPan((prev) => ({ ...prev, isPanning: false }));
      }
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });
    container.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [
    videoRef,
    zoomPluginRef,
    initialPinchDistance,
    initialScale,
    pan,
  ]);
};