import { useState, useEffect } from 'react';

function getDistance(touch1: Touch, touch2: Touch) {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

interface OffsetState {
  offsetX: number;
  offsetY: number;
  lastX: number;
  lastY: number;
  isPanning: boolean;
}

interface SizeState {
  width: number;
  height: number;
}

export default function usePinch(
  videoRef: React.RefObject<HTMLDivElement>,
) {
  const [initialPinchDistance, setInitialPinchDistance] = useState(0);
  const [initialScale, setInitialScale] = useState(1);
  const [currentScale, setCurrentScale] = useState(1);
  
  const [offset, setOffset] = useState<OffsetState>({
    offsetX: 0,
    offsetY: 0,
    lastX: 0,
    lastY: 0,
    isPanning: false,
  });

  const [size, setSize] = useState<SizeState>({
    width: 0,
    height: 0,
  });

  // transform 적용
  const applyTransform = () => {
    if (videoRef.current) {
      const [video] = videoRef.current.getElementsByTagName('video');
      if (!video) return;
      video.style.transform = `translate(${offset.offsetX}px, ${offset.offsetY}px) scale(${currentScale})`;
    }
  };

  useEffect(() => {
    applyTransform();
  }, [offset, currentScale]);

  // 컨테이너 사이즈 추적
  useEffect(() => {
    const container = videoRef.current;
    if (!container) return;

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

  // ─────────────────────────────────────────
  // (1) Touch 이벤트 (Pinch / Pan)
  // ─────────────────────────────────────────
  useEffect(() => {
    const container = videoRef.current;
    if (!container) return;

    function handleTouchStart(e: TouchEvent) {
      console.log('handleTouchStart', e.touches.length);
      // popover 떠있는 경우 터치 이벤트 무시
      const targetEl = e.target as HTMLElement;
      if (targetEl.closest('.hogak-popover')) {
        return;
      }
      
      if (e.touches.length === 2) {
        // pinch 시작
        const dist = getDistance(e.touches[0], e.touches[1]);
        setInitialPinchDistance(dist);
        setInitialScale(currentScale);
      } else if (e.touches.length === 1) {
        // pan 시작
        setOffset((prev) => ({
          ...prev,
          lastX: e.touches[0].clientX,
          lastY: e.touches[0].clientY,
          isPanning: true,
        }));
      }
    }

    function handleTouchMove(e: TouchEvent) {
      console.log('handleTouchMove', e.touches.length);
      // popover 떠있는 경우 터치 이벤트 무시
      const targetEl = e.target as HTMLElement;
      if (targetEl.closest('.hogak-popover')) {
        return;
      }

      if (e.touches.length === 2) {
        // pinch 중
        e.preventDefault();
        const dist = getDistance(e.touches[0], e.touches[1]);
        if (initialPinchDistance === 0) return;

        const oldScale = currentScale;
        let newScale = (dist / initialPinchDistance) * initialScale;

        // 최소/최대 배율
        if (newScale < 1) {
          newScale = 1;
        } else if (newScale > 5) {
          newScale = 5;
        }

        // scale 변경이 있으면 offset도 비율에 따라 보정 + clamp
        if (newScale !== oldScale) {
          const ratio = newScale / oldScale;
          setOffset((prev) => {
            let nextOffsetX = prev.offsetX * ratio;
            let nextOffsetY = prev.offsetY * ratio;

            // 이동 범위(clamp) 계산
            const maxOffsetX = (size.width * newScale) / 2 - size.width / 2;
            const maxOffsetY = (size.height * newScale) / 2 - size.height / 2;

            if (maxOffsetX > 0) {
              nextOffsetX = Math.max(-maxOffsetX, Math.min(nextOffsetX, maxOffsetX));
            } else {
              nextOffsetX = 0;
            }
            if (maxOffsetY > 0) {
              nextOffsetY = Math.max(-maxOffsetY, Math.min(nextOffsetY, maxOffsetY));
            } else {
              nextOffsetY = 0;
            }

            return {
              ...prev,
              offsetX: nextOffsetX,
              offsetY: nextOffsetY,
            };
          });
          setCurrentScale(newScale);
        }
      }
      else if (e.touches.length === 1) {
        // pan 중
        e.preventDefault();

        setOffset((prev) => {
          if (!prev.isPanning) return prev;

          const deltaX = e.touches[0].clientX - prev.lastX;
          const deltaY = e.touches[0].clientY - prev.lastY;

          let nextOffsetX = prev.offsetX + deltaX;
          let nextOffsetY = prev.offsetY + deltaY;

          // 이동 가능 범위(clamp)
          const maxOffsetX = (size.width * currentScale) / 2 - size.width / 2;
          const maxOffsetY = (size.height * currentScale) / 2 - size.height / 2;

          if (maxOffsetX > 0) {
            nextOffsetX = Math.max(-maxOffsetX, Math.min(nextOffsetX, maxOffsetX));
          } else {
            nextOffsetX = 0;
          }

          if (maxOffsetY > 0) {
            nextOffsetY = Math.max(-maxOffsetY, Math.min(nextOffsetY, maxOffsetY));
          } else {
            nextOffsetY = 0;
          }

          console.log('handleTouchMove (move)', {
            nextOffsetX,
            nextOffsetY,
            currentScale,
          });

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
      console.log('handleTouchEnd', e.touches.length);
      // popover 떠있는 경우 터치 이벤트 무시
      const targetEl = e.target as HTMLElement;
      if (targetEl.closest('.hogak-popover')) {
        return;
      }
      
      if (e.touches.length < 2) {
        // pinch 종료
        setInitialPinchDistance(0);
      }
      if (e.touches.length === 0) {
        // pan 종료
        setOffset((prev) => ({
          ...prev,
          isPanning: false,
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
  }, [videoRef, initialPinchDistance, initialScale, currentScale, size.width, size.height]);

  // ─────────────────────────────────────────
  // (2) 휠 이벤트 (Wheel Zoom)
  // ─────────────────────────────────────────
  useEffect(() => {
    const container = videoRef.current;
    if (!container) return;

    function handleWheel(e: WheelEvent) {
      e.preventDefault();

      const oldScale = currentScale;
      const deltaScale = -e.deltaY * 0.001;
      let newScale = oldScale + deltaScale;

      // 최소/최대 배율
      if (newScale < 1) {
        newScale = 1;
      } else if (newScale > 5) {
        newScale = 5;
      }

      // 배율 변경 시 offset 재조정 (비율 곱 + clamp)
      if (newScale !== oldScale) {
        const ratio = newScale / oldScale;
        setOffset((prev) => {
          let nextOffsetX = prev.offsetX * ratio;
          let nextOffsetY = prev.offsetY * ratio;

          const maxOffsetX = (size.width * newScale) / 2 - size.width / 2;
          const maxOffsetY = (size.height * newScale) / 2 - size.height / 2;

          if (maxOffsetX > 0) {
            nextOffsetX = Math.max(-maxOffsetX, Math.min(nextOffsetX, maxOffsetX));
          } else {
            nextOffsetX = 0;
          }
          if (maxOffsetY > 0) {
            nextOffsetY = Math.max(-maxOffsetY, Math.min(nextOffsetY, maxOffsetY));
          } else {
            nextOffsetY = 0;
          }

          return {
            ...prev,
            offsetX: nextOffsetX,
            offsetY: nextOffsetY,
          };
        });
        setCurrentScale(newScale);
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [videoRef, currentScale, size.width, size.height]);

  // 직접 배율 지정
  function setScale(scale: number) {
    setCurrentScale(scale);
  }

  // 직접 offset 지정
  function setCurrentOffset(x: number, y: number) {
    setOffset((prev) => ({
      ...prev,
      offsetX: x,
      offsetY: y,
    }));
  }

  return { offset, size, currentScale, setScale, setCurrentOffset };
}
