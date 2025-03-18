import styled from 'styled-components'
import CancelIcon from '../../assets/icons/icon_cancel.svg?react'
import SaveIcon from '../../assets/icons/icon_save.svg?react'
import ArrowLeftIcon from '../../assets/icons/icon_arrow_left_white.svg?react'
import { createPlayerStore } from '../../store/playerStore'
import useClipStore from '../../store/clipViewStore'
import './styles.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { RangeSlider } from '../RangeSlider/RangeSlider'

interface ClipViewPopoverProps {
  playerStore: ReturnType<typeof createPlayerStore>
  seekTo: (seconds: number, type: 'seconds' | 'fraction') => void
  onChangeClipDuration: (data: number[]) => void
  isShow: boolean
  setValuesRef?: React.MutableRefObject<((values: number[]) => void) | null>
  onSave?: () => void
}

function calculateClipRange(currentSeconds: number, duration: number) {
  const clipDuration = 90
  const totalClipRange = clipDuration * 2
  // 클립 시작점과 끝점 계산
  let start = currentSeconds - clipDuration
  let end = currentSeconds + clipDuration
  // 클립 범위 조정 (영상 길이 초과 방지)
  if (start < 0) {
    end = Math.min(totalClipRange, duration)
    start = 0
  } else if (end > duration) {
    start = Math.max(0, duration - totalClipRange)
    end = duration
  }

  console.log('calculateClipRange', { start, end })
  return { start, end }
}

type ClipThumbnailApiResponse = {
  result: {
    code: number
    message: string
  }
  thumbnailList: string[]
  echo: {
    eventID: string
    start: number
    end: number
  }
}

