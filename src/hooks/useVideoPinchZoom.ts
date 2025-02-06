import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

function useVideoPinchZoom(playerRef: React.RefObject<HTMLDivElement | null>) {
  // 현재 스케일과 이동값을 refs로 관리 (상태 업데이트가 잦으므로 ref 사용)
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scaleRef = useRef<number>(1);
  const translateRef = useRef<Point>({ x: 0, y: 0 });
  const MAX_SCALE = 5;

  // 모바일 터치 관련 refs
  const lastTouchRef = useRef<Point | null>(null);         // panning 시 마지막 터치 좌표
  const pinchStartDistRef = useRef<number | null>(null);     // 두 손가락 터치 시작 시의 거리
  const pinchStartScaleRef = useRef<number>(1);              // 터치 시작 시의 스케일
  const pinchCenterRef = useRef<Point | null>(null);         // 두 손가락의 중심 좌표

  // 데스크톱 마우스 이동 관련 refs
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePositionRef = useRef<Point>({ x: 0, y: 0 });

  // video 엘리먼트에 transform 스타일을 적용하는 헬퍼 함수
  const applyTransform = () => {
    if (videoRef.current) {
      videoRef.current.style.transform = `translate(${translateRef.current.x}px, ${translateRef.current.y}px) scale(${scaleRef.current})`;
    }
  };

  useEffect(() => {
    if (!playerRef.current) return;
    const player = playerRef.current;
    const [ video ] = player.getElementsByTagName('video');
    if (!video) return;
    videoRef.current = video;
    // ================= 모바일 터치 이벤트 =================
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        // 두 손가락 터치 → 핀치 줌 시작
        const [touch1, touch2] = Array.from(e.touches);
        const dx = touch2.pageX - touch1.pageX;
        const dy = touch2.pageY - touch1.pageY;
        pinchStartDistRef.current = Math.hypot(dx, dy);
        pinchStartScaleRef.current = scaleRef.current;
        // 두 터치의 중심 좌표 계산
        pinchCenterRef.current = {
          x: (touch1.pageX + touch2.pageX) / 2,
          y: (touch1.pageY + touch2.pageY) / 2,
        };
      } else if (e.touches.length === 1) {
        // 한 손가락 터치 → (줌된 상태에서) 이동(panning) 시작
        lastTouchRef.current = { x: e.touches[0].pageX, y: e.touches[0].pageY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinchStartDistRef.current && pinchCenterRef.current) {
        // 두 손가락 터치 → 핀치 줌 진행
        const [touch1, touch2] = Array.from(e.touches);
        const dx = touch2.pageX - touch1.pageX;
        const dy = touch2.pageY - touch1.pageY;
        const currentDist = Math.hypot(dx, dy);
        // 새로운 스케일 계산 (최소 1, 최대 MAX_SCALE)
        let newScale = pinchStartScaleRef.current * (currentDist / pinchStartDistRef.current);
        newScale = Math.min(Math.max(newScale, 1), MAX_SCALE);
        const scaleChange = newScale / scaleRef.current;
        scaleRef.current = newScale;

        // 줌 중심을 기준으로 translate 값 조정 (줌 시 중심 좌표 고정)
        translateRef.current = {
          x: translateRef.current.x - (pinchCenterRef.current.x - translateRef.current.x) * (scaleChange - 1),
          y: translateRef.current.y - (pinchCenterRef.current.y - translateRef.current.y) * (scaleChange - 1),
        };

        applyTransform();
      } else if (e.touches.length === 1 && scaleRef.current > 1) {
        // 한 손가락 이동 → panning
        const currentTouch: Point = { x: e.touches[0].pageX, y: e.touches[0].pageY };
        if (lastTouchRef.current) {
          const deltaX = currentTouch.x - lastTouchRef.current.x;
          const deltaY = currentTouch.y - lastTouchRef.current.y;
          translateRef.current = {
            x: translateRef.current.x + deltaX,
            y: translateRef.current.y + deltaY,
          };
          lastTouchRef.current = currentTouch;
          applyTransform();
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      // 터치가 끝나면 관련 refs 초기화
      if (e.touches.length < 2) {
        pinchStartDistRef.current = null;
        pinchStartScaleRef.current = scaleRef.current;
        pinchCenterRef.current = null;
      }
      if (e.touches.length === 0) {
        lastTouchRef.current = null;
      }
    };

    player.addEventListener('touchstart', onTouchStart);
    player.addEventListener('touchmove', onTouchMove);
    player.addEventListener('touchend', onTouchEnd);
    player.addEventListener('touchcancel', onTouchEnd);

    // ================= 데스크톱 이벤트 =================
    // 마우스 휠로 줌
    const onWheel = (e: WheelEvent) => {
      // 기본 스크롤 동작 방지 (줌 전용)
      e.preventDefault();
      let newScale = scaleRef.current - e.deltaY * 0.01; // deltaY에 따른 스케일 변화율 (필요에 따라 조정)
      newScale = Math.min(Math.max(newScale, 1), MAX_SCALE);
      const scaleChange = newScale / scaleRef.current;
      scaleRef.current = newScale;

      // 마우스 커서 위치를 중심으로 줌 효과 적용
      const rect = video.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      translateRef.current = {
        x: translateRef.current.x - (mouseX - translateRef.current.x) * (scaleChange - 1),
        y: translateRef.current.y - (mouseY - translateRef.current.y) * (scaleChange - 1),
      };

      applyTransform();
    };

    // 마우스 드래그로 이동(panning)
    const onMouseDown = (e: MouseEvent) => {
      if (scaleRef.current > 1) {
        isDraggingRef.current = true;
        lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current && scaleRef.current > 1) {
        const deltaX = e.clientX - lastMousePositionRef.current.x;
        const deltaY = e.clientY - lastMousePositionRef.current.y;
        translateRef.current = {
          x: translateRef.current.x + deltaX,
          y: translateRef.current.y + deltaY,
        };
        lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
        applyTransform();
      }
    };

    const onMouseUp = (_e: MouseEvent) => {
      isDraggingRef.current = false;
    };

    player.addEventListener('wheel', onWheel, { passive: false });
    player.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Cleanup
    return () => {
      player.removeEventListener('touchstart', onTouchStart);
      player.removeEventListener('touchmove', onTouchMove);
      player.removeEventListener('touchend', onTouchEnd);
      player.removeEventListener('touchcancel', onTouchEnd);
      player.removeEventListener('wheel', onWheel);
      player.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [playerRef]);

  // (옵션) 줌/이동 상태를 리셋할 수 있는 함수
  const resetZoom = () => {
    scaleRef.current = 1;
    translateRef.current = { x: 0, y: 0 };
    if (videoRef.current) {
      videoRef.current.style.transform = 'translate(0px, 0px) scale(1)';
    }
  };

  return { resetZoom };
}

export default useVideoPinchZoom;
