import React, { useState, useRef, useEffect } from "react";
import "./RangeSlider.css";
import { formatTime } from '../../util/common'


interface RangeSliderProps {
  
  value: [number, number];
  onChange?: (value: [number, number]) => void;
  onDragEnd?: (value: [number, number]) => void;
  onChangeEnd?: (value: [number, number]) => void;
  min?: number; // 선택 가능한 최소 range 값
  max?: number; // 선택 가능한 최대 range 값
  step?: number;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({

  
  value,
  onChange,
  onDragEnd,
  onChangeEnd,
  min = 0,
  max = 100,
  step = 1,
  played = 0,
  duration = 0
}) => {

  const [dragging, setDragging] = useState<"left" | "right" | "center" | null>(
    null
  );
  const [startX, setStartX] = useState(0);
  const [startPositions, setStartPositions] = useState([0, 0]);
  const [currentValue, setCurrentValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  const snapToStep = (value: number): number => {
    return Math.round(value / step) * step;
  };

  const handleStart = (
    clientX: number,
    handle: "left" | "right" | "center"
  ) => {
    setDragging(handle);
    setStartX(clientX);
    setStartPositions([...currentValue]);
  };

  const handleMove = (clientX: number) => {
    if (!dragging || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const diff = clientX - startX;
    const percentDiff = (diff / rect.width) * 100;
    const stepDiff = snapToStep(percentDiff);

    const newValue = [...currentValue] as [number, number];
    let shouldUpdate = true;

    if (dragging === "left") {
      const newLeft = snapToStep(startPositions[0] + stepDiff);
      const range = currentValue[1] - newLeft;
      if (newLeft >= 0 && newLeft <= 100 && range >= min && range <= max) {
        newValue[0] = newLeft;
      } else {
        shouldUpdate = false;
      }
    } else if (dragging === "right") {
      const newRight = snapToStep(startPositions[1] + stepDiff);
      const range = newRight - currentValue[0];
      if (newRight >= 0 && newRight <= 100 && range >= min && range <= max) {
        newValue[1] = newRight;
      } else {
        shouldUpdate = false;
      }
    } else if (dragging === "center") {
      const range = currentValue[1] - currentValue[0];
      let newLeft = snapToStep(startPositions[0] + stepDiff);
      let newRight = snapToStep(startPositions[1] + stepDiff);
      const newRange = newRight - newLeft;

      if (
        newLeft >= 0 &&
        newRight <= 100 &&
        newRange >= min &&
        newRange <= max
      ) {
        newValue[0] = newLeft;
        newValue[1] = newRight;
      } else {
        shouldUpdate = false;
      }
    }

    if (shouldUpdate) {
      setCurrentValue(newValue);
      onChange?.(newValue);
    }
    setStartX(clientX);
  };

  

  const handleEnd = () => {
    if (dragging) {
      onDragEnd?.(currentValue);
      onChangeEnd?.(currentValue);
    }
    setDragging(null);
  };

  // 마우스 이벤트 핸들러
  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    handle: "left" | "right" | "center"
  ) => {
    e.preventDefault();
    handleStart(e.clientX, handle);
  };

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // 터치 이벤트 핸들러
  const handleTouchStart = (
    e: React.TouchEvent<HTMLDivElement>,
    handle: "left" | "right" | "center"
  ) => {
    e.preventDefault();
    handleStart(e.touches[0].clientX, handle);
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [dragging]);

  const getPercentage = (value: number): number => {
    return value;
  };

  return (
    <div className="slider-container" ref={containerRef}>
      {/* 왼쪽 영역 */}
      <div
        className="slider-area left"
        style={{ width: `${getPercentage(currentValue[0])}%` }}
      />

      {/* 왼쪽 핸들 */}
      <div
        className="slider-handle left"
        style={{ left: `${getPercentage(currentValue[0])}%` }}
        onMouseDown={(e) => handleMouseDown(e, "left")}
        onTouchStart={(e) => handleTouchStart(e, "left")}
      />

      {/* 중앙 영역 */}
      <div
        className="slider-area center"
        style={{
          position: 'relative',
          left: `${getPercentage(currentValue[0])}%`,
          width: `${
            getPercentage(currentValue[1]) - getPercentage(currentValue[0])
          }%`,
        }}
        onMouseDown={(e) => handleMouseDown(e, "center")}
        onTouchStart={(e) => handleTouchStart(e, "center")}
      >
        <div style={{ width: '100%', position: 'absolute', top: '-20px', color: '#fff'}}>

          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between'}}>
            <div >{formatTime(min)}</div>
            <div >{formatTime(played * duration)}</div>
            <div >{formatTime(max)}</div>
          </div>
        </div>
      </div>

      {/* 오른쪽 핸들 */}
      <div
        className="slider-handle right"
        style={{ left: `${getPercentage(currentValue[1])}%` }}
        onMouseDown={(e) => handleMouseDown(e, "right")}
        onTouchStart={(e) => handleTouchStart(e, "right")}
      />

      {/* 오른쪽 영역 */}
      <div
        className="slider-area right"
        style={{
          left: `${getPercentage(currentValue[1])}%`,
          width: `${100 - getPercentage(currentValue[1])}%`,
          top: '0'
        }}
      />
    </div>
  );
};