export const ClipViewPopover = (props: ClipViewPopoverProps) => {
  const { seekTo, isShow, onChangeClipDuration, setValuesRef, onSave } = props

  const playerStore = props.playerStore;
  const played = playerStore((state) => state.played)
  const duration = playerStore((state) => state.duration)
  const isPlay = playerStore((state) => state.isPlay)
  const setIsPlay = playerStore((state) => state.setIsPlay)
  const setIsShowClipView = playerStore((state) => state.setIsShowClipView)
  const isFullScreen = playerStore((state) => state.isFullScreen)
  const currentSeconds = useClipStore((state) => state.currentSeconds)
  const isLive = playerStore((state) => state.isLive)
  const eventId = useClipStore((state) => state.eventId)
  const clipApiHost = useClipStore((state) => state.clipApiHost)
  const isSeek = playerStore((state) => state.isSeek)

  const [values, setValues] = useState<number[]>([0, 30])
  const [min, setMin] = useState<number>(0)
  const [max, setMax] = useState<number>(180)
  const [images, setImages] = useState<string[]>([])

  // 현재 재생 위치를 %로 환산한 값
  const [playheadPercent, setPlayheadPercent] = useState(0)
  const [isPlayheadShow, setIsPlayheadShow] = useState(false)

  const fetchImages = async () => {
    try {
      console.log('fetch thumbnail images', { clipApiHost, eventId })

      if (!clipApiHost || !eventId) {
        console.log('not found clipApiHost or eventId')
        return
      }
      const url = `${clipApiHost.endsWith('/') ? clipApiHost.slice(0, -1) : clipApiHost}/media/thumbnail/list`
      const response = await axios.post<ClipThumbnailApiResponse>(url, {
        eventId,
        start: min,
        end: max,
      })
      const thumbnailList = response.data.thumbnailList

      // 이미지가 8개 이상이면 8개만 선택
      const selectedThumbnailList = thumbnailList.slice(0, 8)
      setImages(selectedThumbnailList)
    } catch (e) {
      console.error('클립 썸네일 조회 실패', e)
    }
  }

  useEffect(() => {
    if (!isShow) return
  
    const currentTime = played * duration
    const [start, end] = values;
    let fraction = (currentTime - start) / (end - start)
    if (fraction < 0) fraction = 0;
    if (fraction > 1) fraction = 1;

    // 오차 보정
    const percent = fraction * 100 - 4 * fraction;
  
    setPlayheadPercent(percent)
  }, [played, duration, min, max, values, isShow]);  

  useEffect(() => {
    setIsPlayheadShow(!isSeek && isPlay);
  }, [isPlay, isSeek]);

  useEffect(() => {
    if (!isShow) return
    fetchImages()
  }, [min, max, isShow])

  useEffect(() => {
    if (setValuesRef) {
      setValuesRef.current = (newValues: number[]) => {
        setValues(newValues)
        onChangeClipDuration([Math.floor(newValues[0]), Math.floor(newValues[1])])
      }
    }
  }, [setValuesRef, onChangeClipDuration])

  useEffect(() => {
    if (isLive) return
    console.log('useEffect', { currentSeconds, duration })
    // currentSeconds 중심으로 3분 범위 설정
    const { start, end } = calculateClipRange(currentSeconds, duration)
    const middleValue = (start + end) / 2

    setMin(start)
    setMax(end)
    setValues([middleValue - 30, middleValue + 30])
  }, [currentSeconds])

    useEffect(() => {
        if (isShow) {
            const [start, end] = values;
            const clipEndPlayed = end / duration;
            // console.log('played', { played, clipEndPlayed });
            if (played >= clipEndPlayed) {
                seekTo(start, "seconds");
            }
        }
    }, [played]);

    const handleDragStart = (value: number[]) => {
        console.log('handleDragStart', value)
        setIsPlay(false);
    }
    const handleDragEnd = (value: number[]) => {
        console.log('handleDragEnd', value)
        setIsPlay(true);
    }
    const handleAfterChange = (value: number[]) => {
        let [start, end] = value;
        if (end - start >= 60) {
            end = start + 60;
        }
        onChangeClipDuration([Math.floor(start), Math.floor(end)]);
        setValues([start, end]);
        seekTo(start, 'seconds');
      };
    const handleCancel = () => {
        setIsShowClipView(false);
        if (!isPlay) {
            setIsPlay(true);
        }
    };
    const handleSave = () => {
        handleCancel();
        onChangeClipDuration([Math.floor(values[0]), Math.floor(values[1])]);
        onSave?.();
    };

  return (
    <PopoverContainer
      $isShow={isShow}
      className='hogak-popover'
    >
      <TopContainer>
        {/* 250113 클래스 네임 추가 */}
        <FlexRow
          style={{ width: 'calc(100% - 10em' }}
          className='icon_box'
        >
          <IconButton
            onClick={handleCancel}
            className='back_btn'
          >
            <ArrowLeftIcon
              width={'100%'}
              height={'100%'}
            />
          </IconButton>
          <div className='video_title'></div>
        </FlexRow>
      </TopContainer>

      <MiddleContainer>
        {/* 250113 간격 수정 및 클래스 추가 */}
        <FlexCol
          style={{ paddingRight: '1em', gap: '1.3em' }}
          className='icon_box'
        >
          {isFullScreen && (
            <>
              <FlexCol>
                <IconButton
                  className='side_icon side_save'
                  onClick={handleSave}
                >
                  <SaveIcon />
                  <p className='side_icon_name'>저장</p>
                </IconButton>
              </FlexCol>
              <FlexCol>
                <IconButton
                  className='side_icon side_cancel'
                  onClick={handleCancel}
                >
                  <CancelIcon />
                  <p className='side_icon_name'>취소</p>
                </IconButton>
              </FlexCol>
            </>
          )}
        </FlexCol>
      </MiddleContainer>

      <ClipRangeWrap $isFullScreen={isFullScreen}>
        {/* <TimeLabelsContainer className='time-labels-container'>
          <TimeLabel className='left'>{formatTime(min)}</TimeLabel>
          <TimeLabel className='center'>{formatTime(played * duration)}</TimeLabel>
          <TimeLabel className='right'>{formatTime(max)}</TimeLabel>
        </TimeLabelsContainer> */}
        <ClipRangeWrapper>
          {/* 241227 추가 */}
          <ThumbnailTrack>
            {images.map((image, index) => (
              <Thumbnail
                key={index}
                url={image}
              />
            ))}

            {/* 241227 구조변경 */}
            <SliderWrap>
              {/* <ReactSlider

                                className="hogak-clip-slider"
                                thumbClassName="clip-thumb"
                                trackClassName="clip-track"
                                snapDragDisabled={true}
                                min={min}
                                max={max}
                                step={0.1}
                                value={values}
                                ariaLabel={['클립 시작', '클립 종료']}
                                ariaValuetext={state => `${formatTime(state.valueNow)}`}
                                renderThumb={(props) => <ClipThumb {...props}></ClipThumb>}
                                pearling
                                minDistance={10}
                                // onChange={handleOnChange}
                                onAfterChange={handleAfterChange}
                                onBeforeChange={handleBeforeChange}

                                /> */}
              <RangeSlider
                min={min}
                max={max}
                minDistance={10}
                maxDistance={60}
                step={0.1}
                value={[...values]}
                onChange={handleAfterChange}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                isPlayheadShow={isPlayheadShow}
                playheadPercent={playheadPercent}
              />
            </SliderWrap>
          </ThumbnailTrack>
        </ClipRangeWrapper>
        {/* {isPlayheadShow && <PlayheadLine style={{ left: `${playheadPercent}%` }} />} */}
      </ClipRangeWrap>
    </PopoverContainer>
  )
}

