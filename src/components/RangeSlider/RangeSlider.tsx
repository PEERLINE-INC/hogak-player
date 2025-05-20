import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { formatTime } from '../../util/common'
import i18next from '../../locales/i18n';

interface RangeSliderProps {
  value: number[]
  min: number
  max: number
  onChange?: (value: number[]) => void
  onDragStart?: (value: number[]) => void
  onDragEnd?: (value: number[]) => void
  onChangeEnd?: (value: number[]) => void
  minDistance?: number // 슬라이더 간의 최소 거리
  maxDistance?: number // 슬라이더 간의 최대 거리
  step?: number
  isPlayheadShow?: boolean
  playheadPercent?: number
}

// Styled Components
const Container = styled.div`
  &.slider-container {
    position: relative;
    width: 100%;
    height: calc(100% + 1.4em);
    margin: 0px auto 0;
    top: -0.7em;
    background-color: transparent;
    overflow: visible;
  }
`

const Area = styled.div`
  &.slider-area {
    position: absolute;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.74);
  }

  &.slider-area.center {
    background-color: transparent;
    border: 0.3em solid #81eb47;
    border-radius: 0.4em;
    box-sizing: border-box;
    cursor: grab;
    transition: background-color 0.2s;
  }

  &.slider-area.center:hover {
    background-color: rgba(129, 235, 71, 0.1);
  }
`

const Handle = styled.div`
  &.slider-handle {
    position: absolute;
    top: 50%;
    width: 1.2em;
    height: 100%;
    background-color: #81eb47;
    transform: translate(-50%, -50%);
    cursor: ew-resize;
    z-index: 1;
    transition: transform 0.2s;
  }

  &.slider-handle::after {
    width: 0.1em;
    height: 1.8em;
    position: absolute;
    content: '';
    background-color: #000;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &.slider-handle.left {
    border-radius: 0.4em 0 0 0.4em;
  }

  &.slider-handle.right {
    border-radius: 0 0.4em 0.4em 0;
  }

  &.slider-handle:hover {
    transform: translate(-50%, -50%) scale(1.05);
  }
`

const TimeLabelsWrapper = styled.div`
  width: 100%;
  position: absolute;
  top: -20px;
  color: #fff;
  overflow: visible;
`

// const TimeLabelsContainer = styled.div`
//   width: 100%;
//   display: flex;
//   justify-content: space-between;
//   white-space: nowrap;
// `
const TimeLabelsContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center; /* 가운데 고정 */
  align-items: center;
  padding: 0 1em; /* 가운데 레이블이 너무 붙지 않도록 여유 */
`;

const DragLabel = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 0 5px;
  white-space: nowrap;
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  font-size: 1.2em;
`;

const LeftLabel = styled(DragLabel)`
  left: 0;  /* 슬라이더 컨테이너 기준 왼쪽 고정 */
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
`;
const RightLabel = styled(DragLabel)`
  right: 0; /* 슬라이더 컨테이너 기준 오른쪽 고정 */
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
`;
const CenterLabel = styled.div`
  display: flex;
  position: relative;
  height: 100%;
  z-index: 4;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.2em;
`;

const PlayheadLine = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  width: 2px;
  background-color: white;
  border-radius: 20px;
  pointer-events: none;
  z-index: 3;
  box-shadow: 0px 0px 5px #444;
