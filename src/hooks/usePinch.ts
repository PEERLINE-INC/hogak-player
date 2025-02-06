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

export default function usePinch(
  videoRef: React.RefObject<HTMLDivElement>,
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

  // video 엘리먼트에 transform 스타일을 적용하는 헬퍼 함수
  const applyTransform = () => {
    if (videoRef.current) {
      const [video] = videoRef.current.getElementsByTagName('video');
      if (!video) return;
      video.style.transform = `translate(${offset.offsetX}px, ${offset.offsetY}px) scale(+${currentScale}, ${currentScale})`;
    }
  };

  useEffect(() => {
    applyTransform();
  }, [offset, currentScale]);

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
      console.log('handleTouchStart', e.touches.length);
      // (1) 두 손가락 → pinch
      if (e.touches.length === 2) {
        const dist = getDistance(e.touches[0], e.touches[1]);
        setInitialPinchDistance(dist);
        setInitialScale(currentScale);
      }
      // (2) 한 손가락 → pan
      else if (e.touches.length === 1) {
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
      console.log('handleTouchMove', e.touches.length);
      // (1) 두 손가락: pinch
      if (e.touches.length === 2) {
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
        } else {
          // 최대 배율은 5
          if (newScale > 5) {
            newScale = 5;
          }
        }

        setCurrentScale(newScale);
      }
      // (2) 한 손가락: move (누적 이동)
      else if (e.touches.length === 1) {
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

          // 컨테이너 범위를 초과할 수 없음
          const maxOffsetX = (size.width * currentScale) / 2 - (size.width / 2);
          const maxOffsetY = (size.height * currentScale) / 2 - (size.height / 2);
          if (Math.abs(nextOffsetX) > maxOffsetX) {
            return prev;
          }
          if (Math.abs(nextOffsetY) > maxOffsetY) {
            return prev;
          }

          // 절대 좌표로 이동
          console.log('handleTouchMove (move)', nextOffsetX, nextOffsetY, currentScale);

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
      // pinch 종료
      if (e.touches.length < 2) {
        setInitialPinchDistance(0);
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
    initialPinchDistance,
    initialScale,
  ]);

  useEffect(() => {
    const container = videoRef.current;
    if (!container) return;

    function handleWheel(e: WheelEvent) {
      e.preventDefault();
      console.log('handleWheel', e.deltaY);

      // deltaY (+) -> 스크롤 내림 -> 보통 배율 축소
      // deltaY (-) -> 스크롤 올림 -> 보통 배율 확대
      // 원하는 로직에 따라 반대 설정 가능
      const deltaScale = -e.deltaY * 0.001; 
      // 값이 너무 크거나 작다면 상수 조정 (예: 0.001 -> 0.005 등)

      let newScale = currentScale + deltaScale;

      // 최소 배율 1
      if (newScale < 1) {
        newScale = 1;
        // 배율이 1이 되면 위치도 (0,0)으로 리셋
        setOffset((prev) => ({
          ...prev,
          offsetX: 0,
          offsetY: 0,
        }));
      }

      setCurrentScale(newScale);
    }

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [videoRef, currentScale]);

  function setScale(scale: number) {
    setCurrentScale(scale);
  }

  function setCurrentOffset(x: number, y: number) {
    setOffset((prev) => ({
      ...prev,
      offsetX: x,
      offsetY: y,
    }));
  }

  return { offset, size, currentScale, setScale, setCurrentOffset }; 
}