const PopoverContainer = styled.div<{ $isShow: boolean }>`
  display: ${(props) => (props.$isShow ? 'flex' : 'none')}; /* 상태에 따라 표시/숨김 */
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  flex-direction: column;
  justify-content: space-between;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.3);
`
const TopContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.2em 1.6em 0 1.6em;

  .video_title {
    color: #ffffff;
    font-size: 1.3em;
    margin-left: 0.8em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }
`

const MiddleContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
`

const IconButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &.back_btn {
    width: 1.4em;
    height: 2.4em;
  }
  &.tag_btn {
    width: 1.8em;
    height: 1.8em;
  }
  &.screencast_btn {
    width: 1.7em;
    height: 1.5em;
  }
  &.multiview_btn {
    width: 2em;
    height: 1.5em;
  }
  &.play_btn {
    width: 5em;
    height: 5em;
  }
  &.side_icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: auto;
    height: auto;
  }
  &.side_icon.side_save svg {
    width: 1.4em;
    height: 1.7em;
  }
  &.side_icon.side_cancel svg {
    width: 1.3em;
    height: 1.3em;
  }
  .side_icon_name {
    font-size: 1.1em;
    line-height: 1.6em;
    color: #ffffff;
    margin: 0;
  }
  svg {
    width: 100%;
    height: 100%;
  }
`
const FlexRow = styled.div<{ gap?: number }>`
  display: flex;
  align-items: center;
  gap: ${(props) => (props.gap ? props.gap * 0.1 : 0)}em; /* 241224 gap em 단위 수정 */
  /* 250113 추가 */
  &.icon_box {
    @media screen and (min-width: 390px) {
      font-size: 10.8334px;
    }
    @media screen and (min-width: 396px) {
      font-size: 11px;
    }
    @media screen and (min-width: 411px) {
      font-size: 11.4166px;
    }
    @media screen and (min-width: 412px) {
      font-size: 11.4444px;
    }
    /* iphone 6 Plus */
    @media screen and (min-width: 414px) {
      font-size: 11.5px;
    }
    /* iphone 12 Pro Max */
    @media screen and (min-width: 428px) {
      font-size: 11.8889px;
    }
    @media screen and (min-width: 432px) {
      font-size: 12px;
    }
    @media screen and (min-width: 468px) {
      font-size: 12.4px;
    }
    @media screen and (min-width: 504px) {
      font-size: 12.6px;
    }
    @media screen and (min-width: 540px) {
      font-size: 12.8px;
    }
  }
