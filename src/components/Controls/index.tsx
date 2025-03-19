import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import * as Slider from '@radix-ui/react-slider'
import ArrowLeftIcon from '../../assets/icons/icon_arrow_left_white.svg?react'
import CloseIcon from '../../assets/icons/icon_close.svg?react'
import PlayIcon from '../../assets/icons/vod_play.svg?react'
import PauseIcon from '../../assets/icons/vod_pause.svg?react'
import VolumeIcon from '../../assets/icons/icon_volume.svg?react'
import VolumeMuteIcon from '../../assets/icons/icon_volume_mute.svg?react'
import MultiViewIcon from '../../assets/icons/icon_multiview.svg?react'
import FullScreenIcon from '../../assets/icons/icon_fullscreen.svg?react'
import FullScreenExitIcon from '../../assets/icons/icon_fullscreen_exit.svg?react'
import TagViewIcon from '../../assets/icons/icon_tag_white.svg?react'
import RedMarkerIcon from '../../assets/icons/mark_red.svg?react'
import AirPlayIcon from '../../assets/icons/icon_airplay.svg?react'
import { createPlayerStore } from '../../store/playerStore'
import { PlayTime } from '../PlayTime'
import './styles.css'
import useMultiViewStore from '../../store/multiViewStore'
import useTagStore from '../../store/tagViewStore'
import ScreenCastIcon from '../../assets/icons/icon_screencast.svg?react'
import ClipIcon from '../../assets/icons/icon_clip_white.svg?react'
//import PlayControlIcon from '../../assets/icons/icon_play_control.svg?react';
//import SpeedControlIcon from '../../assets/icons/icon_speed_control.svg?react';
import useClipStore from '../../store/clipViewStore'
import Player from 'video.js/dist/types/player'
import Dropdown from '../Dropdown' /* 250113 드롭다운 추가 */
import useLiveStore from '../../store/liveStore'
import useAdStore from '../../store/adStore'
import useQualityStore from '../../store/qualityStore'
import { isSafari, isSupportAirplay } from '../../util/common'

interface ControlsProps {
  playerStore: ReturnType<typeof createPlayerStore>
  playerRef: React.RefObject<Player | null>
  airplayRef: React.RefObject<{
    start: () => void
  } | null>
  chromecastRef: React.RefObject<{
    start: () => void
  } | null>
  onBack?: () => void
  onClickTagButton?: () => void
  seekTo: (seconds: number, type: 'seconds' | 'fraction') => void
  seekToLive: () => void
  onPlayCallback?: () => void
}