`

export const RangeSlider: React.FC<RangeSliderProps> = ({
  value,
  min,
  max,
  onChange,
  onDragStart,
  onDragEnd,
  onChangeEnd,
  minDistance = 0,
  maxDistance = 100,
  step = 1,
  isPlayheadShow = false,
  playheadPercent = 0,
}) => {
  const [dragging, setDragging] = useState<'left' | 'right' | 'center' | null>(null)
  const [startX, setStartX] = useState(0)
  const [startPositions, setStartPositions] = useState([0, 0])
  const [currentValue, setCurrentValue] = useState(value)
  const containerRef = useRef<HTMLDivElement>(null)

  const snapToStep = (value: number): number => {
    return Math.round(value / step) * step
  }

  const handleStart = (clientX: number, handle: 'left' | 'right' | 'center') => {
    setDragging(handle)
    setStartX(clientX)
    setStartPositions([...currentValue])
    onDragStart?.(currentValue)
  }

  const handleMove = (clientX: number) => {
    if (!dragging || !containerRef.current) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()

    // 픽셀 기준 이동량
    const diffInPixels = clientX - startX
    // 실제 [min, max] 범위에서의 이동량
    const diffInValue = (diffInPixels / rect.width) * (max - min)
    // step에 맞춰 스냅
    const stepDiff = snapToStep(diffInValue)

    const newValue = [...currentValue]
    let shouldUpdate = true

    if (dragging === 'left') {
      const newLeft = snapToStep(startPositions[0] + stepDiff)
      const range = currentValue[1] - newLeft
      if (newLeft >= min && newLeft <= max && range >= minDistance && range <= maxDistance) {
        newValue[0] = newLeft
      } else {
        shouldUpdate = false
      }
    } else if (dragging === 'right') {
      const newRight = snapToStep(startPositions[1] + stepDiff)
      const range = newRight - currentValue[0]
      if (newRight >= min && newRight <= max && range >= minDistance && range <= maxDistance) {
        newValue[1] = newRight
      } else {
        shouldUpdate = false
      }
    } else if (dragging === 'center') {
      const rangeWidth = startPositions[1] - startPositions[0]
      let newLeft = snapToStep(startPositions[0] + stepDiff)
      let newRight = snapToStep(startPositions[1] + stepDiff)
      const newRange = newRight - newLeft

      // min, max 범위로 클램핑
      if (newLeft < min) {
        newLeft = min
        newRight = min + rangeWidth
      }
      if (newRight > max) {
        newRight = max
        newLeft = max - rangeWidth
      }

      if (newLeft >= min && newRight <= max && newRange >= minDistance && newRange <= maxDistance) {
        newValue[0] = newLeft
        newValue[1] = newRight
      } else {
        shouldUpdate = false
      }
    }

    if (shouldUpdate) {
      setCurrentValue(newValue)
      onChange?.(newValue)
    }
    setStartX(clientX)
  }

  const handleEnd = () => {
    if (dragging) {
      onDragEnd?.(currentValue)
      onChangeEnd?.(currentValue)
    }
    setDragging(null)
  }

  // 마우스 이벤트 핸들러
  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    handle: 'left' | 'right' | 'center'
  ) => {
    e.preventDefault()
    handleStart(e.clientX, handle)
  }

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault()
    handleMove(e.clientX)
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  // 터치 이벤트 핸들러
  const handleTouchStart = (
    e: React.TouchEvent<HTMLDivElement>,
    handle: 'left' | 'right' | 'center'
  ) => {
    e.preventDefault()
    handleStart(e.touches[0].clientX, handle)
  }

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault()
    handleMove(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    handleEnd()
  }

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [dragging])

  useEffect(() => {
    setCurrentValue([...value])
  }, [value])

  const getPercentage = (val: number) => {
    if (max === min) return 0
    return ((val - min) / (max - min)) * 100
  }

  return (
    <Container
      className='slider-container'
      ref={containerRef}
    >
      <Area
        className='slider-area left'
        style={{ width: `${getPercentage(currentValue[0])}%` }}
      />

      <Handle
        className='slider-handle left'
        style={{ left: `${getPercentage(currentValue[0])}%` }}
        onMouseDown={(e) => handleMouseDown(e, 'left')}
        onTouchStart={(e) => handleTouchStart(e, 'left')}
      />

      <Area
        className='slider-area center'
        style={{
          position: 'relative',
          left: `${getPercentage(currentValue[0])}%`,
          width: `${getPercentage(currentValue[1]) - getPercentage(currentValue[0])}%`,
        }}
        onMouseDown={(e) => handleMouseDown(e, 'center')}
        onTouchStart={(e) => handleTouchStart(e, 'center')}
      >
        {isPlayheadShow && !dragging && <PlayheadLine style={{ left: `${playheadPercent}%` }} />}
        <TimeLabelsWrapper>
          <TimeLabelsContainer>
            {/* <div style={{ visibility: dragging === 'left' ? 'visible' : 'hidden', backgroundColor: 'gray', padding: '0 5px' }}>
              {formatTime(currentValue[0])}
            </div>
            <div>{`${Math.min(Math.floor(currentValue[1] - currentValue[0]), 60)} s`}</div>
            <div style={{ visibility: dragging === 'right' ? 'visible' : 'hidden', backgroundColor: 'gray', padding: '0 5px' }}>
              {formatTime(currentValue[1])}
            </div> */}
            <LeftLabel $isVisible={dragging === 'left'}>
              {formatTime(currentValue[0])}
            </LeftLabel>
            
            <RightLabel $isVisible={dragging === 'right'}>
              {formatTime(currentValue[1])}
            </RightLabel>
          </TimeLabelsContainer>
        </TimeLabelsWrapper>

        <CenterLabel>
          <span style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '0 5px', whiteSpace: 'nowrap' }}>
            {`${i18next.t('clip.seconds', {sec: Math.min(Math.round(currentValue[1] - currentValue[0]), 60)})}`}
          </span>
        </CenterLabel>
      </Area>

      <Handle
        className='slider-handle right'
        style={{ left: `${getPercentage(currentValue[1])}%` }}
        onMouseDown={(e) => handleMouseDown(e, 'right')}
        onTouchStart={(e) => handleTouchStart(e, 'right')}
      />

      <Area
        className='slider-area right'
        style={{
          left: `${getPercentage(currentValue[1])}%`,
          width: `${100 - getPercentage(currentValue[1])}%`,
          top: '0',
        }}
      />
    </Container>
  )
}