`

const FlexCol = styled.div<{ gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => (props.gap ? props.gap * 0.1 : 0)}em;
  /* 250113 추가 */
  &.icon_box {
    @media screen and (min-width: 390px) {
      font-size: 10.8334px;
    }
    @media screen and (min-width: 396px) {
      font-size: 11px;
    }
    @media screen and (min-width: 411px) {
      font-size: 11.4166px;
    }
    @media screen and (min-width: 412px) {
      font-size: 11.4444px;
    }
    /* iphone 6 Plus */
    @media screen and (min-width: 414px) {
      font-size: 11.5px;
    }
    /* iphone 12 Pro Max */
    @media screen and (min-width: 428px) {
      font-size: 11.8889px;
    }
    @media screen and (min-width: 432px) {
      font-size: 12px;
    }
    @media screen and (min-width: 468px) {
      font-size: 12.4px;
    }
    @media screen and (min-width: 504px) {
      font-size: 12.6px;
    }
    @media screen and (min-width: 540px) {
      font-size: 12.8px;
    }
  }
`

const ClipRangeWrap = styled.div<{ $isFullScreen: boolean }>`
  background-color: #000;
  width: 100%;
  height: 26%;
  min-height: 5.9em;
  /* 241227 추가 */
  overflow: visible;
  position: relative;
  box-sizing: border-box;

  margin-bottom: 0;

  /* iOS Safari 전용 스타일 */
  @supports (-webkit-touch-callout: none) {
    ${({ $isFullScreen }) =>
      $isFullScreen &&
      `
        margin-bottom: 29px;
        `}
  }
`
// 241227 추가
const ClipRangeWrapper = styled.div`
  height: 55%;
  position: relative;
  top: 20%;

  .slider-container {
    margin: 0;
  }
  .slider-area.center {
    background: transparent !important;
  }
  .slider-container::before {
    background-color: transparent;
  }
`
// 클립 슬라이더 선택 바
// const ClipThumb = styled.div`
//   /* 241227 수정 */
//   background-color: #81eb47;
//   width: 1.2em;
//   height: 100%;
//   color: white;
//   cursor: ew-resize;
//   text-indent: -9999px;
// `

// 썸네일 트랙
const ThumbnailTrack = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  gap: 1em;
`

// 썸네일 이미지
const Thumbnail = styled.div<{ url: string }>`
  flex: 1;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-image: url(${(props) => props.url});
`

// 241227 추가
const SliderWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .hogak-clip-slider {
    //241230 추가
    /* 전체화면일 때 */
    height: calc(100% + 0.6em);
    top: -0.3em;
    /* 전체화면 아닐 때 */
    height: calc(100% + 1.4em);
    top: -0.7em;
  }
`
// const TimeLabelsContainer = styled.div`
//   position: absolute;
//   width: 100%;
//   bottom: 5.5em;
//   z-index: 6;
// `

// const TimeLabel = styled.div`
//   position: absolute;
//   transform: translateX(-50%);
//   bottom: 100%;
//   /* margin-bottom: 0.5em; */

//   background: transparent;
//   color: #fff;
//   padding: 0px 8px;
//   border-radius: 4px;
//   font-size: 0.9em;
//   white-space: nowrap;
//   pointer-events: none;

//   &.left {
//     left: 0;
//     transform: translateX(0) translateY(0); /* 왼쪽 고정 */
//   }
//   &.center {
//     left: 50%;
//     transform: translateX(-50%);
//   }
//   &.right {
//     right: 0;
//     transform: translateX(0) translateY(0); /* 오른쪽 고정 */
//   }
// `
