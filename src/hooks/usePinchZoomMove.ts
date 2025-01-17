import { useState, useEffect } from 'react';

function getDistance(touch1: Touch, touch2: Touch) {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// 누적 이동을 추적하기 위한 인터페이스
interface OffsetState {
  offsetX: number;
  offsetY: number;
  lastX: number;  // touchMove에서 이전 터치 위치를 저장해두기 위해
  lastY: number;
  isPanning: boolean;
}

// 컨테이너 사이즈 인터페이스
interface SizeState {
  width: number;
  height: number;
}

export default function usePinchZoomAndMove(
  videoRef: React.RefObject<HTMLDivElement>,
  zoomPluginRef: React.MutableRefObject<any>
) {
  const [initialPinchDistance, setInitialPinchDistance] = useState(0);
  const [initialScale, setInitialScale] = useState(1);
  const [currentScale, setCurrentScale] = useState(1);

  // 누적 이동을 위한 상태
  const [offset, setOffset] = useState<OffsetState>({
    offsetX: 0,
    offsetY: 0,
    lastX: 0,
    lastY: 0,
    isPanning: false,
  });

  // 컨테이너 사이즈
  const [size, setSize] = useState<SizeState>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const container = videoRef.current;
    if (!container) return;

    // ResizeObserver 콜백
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === container) {
          const cr = entry.contentRect;
          console.log('ResizeObserver (size)', cr.width, cr.height);
          setSize({
            width: cr.width,
            height: cr.height,
          });
        }
      }
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [videoRef]);

  useEffect(() => {
    const container = videoRef.current;
    if (!container) return;

    function handleTouchStart(e: TouchEvent) {
      // (1) 두 손가락 → pinch
      if (e.touches.length === 2 && zoomPluginRef.current) {
        const dist = getDistance(e.touches[0], e.touches[1]);
        setInitialPinchDistance(dist);

        const plugin = zoomPluginRef.current;
        const currentScale = plugin.getScale 
          ? plugin.getScale() 
          : plugin.scale ?? 1;

        setInitialScale(currentScale);
      }
      // (2) 한 손가락 → pan
      else if (e.touches.length === 1 && zoomPluginRef.current) {
        console.log('handleTouchStart (pan)', offset);
        setOffset((prev) => ({
          ...prev,
          lastX: e.touches[0].clientX,
          lastY: e.touches[0].clientY,
          isPanning: true,
        }));
      }
    }

    function handleTouchMove(e: TouchEvent) {
      // (1) 두 손가락: pinch
      if (e.touches.length === 2 && zoomPluginRef.current) {
        e.preventDefault();

        const dist = getDistance(e.touches[0], e.touches[1]);
        if (initialPinchDistance === 0) return;

        const scaleFactor = dist / initialPinchDistance;
        let newScale = initialScale * scaleFactor;

        // 최소 배율을 1로 고정
        if (newScale < 1) {
          newScale = 1;

          // 배율이 1이 되었다면 offset도 (0,0)으로 조정
          setOffset((prev) => ({
            ...prev,
            offsetX: 0,
            offsetY: 0,
          }));
          zoomPluginRef.current.move(0, 0);
        }

        setCurrentScale(newScale);
        zoomPluginRef.current.zoom(newScale);
      }
      // (2) 한 손가락: move (누적 이동)
      else if (e.touches.length === 1 && zoomPluginRef.current) {
        e.preventDefault();

        if (currentScale <= 1) {
          return;
        }

        setOffset((prev) => {
          if (!prev.isPanning) return prev;
          // 이번 move 이벤트에서 터치 이동량
          const deltaX = e.touches[0].clientX - prev.lastX;
          const deltaY = e.touches[0].clientY - prev.lastY;

          // 새 누적 좌표
          let nextOffsetX = prev.offsetX + deltaX;
          let nextOffsetY = prev.offsetY + deltaY;

          console.log('handleTouchMove (move)', nextOffsetX, nextOffsetY, initialScale);

          // 컨테이너 범위를 초과할 수 없음 (컨테이너 사이즈 / 배율)
          const maxX = size.width / currentScale;
          const maxY = size.height / currentScale;
          if (Math.abs(nextOffsetX) > maxX) {
            return prev;
          }
          if (Math.abs(nextOffsetY) > maxY) {
            return prev;
          }

          // 절대 좌표로 이동
          zoomPluginRef.current.move(nextOffsetX, nextOffsetY);

          return {
            offsetX: nextOffsetX,
            offsetY: nextOffsetY,
            lastX: e.touches[0].clientX,
            lastY: e.touches[0].clientY,
            isPanning: true,
          };
        });
      }
    }

    function handleTouchEnd(e: TouchEvent) {
      // pinch 종료
      if (e.touches.length < 2) {
        setInitialPinchDistance(0);
        setInitialScale(1);
      }
      // pan 종료
      if (e.touches.length === 0) {
        setOffset((prev) => ({ 
          ...prev, 
          isPanning: false 
        }));
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
  ]);

  return { offset, size, currentScale }; 
}