export function Controls(props: ControlsProps) {
  const { playerRef, airplayRef, chromecastRef, onBack, onClickTagButton, seekTo, seekToLive, onPlayCallback } = props;

  const playerStore = props.playerStore;
  const url = playerStore((state) => state.url)
  const title = playerStore((state) => state.title)
  const isDisablePlayer = playerStore((state) => state.isDisablePlayer)
  //const pip = usePlayerStore((state) => state.pip); 241224 PIP 버튼 주석
  // const setPip = usePlayerStore((state) => state.setPip) 241224 PIP 버튼 주석;
  const isPlay = playerStore((state) => state.isPlay)
  const setIsPlay = playerStore((state) => state.setIsPlay)
  const isSeek = playerStore((state) => state.isSeek)
  const setIsSeek = playerStore((state) => state.setIsSeek)
  const duration = playerStore((state) => state.duration)
  const played = playerStore((state) => state.played)
  const setPlayed = playerStore((state) => state.setPlayed)
  const volume = playerStore((state) => state.volume)
  const setVolume = playerStore((state) => state.setVolume)
  const isFullScreen = playerStore((state) => state.isFullScreen)
  const setIsFullScreen = playerStore((state) => state.setIsFullScreen)
  const setIsShowMultiView = playerStore((state) => state.setIsShowMultiView)
  const multiViewSources = useMultiViewStore((state) => state.multiViewSources)
  const tags = useTagStore((state) => state.tags)
  const isShowClipView = playerStore((state) => state.isShowClipView)
  const setIsShowClipView = playerStore((state) => state.setIsShowClipView)
  const setCurrentSeconds = useClipStore((state) => state.setCurrentSeconds)
  const backIconType = playerStore((state) => state.backIconType)
  const isViewThumbMarker = playerStore((state) => state.isViewThumbMarker)
  const speed = playerStore((state) => state.speed)
  const setSpeed = playerStore((state) => state.setSpeed)
  const setIsShowTagSaveView = playerStore((state) => state.setIsShowTagSaveView)
  const isShowTagSaveView = playerStore((state) => state.isShowTagSaveView)
  const isDisableClip = playerStore((state) => state.isDisableClip)
  const isDisableTag = playerStore((state) => state.isDisableTag)
  const isDisableMultiView = playerStore((state) => state.isDisableMultiView)
  const isLive = playerStore((state) => state.isLive)
  const isPlayAd = useAdStore((state) => state.isPlayAd)
  const atLive = useLiveStore((state) => state.atLive)
  const isMute = playerStore((state) => state.isMute)
  const setIsMute = playerStore((state) => state.setIsMute)
  const enableLeftRightArrowButton = playerStore((state) => state.enableLeftRightArrowButton)
  const onClickLeftArrowButton = playerStore((state) => state.onClickLeftArrowButton)
  const onClickRightArrowButton = playerStore((state) => state.onClickRightArrowButton)
  const isShowChromecastButton = playerStore((state) => state.isShowChromecastButton)
  const isShowErrorView = playerStore((state) => state.isShowErrorView)
  // 드래그 중 임시로 써 줄 로컬 state
  const [timeSliderValue, setTimeSliderValue] = useState(played * 100)
  const [isOverlayVisible, setOverlayVisible] = useState(true)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [lastTapTime, setLastTapTime] = useState<number | null>(null)
  const [isShowSpeedDropdown, setIsShowSpeedDropdown] = useState(false)
  const [isShowQualityDropdown, setIsShowQualityDropdown] = useState(false)
  const [hasFirstUserInteraction, setHasFirstUserInteraction] = useState(false)
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const setSkipDirection = playerStore((state) => state.setSkipDirection)
  // 자동 숨김 타이머를 제어하기 위한 ref
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Quality
  const qualityLevels = useQualityStore((state) => state.qualityLevels)
  const currentQuality = useQualityStore((state) => state.currentQuality)

  const getCurrentTime = () => {
    return isSeek ? (duration * timeSliderValue) / 100 : duration * played
  }

  useEffect(() => {
    const checkPointerType = () => {
      if (window.matchMedia('(pointer: coarse)').matches) {
        setIsTouchDevice(true)
      } else {
        setIsTouchDevice(false)
      }
    }

    checkPointerType()
    window.addEventListener('resize', checkPointerType)
    return () => {
      window.removeEventListener('resize', checkPointerType)
    }
  }, [])

  useEffect(() => {
    // 드래그 중이면 store 갱신 무시
    if (isSeek) return
    setTimeSliderValue(played * 100)
  }, [played, isSeek])

  useEffect(() => {
    const player = playerRef.current
    if (!player) return

    const handleSeeked = () => {
      console.log('player has finished seeking')
      setIsSeek(false)
    }

    // https://docs.videojs.com/player#event:seeked
    player.on('seeked', handleSeeked)

    return () => {
      player.off('seeked', handleSeeked)
    }
  }, [playerRef, setIsSeek])

  // === 자동 숨김 타이머 설정 로직 ===
  // isOverlayVisible가 true일 때 일정 시간(예: 3초) 후 자동으로 숨김
  useEffect(() => {
    // 모바일/터치 디바이스가 아닐 경우(데스크톱)는 기존 마우스 로직 사용하므로 패스
    if (!isTouchDevice) return
    if (!isOverlayVisible) return
    if (isSeek) return
    if (isShowSpeedDropdown || isShowQualityDropdown) return
    if (!hasFirstUserInteraction) return

    // 먼저 기존 타이머가 있으면 클리어
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }

    hideTimerRef.current = setTimeout(() => {
      setOverlayVisible(false)
    }, 3000)

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current)
        hideTimerRef.current = null
      }
    }
  }, [
    isOverlayVisible,
    isTouchDevice,
    isSeek,
    isShowSpeedDropdown,
    isShowQualityDropdown,
    hasFirstUserInteraction,
  ])

  // 라이브 시간과 현재 시간이 근접할 때 속도를 1로 설정
  useEffect(() => {
    if (atLive) {
      setSpeed(1)
    }
  }, [atLive])

  useEffect(() => {
    if (isPlay) {
      setHasFirstUserInteraction(true);

      if (!isTouchDevice && !hasFirstUserInteraction) {
        setTimeout(() => {
          setOverlayVisible(false)
        }, 3000);
      }
    }
  }, [isPlay])

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      setOverlayVisible(true)
      setHasFirstUserInteraction(true);
    }
  }

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setOverlayVisible(false)
      setHasFirstUserInteraction(true);
    }
  }

  // === 모바일 환경에서 한 번 터치할 때마다 오버레이 토글 ===
  const handleTouchOverlay = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log('handleTouchOverlay', e.target, e.currentTarget)
    setHasFirstUserInteraction(true)
    const targetElement = e.target as HTMLElement
    const currentTargetElement = e.currentTarget as HTMLElement
    const now = performance.now()
    const isDoubleTap = lastTapTime && now - lastTapTime < 300 // 300ms 안에 다시 탭하면 더블 탭으로 판단

    if (isDoubleTap) {
      // 광고 중 스킵 방지
      if (isPlayAd) return

      // 더블 탭이면 1) 단일 탭 타이머 해제
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current)
        tapTimerRef.current = null
      }

      // 2) 좌/우 영역 판별
      // offsetX: 현재 요소 내에서 터치한 위치(왼쪽 기준)
      // clientWidth: 현재 요소의 전체 너비
      const { offsetX } = e.nativeEvent
      const { clientWidth } = e.currentTarget

      if (offsetX < clientWidth / 2) {
        // 왼쪽 영역 -> 10초 뒤로
        if (playerRef.current) {
          const currentTime = playerRef.current.currentTime() ?? 0
          seekTo(currentTime - 10, 'seconds')
          setSkipDirection('left')
        }
      } else {
        // 오른쪽 영역 -> 10초 앞으로
        if (playerRef.current) {
          const currentTime = playerRef.current.currentTime() ?? 0
          seekTo(currentTime + 10, 'seconds')
          setSkipDirection('right')
        }
      }

      // 0.6초 뒤에 스킵 메시지 숨기기
      setTimeout(() => {
        setSkipDirection(null)
      }, 600)

      // 마지막 탭 시간 초기화
      setLastTapTime(null)
    } else {
      setLastTapTime(now)
      // 300ms 안에 두 번째 탭이 발생하지 않으면 단일 탭으로 처리
      tapTimerRef.current = setTimeout(() => {
        setLastTapTime(null)
        tapTimerRef.current = null

        // 만약 부모 래퍼를 직접 터치했다면
        if (
          targetElement.classList.contains('controls-wrapper') &&
          currentTargetElement.classList.contains('controls-wrapper')
        ) {
          console.log('overlay toggle')
          // 오버레이 토글
          setOverlayVisible((prev) => !prev)
        }
      }, 300)
    }
  }

  const handleSeekChange = ([value]: number[]) => {
    console.log('handleSeekChange')

    // 광고 중에는 seek 불가
    if (isPlayAd) return
    if (!isOverlayVisible) return
    if (isDisablePlayer) return

    setIsSeek(true)
    setTimeSliderValue(value)
  }

  const handleSeekCommit = ([value]: number[]) => {
    // console.log('handleSeekCommit');

    // 광고 중에는 seek 불가
    if (isPlayAd) return
    if (!isOverlayVisible) return
    if (isDisablePlayer) return

    const fraction = value / 100
    seekTo(fraction, 'fraction')
    setPlayed(fraction)
  }

  const handleSeekMouseUp = () => {
    console.log('handleSeekMouseUp')
    // setIsSeek(false)
  }
  const handleSeekMouseDown = () => {
    console.log('handleSeekMouseDown')
    // setIsSeek(true)
  }
  const handleTagClick = (seconds: number) => {
    if (isDisablePlayer) return

    if (playerRef.current) {
      if (isOverlayVisible) {
        seekTo(seconds, 'seconds')
      }
    } else {
      console.warn('playerRef is null, cannot seek')
    }
  }

  const handleClickClip = () => {
    console.log('handleClickClip')
    if (isDisablePlayer) return

    setIsPlay(false)
    setCurrentSeconds(playerRef.current?.currentTime() ?? 0)
    setIsShowClipView(true)
  }

  const handleClickTag = () => {
    if (isDisablePlayer) return

    setIsPlay(false)
    if (isFullScreen) {
      setIsShowTagSaveView(true)
    }

    onClickTagButton?.()
  }

  const handleClickPlay = () => {
    if (isPlayAd) return;
    if (isDisablePlayer) {
      onPlayCallback?.();
      return;
    }

    setIsPlay(!isPlay)
  }

  const handleVolumeChange = (value: number[]) => {
    const [vol] = value;
    setVolume(vol)
  }

  const handleChangeQuality = (option: any) => {
    console.log('handleChangeQuality', option)
    if (isSafari()) {
      return
    }
    const quality = option.value
    // @ts-ignore
    const qualityList = playerRef.current?.qualityLevels()
    for (let i = 0; i < qualityList.length; ++i) {
      const { height } = qualityList[i]
      qualityList[i].enabled = height === quality
    }
  }

  const handleClickScreencast = () => {
    if (isDisablePlayer) return

    if (chromecastRef.current) {
      chromecastRef.current.start()
    }
  }

  const handleClickAirplay = () => {
    if (isDisablePlayer) return

    if (airplayRef.current) {
      airplayRef.current.start()
    }
  }

  const isShowScreencastButton = isSupportAirplay()
  const isPanorama = multiViewSources.some((source) => source.isPanorama && source.url === url)
  const getOptions = () => {
    if (isPanorama) {
      return [{ value: 1080, label: 'PANO' }]
    }
    
    if (isSafari()) {
      return [
        { value: 720, label: '720p' },
        { value: 1080, label: '1080p', tag: 'HD' },
      ]
    }

    return qualityLevels.map((level) => {
      // console.log('level', level);

      return {
        value: level.height,
        label: `${level.height}p`,
        tag: level.height >= 1080 ? 'HD' : '',
      }
    })
  }

  return (
    <ControlsWrapper
      className='controls-wrapper'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={isTouchDevice ? handleTouchOverlay : undefined}
      $isOverlayVisible={isOverlayVisible || isShowTagSaveView}
    >
      <ControlsContainer
        className='controls-wrapper'
        $isOverlayVisible={isOverlayVisible || isShowTagSaveView}
      >
        {/* 250306 윤영민 변경 */}
        <TopContainer
          className='controls-wrapper'
          style={{ position: 'relative' }}
        >
          <FlexRow
            style={{ width: 'calc(100% - 13em' }}
            className='controls-wrapper'
          >
            <IconButton
              onClick={() => {
                if (isFullScreen) {
                  setIsFullScreen(false)
                }

                // onBack 콜백 함수가 존재하면 실행
                if (onBack) {
                  onBack()
                }
              }}
              className='back_btn'
            >
              {backIconType === 'close' ? (
                <CloseIcon
                  width={'100%'}
                  height={'100%'}
                />
              ) : (
                <ArrowLeftIcon
                  width={'100%'}
                  height={'100%'}
                />
              )}
            </IconButton>
            {/* 241224 스타일 삭제 및 video_title 클래스 추가 */}
            <div className='video_title' /* style={{ color: 'white', marginLeft: 16 }} */>
              {title}
            </div>
          </FlexRow>

          {/* 250306 윤영민 변경 */}
          <FlexRow
            gap={16}
            className='icon_box multi_box'
          >
            {!isFullScreen && !isDisableTag && (
              <IconButton
                className='tag_btn'
                onClick={handleClickTag}
              >
                <TagViewIcon />
              </IconButton>
            )}
            {isShowChromecastButton && (
              <IconButton
                className='screencast_btn'
                onClick={handleClickScreencast}
              >
                <ScreenCastIcon />
              </IconButton>
            )}
            {isShowScreencastButton && (
              <IconButton
                className='airplay_btn'
                onClick={handleClickAirplay}
              >
                <AirPlayIcon />
              </IconButton>
            )}
            {multiViewSources.length && !isDisableMultiView && (
              <IconButton
                onClick={() => {
                  if (isDisablePlayer) return
                  setIsShowMultiView(true)
                }}
                className='multiview_btn'
              >
                <MultiViewIcon />
              </IconButton>
            )}
          </FlexRow>
        </TopContainer>

        <MiddleContainer className='controls-wrapper'>
          {/* 250225 좌우 버튼 추가 */}
          <PlayBtnContainer
            className='controls-wrapper'
            style={{ width: '100%' }}
          >
            <FlexRow
              className='controls-wrapper'
              style={{ justifyContent: 'center' }}
            >
              {enableLeftRightArrowButton && (
                <IconButton
                  style={{ marginRight: 'auto', marginLeft: '5%', width: '1.4em', height: '2.4em' }}
                  onClick={() => {
                    if (isDisablePlayer) return
                    onClickLeftArrowButton()
                  }}
                >
                  <ArrowLeftIcon
                    width={'100%'}
                    height={'100%'}
                  />
                </IconButton>
              )}

              {/* 광고 중에는 재생/일시정지 버튼 비활성화 */}
              {!isShowErrorView && !isShowTagSaveView && (
                <IconButton
                  onClick={handleClickPlay}
                  className='play_btn'
                  style={{ opacity: isPlayAd ? 0.5 : 1 }}
                >
                  {isPlay ? <PauseIcon /> : <PlayIcon />}
                </IconButton>
              )}

              {enableLeftRightArrowButton && (
                <IconButton
                  style={{ marginLeft: 'auto', marginRight: '5%', width: '1.4em', height: '2.4em' }}
                  onClick={() => {
                    if (isDisablePlayer) return
                    onClickRightArrowButton()
                  }}
                >
                  <ArrowLeftIcon
                    width={'100%'}
                    height={'100%'}
                    style={{ transform: 'rotate(180deg)' }}
                  />
                </IconButton>
              )}
            </FlexRow>
          </PlayBtnContainer>
          {/* //241224 플레이 버튼 구조 변경 */}
          {/* 241224 side 아이콘 구조 변경 및 아이콘 이름 추가, 250113 클래스 추가 및 간격 수정 */}
          <FlexCol
            style={{ paddingRight: '1em', gap: '1.3em', zIndex: 1 }}
            className='icon_box'
          >
            {isFullScreen && !isShowClipView && !isShowTagSaveView && (
              <>
                {!isDisableClip && (
                  <FlexCol>
                    <IconButton
                      className='side_icon side_clip'
                      onClick={handleClickClip}
                    >
                      <ClipIcon />
                      <p className='side_icon_name'>클립</p>
                    </IconButton>
                  </FlexCol>
                )}
                {!isDisableTag && (
                  <FlexCol>
                    <IconButton
                      className='side_icon side_tag'
                      onClick={handleClickTag}
                    >
                      <TagViewIcon />
                      <p className='side_icon_name'>태그</p>
                    </IconButton>
                  </FlexCol>
                )}
              </>
            )}
          </FlexCol>
        </MiddleContainer>

        <BottomContainer $isFullScreen={isFullScreen}>
          <SliderContainer>
            <Slider.Root
              className='SliderRoot'
              style={{
                width: '100%',
                opacity: isPlayAd ? 0.5 : 1,
                pointerEvents: isPlayAd ? 'none' : 'auto',
              }}
              disabled={isDisablePlayer}
              value={[isSeek ? timeSliderValue : played * 100]}
              max={100}
              step={0.1}
              onPointerDown={handleSeekMouseDown}
              onPointerUp={handleSeekMouseUp}
              onValueChange={handleSeekChange}
              onValueCommit={handleSeekCommit}
            >
              <Slider.Track className='SliderTrack'>
                <Slider.Range className='SliderRange' />
              </Slider.Track>
              <Slider.Thumb
                className='SliderThumb'
                aria-label='Time'
              >
                {isViewThumbMarker && (
                  <AddTagMarker>
                    <RedMarkerIcon />
                  </AddTagMarker>
                )}
              </Slider.Thumb>
              {!isViewThumbMarker &&
                tags.map((tag, index) => {
                  const position = (tag.seconds / duration) * 100

                  return (
                    <TagMarker
                      key={index}
                      onClick={() => handleTagClick(tag.seconds)}
                      left={`${position}%`}
                    >
                      <img
                        src={tag.iconUrl}
                        style={{ width: '100%' }}
                      />
                    </TagMarker>
                  )
                })}
            </Slider.Root>
          </SliderContainer>
          <ControlBox>
            <FlexRow>
              {isLive ? (
                <LiveContainer
                  $isAtLive={atLive}
                  onClick={atLive ? undefined : () => seekToLive()}
                >
                  <LiveDot $isAtLive={atLive} />
                  <span>LIVE</span>
                </LiveContainer>
              ) : (
                <>
                  <PlayTime seconds={getCurrentTime()} testId='player-time-display-start' />
                  <span
                    style={{
                      color: 'white',
                      fontSize: '1.4em',
                      paddingLeft: '0.5em',
                      paddingRight: '0.5em',
                    }}
                  >
                    {' '}
                    /{' '}
                  </span>
                  <PlayTime seconds={duration} testId='player-time-display-end' />
                </>
              )}
            </FlexRow>
            <FlexRow
              gap={16}
              className='icon_box'
            >
              {/* 250113 간격수정 및 클래스 추가 */}
              {/* <IconButton className='play_control_btn'>
                <PlayControlIcon/>
              </IconButton>
              <IconButton className='speed_control_btn'>
                <SpeedControlIcon/>
              </IconButton> */}
              {/* 250113 드롭다운 추가 */}
              <Dropdown
                onChangeValue={(option) => {
                  if (!isPlayAd) {
                    setSpeed(Number(option.value))
                  }
                }}
                options={[
                  { label: '2x', value: 2 },
                  { label: '1.75x', value: 1.75 },
                  { label: '1.5x', value: 1.5 },
                  { label: '1.25x', value: 1.25 },
                  { label: '1x', value: 1 },
                  { label: '0.5x', value: 0.5 },
                  { label: '0.25x', value: 0.25 },
                ]}
                defaultValue={speed}
                disabled={isPlayAd || isDisablePlayer}
                onChangeOpen={(isOpen) => {
                  setIsShowSpeedDropdown(isOpen)
                }}
              />
              <Dropdown
                onChangeValue={(option) => handleChangeQuality(option)}
                options={getOptions()}
                defaultValue={isPanorama ? 'PANO' : currentQuality}
                disabled={isPlayAd || isDisablePlayer}
                onChangeOpen={(isOpen) => {
                  setIsShowQualityDropdown(isOpen)
                }}
              />
              <FlexRow>
                <VolumeControlWrap>
                  <IconButton
                    className='volume_control_btn'
                    onClick={() => setIsMute(!isMute)}
                  >
                    {isMute ? <VolumeMuteIcon /> : <VolumeIcon />}
                  </IconButton>
                  <Slider.Root
                    className='SliderRoot'
                    value={[volume]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                  >
                    <Slider.Track className='SliderTrack'>
                      <Slider.Range className='SliderRange' />
                    </Slider.Track>
                    <Slider.Thumb
                      className='SliderThumb'
                      aria-label='Volume'
                    />
                  </Slider.Root>
                </VolumeControlWrap>
              </FlexRow>
              {/* 241224 PIP 버튼 주석
              {ReactPlayer.canEnablePIP(url) &&
                <button onClick={() => setPip(!pip)}>{pip ? 'PIP OFF' : 'PIP ON'}</button>
              } */}
              <IconButton
                className='full_screen_btn'
                onClick={() => {
                  if (isDisablePlayer) return
                  setIsFullScreen(!isFullScreen)
                }}
              >
                {isFullScreen ? <FullScreenExitIcon /> : <FullScreenIcon />}
              </IconButton>
            </FlexRow>
          </ControlBox>
        </BottomContainer>
      </ControlsContainer>
    </ControlsWrapper>
  )
}

const ControlsWrapper = styled.div<{ $isOverlayVisible: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  background-color: ${({ $isOverlayVisible }) =>
    $isOverlayVisible ? 'rgba(0, 0, 0, 0.6)' : 'transparent'};
  transition: background-color 0.3s ease;
`

const ControlsContainer = styled.div<{ $isOverlayVisible: boolean }>`
  display: grid;
  grid-template-rows: auto 1fr auto;
  /* 부모(ControlsWrapper)의 높이를 전부 차지 */
  flex: 1;
  height: 100%;

  opacity: ${({ $isOverlayVisible }) => ($isOverlayVisible ? 1 : 0)};
  transition: opacity 0.3s ease;
  pointer-events: ${({ $isOverlayVisible }) => ($isOverlayVisible ? 'auto' : 'none')};
`

const TopContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.2em 1.6em 0 1.6em;

  /* 241224 추가 */
  .video_title {
    color: #ffffff;
    font-size: 1.3em;
    margin-left: 0.8em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    width: 0;
  }
`

const MiddleContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const BottomContainer = styled.div<{ $isFullScreen: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-bottom: 0px !important;

  ${({ $isFullScreen }) =>
    $isFullScreen &&
    `
      /* 안전 영역 */
      padding-bottom: calc(env(safe-area-inset-bottom, 0px) / 2) !important;
    `}
`

const IconButton = styled.div`
  /* padding: 4px; 241224 삭제 */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  /* 241224 아이콘 스타일 추가 */
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
  &.airplay_btn {
    width: 2.1em;
    height: 1.9em;
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
  &.side_icon.side_clip svg {
    width: 1.7em;
    height: 1.7em;
  }
  &.side_icon.side_tag svg {
    width: 2em;
    height: 2em;
  }

  &.side_icon.side_clip,
  &.side_icon.side_tag {
    padding: 0.2em 0.4em;
  }

  &.play_control_btn {
    width: 1.8em;
    height: 1.8em;
  }
  &.speed_control_btn {
    width: 1.7em;
    height: 1.7em;
  }
  &.volume_control_btn {
    width: 1.8em;
    height: 1.8em;
  }
  &.full_screen_btn {
    width: 1.4em;
    height: 1.5em;
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
  /* 250113 추가 */
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
`

const SliderContainer = styled.div`
  // width: 100%;
  display: flex;
  align-items: center;
  padding: 0 1.6em 0 1.6em;
`

const ControlBox = styled.div`
  display: flex;
  padding: 0 1.6em 1.2em; /* 241224 padding em 단위로 수정 */
  align-items: center;
  justify-content: space-between;
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

  /* 250306 윤영민 변경 */
  &.multi_box {
    position: absolute;
    top: 23px;
    right: 23px;

    @media screen and (max-width: 540px) {
      position: static;
    }
  }
`

const FlexCol = styled.div<{ gap?: number }>`
  display: flex;
  flex-direction: column;
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

const TagMarker = styled.div.attrs<{ left: string }>((props) => ({
  style: {
    left: props.left,
  },
}))`
  width: 2.4em;
  height: 1.8em;
  position: absolute;
  top: -1.6em;
  transform: translateX(-50%);
  cursor: pointer;
`

const AddTagMarker = styled.div`
  z-index: 10;
  width: 2.4em;
  height: 1.8em;
  position: absolute;
  top: -2em;
  cursor: pointer;
`

const PlayBtnContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`
// const VolumeControlWrap = styled.div`
//   display: flex;
//   gap: 0;
//   .SliderRoot {
//     width: 0;
//     opacity: 0;
//     transition: all 0.3s ease;
//   }
//   .SliderThumb {
//     width: 0;
//   }
//   &:hover {
//     gap: .4em;
//     .SliderRoot {
//       width: 5em; /* 250113 수정 */
//       opacity: 1;
//     }
//     .SliderThumb {
//       width: 1.2em;
//     }
//   }
// `;

// 볼륨컨트롤 항상 보이게
const VolumeControlWrap = styled.div`
  display: flex;
  gap: 0.4em;
  .SliderRoot {
    width: 5em;
    opacity: 1;
  }
  .SliderThumb {
    width: 1.2em;
  }
`

const LiveDot = styled.div<{ $isAtLive: boolean }>`
  width: 0.8em;
  height: 0.8em;
  border-radius: 50%;
  margin-right: 0.5em;
  background-color: ${({ $isAtLive }) => ($isAtLive ? '#FF0000' : '#666666')};
  transition: background-color 0.2s ease;
`

const LiveContainer = styled.div<{ $isAtLive: boolean }>`
  display: flex;
  align-items: center;
  cursor: ${({ $isAtLive }) => ($isAtLive ? 'default' : 'pointer')};

  span {
    color: white;
    font-size: 1.4em;
    padding-right: 0.5em;
  }
`
