import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as Slider from "@radix-ui/react-slider";
import ArrowLeftIcon from "../../assets/icons/icon_arrow_left_white.svg?react";
import CloseIcon from "../../assets/icons/icon_close.svg?react";
import PlayIcon from "../../assets/icons/vod_play.svg?react";
import PauseIcon from "../../assets/icons/vod_pause.svg?react";
import VolumeIcon from "../../assets/icons/icon_volume.svg?react";
import VolumeMuteIcon from "../../assets/icons/icon_volume_mute.svg?react";
import MultiViewIcon from "../../assets/icons/icon_multiview.svg?react";
import FullScreenIcon from "../../assets/icons/icon_zoom.svg?react";
import TagViewIcon from "../../assets/icons/icon_tag_white.svg?react";
import RedMarkerIcon from "../../assets/icons/mark_red.svg?react";
import usePlayerStore from '../../store/playerStore';
import { PlayTime } from '../PlayTime';
import './styles.css';
import useMultiViewStore from '../../store/multiViewStore';
import useTagStore from '../../store/tagViewStore';
import ScreenCastIcon from '../../assets/icons/icon_screencast.svg?react';
import ClipIcon from '../../assets/icons/icon_clip_white.svg?react';
//import PlayControlIcon from '../../assets/icons/icon_play_control.svg?react';
//import SpeedControlIcon from '../../assets/icons/icon_speed_control.svg?react';
import useClipStore from '../../store/clipViewStore';
import Player from 'video.js/dist/types/player';
import Dropdown from '../Dropdown'; /* 250113 드롭다운 추가 */
import useLiveStore from '../../store/liveStore';
import useAdStore from '../../store/adStore';

interface ControlsProps {
  playerRef: React.RefObject<Player | null>;
  onBack?: () => void;
  onClickTagButton?: () => void;
  seekTo: (seconds: number, type: 'seconds' | 'fraction') => void;
  seekToLive: () => void;
}

export function Controls(props: ControlsProps) {
  const {
    playerRef,
    onBack,
    onClickTagButton,
    seekTo,
    seekToLive,
  } = props;

  //const url = usePlayerStore((state) => state.url); 241224 PIP 버튼 주석
  const title = usePlayerStore((state) => state.title);
  //const pip = usePlayerStore((state) => state.pip); 241224 PIP 버튼 주석
  // const setPip = usePlayerStore((state) => state.setPip) 241224 PIP 버튼 주석;
  const isPlay = usePlayerStore((state) => state.isPlay);
  const setIsPlay = usePlayerStore((state) => state.setIsPlay);
  const isSeek = usePlayerStore((state) => state.isSeek);
  const setIsSeek = usePlayerStore((state) => state.setIsSeek);
  const duration = usePlayerStore((state) => state.duration);
  const played = usePlayerStore((state) => state.played);
  const volume = usePlayerStore((state) => state.volume);
  const setVolume = usePlayerStore((state) => state.setVolume);
  const isFullScreen = usePlayerStore((state) => state.isFullScreen);
  const setIsFullScreen = usePlayerStore((state) => state.setIsFullScreen);
  const setIsShowMultiView = usePlayerStore((state) => state.setIsShowMultiView);
  const multiViewSources = useMultiViewStore((state) => state.multiViewSources);
  const tags = useTagStore((state) => state.tags);
  const isShowClipView = usePlayerStore((state) => state.isShowClipView);
  const setIsShowClipView = usePlayerStore((state) => state.setIsShowClipView);
  const setCurrentSeconds = useClipStore((state) => state.setCurrentSeconds);
  const backIconType = usePlayerStore((state) => state.backIconType);
  const isViewThumbMarker = usePlayerStore((state) => state.isViewThumbMarker);
  const speed = usePlayerStore((state) => state.speed);
  const setSpeed = usePlayerStore((state) => state.setSpeed);
  const setIsShowTagSaveView = usePlayerStore((state) => state.setIsShowTagSaveView);
  const isShowTagSaveView = usePlayerStore((state) => state.isShowTagSaveView);
  const isDisableClip = usePlayerStore((state) => state.isDisableClip);
  const isDisableTag = usePlayerStore((state) => state.isDisableTag);
  const isDisableMultiView = usePlayerStore((state) => state.isDisableMultiView);
  const isLive = usePlayerStore((state) => state.isLive);
  const isPlayAd = useAdStore((state) => state.isPlayAd);
  const atLive = useLiveStore((state) => state.atLive);
  const isMute = usePlayerStore((state) => state.isMute);
  const setIsMute = usePlayerStore((state) => state.setIsMute);
  
  // 드래그 중 임시로 써 줄 로컬 state
  const [timeSliderValue, setTimeSliderValue] = useState(played * 100);
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [lastTapTime, setLastTapTime] = useState<number | null>(null);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setSkipDirection = usePlayerStore((state) => state.setSkipDirection);
  // 자동 숨김 타이머를 제어하기 위한 ref
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const checkPointerType = () => {
      if (window.matchMedia("(pointer: coarse)").matches) {
        setIsTouchDevice(true);
      } else {
        setIsTouchDevice(false);
      }
    };

    checkPointerType();
    window.addEventListener("resize", checkPointerType);
    return () => {
      window.removeEventListener("resize", checkPointerType);
    };
  }, []);

  // === 자동 숨김 타이머 설정 로직 ===
  // isOverlayVisible가 true일 때 일정 시간(예: 3초) 후 자동으로 숨김
  useEffect(() => {
    // 모바일/터치 디바이스가 아닐 경우(데스크톱)는 기존 마우스 로직 사용하므로 패스
    if (!isTouchDevice) return;
    if (!isOverlayVisible) return;
    if (isSeek) return;

    // 먼저 기존 타이머가 있으면 클리어
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    hideTimerRef.current = setTimeout(() => {
      setOverlayVisible(false);
    }, 3000);

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [isOverlayVisible, isTouchDevice, isSeek]);

  // 라이브 시간과 현재 시간이 근접할 때 속도를 1로 설정
  useEffect(() => {
    if (atLive) {
      setSpeed(1);
    }
  }, [atLive]);

  const handleMouseEnter = () => {
    if (!isTouchDevice) setOverlayVisible(true);
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) setOverlayVisible(false);
  };

  // === 모바일 환경에서 한 번 터치할 때마다 오버레이 토글 ===
  const handleTouchOverlay = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log('handleTouchOverlay', e.target, e.currentTarget);
    const targetElement = e.target as HTMLElement;
    const currentTargetElement = e.currentTarget as HTMLElement;
    const now = performance.now();
    const isDoubleTap = lastTapTime && now - lastTapTime < 300; // 300ms 안에 다시 탭하면 더블 탭으로 판단

    if (isDoubleTap) {
      // 광고 중 스킵 방지
      if (isPlayAd) return;

      // 더블 탭이면 1) 단일 탭 타이머 해제
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current);
        tapTimerRef.current = null;
      }

      // 2) 좌/우 영역 판별
      // offsetX: 현재 요소 내에서 터치한 위치(왼쪽 기준)
      // clientWidth: 현재 요소의 전체 너비
      const { offsetX } = e.nativeEvent;
      const { clientWidth } = e.currentTarget;
      
      if (offsetX < clientWidth / 2) {
        // 왼쪽 영역 -> 10초 뒤로
        if (playerRef.current) {
          const currentTime = playerRef.current.currentTime() ?? 0;
          seekTo(currentTime - 10, "seconds");
          setSkipDirection('left');
        }
      } else {
        // 오른쪽 영역 -> 10초 앞으로
        if (playerRef.current) {
          const currentTime = playerRef.current.currentTime() ?? 0;
          seekTo(currentTime + 10, "seconds");
          setSkipDirection('right');
        }
      }

      // 0.6초 뒤에 스킵 메시지 숨기기
      setTimeout(() => {
        setSkipDirection(null);
      }, 600);

      // 마지막 탭 시간 초기화
      setLastTapTime(null);
    } else {
      setLastTapTime(now);
      // 300ms 안에 두 번째 탭이 발생하지 않으면 단일 탭으로 처리
      tapTimerRef.current = setTimeout(() => {
        setLastTapTime(null);
        tapTimerRef.current = null;

        // 만약 부모 래퍼를 직접 터치했다면
        if (
          targetElement.classList.contains('controls-wrapper') && 
          currentTargetElement.classList.contains('controls-wrapper')
        ) {
          // 오버레이 토글
          setOverlayVisible((prev) => !prev);
        }
      }, 300);
    }
  };

  const handleSeekChange = ([value]: number[]) => {
    // 광고 중에는 seek 불가
    if (isPlayAd) return;
    if (!isOverlayVisible) return;
    setIsSeek(true);
    setTimeSliderValue(value);
  };

  const handleSeekCommit = ([value]: number[]) => {
    // 광고 중에는 seek 불가
    if (isPlayAd) return;
    if (!isOverlayVisible) return;
    const fraction = value / 100;
    seekTo(fraction, 'fraction');
    requestAnimationFrame(() => {
      setIsSeek(false);
    });
  };

  const handleSeekMouseUp = () => {
    console.log('handleSeekMouseUp');
    setIsSeek(false);
  };
  const handleSeekMouseDown = () => {
    console.log('handleSeekMouseDown');
    setIsSeek(true);
  };
  const handleTagClick = (seconds: number) => {
    if (playerRef.current) {
      if (isOverlayVisible) {
        seekTo(seconds, 'seconds');
      }
    } else {
      console.warn('playerRef is null, cannot seek');
    }
  };

  const handleClickClip = () => {
    setIsPlay(false);
    setCurrentSeconds(playerRef.current?.currentTime() ?? 0);
    setIsShowClipView(true);
  };

  const handleClickTag = () => {
    if (isFullScreen) {
      setIsShowTagSaveView(true);
    }

    onClickTagButton?.();
  }

  return (
    <ControlsWrapper
      className="controls-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={isTouchDevice ? handleTouchOverlay : undefined}
      isOverlayVisible={isOverlayVisible}
    >
      <ControlsContainer 
        className="controls-wrapper"
        isOverlayVisible={isOverlayVisible}
      >
        <TopContainer className='controls-wrapper'>
          <FlexRow style={{width: 'calc(100% - 10em'}} className='controls-wrapper'>
            <IconButton onClick={() => {
              if (isFullScreen) {
                setIsFullScreen(false);
              }

              // onBack 콜백 함수가 존재하면 실행
              if (onBack) {
                onBack();
              }
            }}
            className='back_btn'
            >
              {backIconType === 'close' ? <CloseIcon width={'100%'} height={'100%'} /> : <ArrowLeftIcon width={'100%'} height={'100%'} />}
            </IconButton>
            {/* 241224 스타일 삭제 및 video_title 클래스 추가 */}
            <div className='video_title'/* style={{ color: 'white', marginLeft: 16 }} */>{title}</div>
          </FlexRow>

          {/* 241224 아이콘 추가 및 클래스네임 설정, 250113 간격 수정 및 클래스네임 추가 */}
          <FlexRow gap={16} className='icon_box'>
            {!isFullScreen && !isDisableTag && <IconButton className='tag_btn' onClick={handleClickTag}>
              <TagViewIcon />
            </IconButton>}
            <IconButton className='screencast_btn'>
              <ScreenCastIcon />
            </IconButton>
            { multiViewSources.length && !isDisableMultiView && <IconButton onClick={() => setIsShowMultiView(true)} className='multiview_btn'>
              <MultiViewIcon/>
            </IconButton>}
          </FlexRow>
        </TopContainer>
        
        <MiddleContainer className='controls-wrapper'>
          <PlayBtnContainer>
            <FlexRow>
              {/* 광고 중에는 재생/일시정지 버튼 비활성화 */}
              <IconButton 
                onClick={isPlayAd ? undefined : () => setIsPlay(!isPlay)} 
                className='play_btn'
                style={{ opacity: isPlayAd ? 0.5 : 1 }}
              >
                {isPlay ? <PauseIcon /> : <PlayIcon />}
              </IconButton>
            </FlexRow>
          </PlayBtnContainer>
          {/* //241224 플레이 버튼 구조 변경 */}
          {/* 241224 side 아이콘 구조 변경 및 아이콘 이름 추가, 250113 클래스 추가 및 간격 수정 */}
          <FlexCol style={{paddingRight: '1em', gap: '1.3em'}} className='icon_box'>
            { isFullScreen && !isShowClipView && !isShowTagSaveView && (
              <>
                {!isDisableClip && <FlexCol>
                    <IconButton className='side_icon side_clip' onClick={handleClickClip}>
                      <ClipIcon/>
                      <p className='side_icon_name'>클립</p>
                    </IconButton>
                  </FlexCol>
                }
                {!isDisableTag && <FlexCol>
                    <IconButton className='side_icon side_tag' onClick={handleClickTag}>
                      <TagViewIcon/>
                      <p className='side_icon_name'>태그</p>
                    </IconButton>
                  </FlexCol>
                }
              </>
            )}
          </FlexCol>
        </MiddleContainer>

        <BottomContainer isFullScreen={isFullScreen}>
          <SliderContainer>
            <Slider.Root 
              className="SliderRoot"
              style={{ 
                width: '100%',
                opacity: isPlayAd ? 0.5 : 1,
                pointerEvents: isPlayAd ? 'none' : 'auto'
              }}
              value={[isSeek ? timeSliderValue : played * 100]}
              max={100}
              step={0.1}
              onPointerDown={handleSeekMouseDown}
              onPointerUp={handleSeekMouseUp}
              onValueChange={handleSeekChange}
              onValueCommit={handleSeekCommit}
            >
              <Slider.Track className="SliderTrack">
                <Slider.Range className="SliderRange" />
              </Slider.Track>
              <Slider.Thumb className="SliderThumb" aria-label="Time">
                {isViewThumbMarker && <AddTagMarker>
                  <RedMarkerIcon />
                </AddTagMarker>}
              </Slider.Thumb>
              {!isViewThumbMarker && tags.map((tag, index) => {
                const position = (tag.seconds / duration) * 100;
                
                return (
                  <TagMarker
                    key={index}
                    onClick={() => handleTagClick(tag.seconds)}
                    left={`${position}%`}
                  >
                    <img src={tag.iconUrl} style={{ width: '100%' }} />
                  </TagMarker>
                );
              })}
            </Slider.Root>
          </SliderContainer>
          <ControlBox>
            <FlexRow>
              {isLive ? (
                <LiveContainer 
                  isAtLive={atLive} 
                  onClick={atLive ? undefined : () => seekToLive()} 
                >
                  <LiveDot isAtLive={atLive} />
                  <span>LIVE</span>
                </LiveContainer>
              ) : (
                <>
                  <PlayTime seconds={isSeek ? duration * timeSliderValue / 100 : duration * played} />
                  <span style={{ color: 'white', fontSize: '1.4em', paddingLeft: '0.5em', paddingRight: '0.5em' }}> / </span>
                  <PlayTime seconds={duration} />
                </>
              )}
            </FlexRow>
            <FlexRow gap={16} className='icon_box'>{/* 250113 간격수정 및 클래스 추가 */}
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
                    setSpeed(Number(option.value));
                  }
                }} 
                options={[
                  {label: '2x', value: 2}, 
                  {label: '1.75x', value: 1.75}, 
                  {label: '1.5x', value: 1.5}, 
                  {label: '1.25x', value: 1.25}, 
                  {label: '1x', value: 1}, 
                  {label: '0.5x', value: 0.5}
                ]} 
                defaultValue={speed}
                disabled={isPlayAd}
              />
              <Dropdown 
                onChangeValue={(option) => console.log(option)} 
                options={[
                  {label: '1080p', tag: 'HD', value: 1080}, 
                  {label: '720p', value: 720},
                  {label: '480p', value: 480}, 
                  {label: '360p', value: 360}, 
                  {label: '240p', value: 240}, 
                  {label: '144p', value: 144}
                ]} 
                defaultValue={720}
                disabled={isPlayAd}
              />
              <FlexRow>
                <VolumeControlWrap>
                  <IconButton className='volume_control_btn' onClick={() => setIsMute(!isMute)}>
                    {isMute ? (
                      <VolumeMuteIcon />
                    ) : (
                      <VolumeIcon />
                    )}
                  </IconButton>
                  <Slider.Root className="SliderRoot"
                    value={[volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={([value]) => setVolume(value / 100)}
                  >
                    <Slider.Track className="SliderTrack">
                      <Slider.Range className="SliderRange" />
                    </Slider.Track>
                    <Slider.Thumb className="SliderThumb" aria-label="Volume" />
                  </Slider.Root>
                </VolumeControlWrap>
              </FlexRow>
              {/* 241224 PIP 버튼 주석
              {ReactPlayer.canEnablePIP(url) &&
                <button onClick={() => setPip(!pip)}>{pip ? 'PIP OFF' : 'PIP ON'}</button>
              } */}
              <IconButton className='full_screen_btn' onClick={() => setIsFullScreen(!isFullScreen)}>
                <FullScreenIcon />
              </IconButton>
            </FlexRow>
          </ControlBox>
        </BottomContainer>
      </ControlsContainer>
    </ControlsWrapper>
  );
}

const ControlsWrapper = styled.div<{ isOverlayVisible: boolean }>`
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
  background-color: ${({ isOverlayVisible }) =>
    isOverlayVisible ? "rgba(0, 0, 0, 0.6)" : "transparent"};
  transition: background-color 0.3s ease;
`;

const ControlsContainer = styled.div<{ isOverlayVisible: boolean }>`
  display: grid;
  grid-template-rows: auto 1fr auto;
  /* 부모(ControlsWrapper)의 높이를 전부 차지 */
  flex: 1;
  height: 100%;

  opacity: ${({ isOverlayVisible }) => (isOverlayVisible ? 1 : 0)};
  transition: opacity 0.3s ease;
  pointer-events: ${({ isOverlayVisible }) => (isOverlayVisible ? "auto" : "none")};
`;

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
  }
`;

const MiddleContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const BottomContainer = styled.div<{ isFullScreen: boolean }>`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  margin-bottom: 0;

  /* iOS Safari 전용 스타일 */
  @supports (-webkit-touch-callout: none) {
    ${({ isFullScreen }) =>
      isFullScreen &&
      `
      margin-bottom: 42px;
    `}
  }
`;

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
  &.play_control_btn {
    width: 1.8em;
    height: 1.8em;
  }
  &.speed_control_btn {
    width: 1.7em;
    height: 1.7em;
  }
  &.volume_control_btn {
    width: 2.2em;
    height: 2.2em;
  }
  &.full_screen_btn {
    width: 1.7em;
    height: 1.8em;
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
  @media screen and (min-width: 390px){font-size:10.8334px;}
  @media screen and (min-width: 396px){font-size:11px;}
  @media screen and (min-width: 411px){font-size:11.4166px;}
  @media screen and (min-width: 412px){font-size:11.4444px;}
  /* iphone 6 Plus */
  @media screen and (min-width: 414px){font-size:11.5px;}
  /* iphone 12 Pro Max */
  @media screen and (min-width: 428px){font-size:11.8889px;}
  @media screen and (min-width: 432px){font-size:12px;}
  @media screen and (min-width: 468px){font-size:13px;}
  @media screen and (min-width: 504px){font-size:14px;}
  @media screen and (min-width: 540px){font-size:15px;} 
`;

const SliderContainer = styled.div`
  // width: 100%;
  display: flex;
  align-items: center;
  padding: 0 1.6em 0 1.6em;
`;

const ControlBox = styled.div`
  display: flex;
  padding: 0 1.6em 1.2em; /* 241224 padding em 단위로 수정 */
  align-items: center;
  justify-content: space-between;
`;

const FlexRow = styled.div<{ gap?: number }>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.gap ? props.gap * 0.1 : 0}em; /* 241224 gap em 단위 수정 */
  /* 250113 추가 */
  &.icon_box {
        @media screen and (min-width: 390px){font-size:10.8334px;}
        @media screen and (min-width: 396px){font-size:11px;}
        @media screen and (min-width: 411px){font-size:11.4166px;}
        @media screen and (min-width: 412px){font-size:11.4444px;}
        /* iphone 6 Plus */
        @media screen and (min-width: 414px){font-size:11.5px;}
        /* iphone 12 Pro Max */
        @media screen and (min-width: 428px){font-size:11.8889px;}
        @media screen and (min-width: 432px){font-size:12px;}
        @media screen and (min-width: 468px){font-size:13px;}
        @media screen and (min-width: 504px){font-size:14px;}
        @media screen and (min-width: 540px){font-size:15px;} 
    }
`;

const FlexCol = styled.div<{ gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.gap ? props.gap * 0.1 : 0}em; /* 241224 gap em 단위 수정 */
  /* 250113 추가 */
  &.icon_box {
        @media screen and (min-width: 390px){font-size:10.8334px;}
        @media screen and (min-width: 396px){font-size:11px;}
        @media screen and (min-width: 411px){font-size:11.4166px;}
        @media screen and (min-width: 412px){font-size:11.4444px;}
        /* iphone 6 Plus */
        @media screen and (min-width: 414px){font-size:11.5px;}
        /* iphone 12 Pro Max */
        @media screen and (min-width: 428px){font-size:11.8889px;}
        @media screen and (min-width: 432px){font-size:12px;}
        @media screen and (min-width: 468px){font-size:13px;}
        @media screen and (min-width: 504px){font-size:14px;}
        @media screen and (min-width: 540px){font-size:15px;} 
    }
`;

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
`;

const AddTagMarker = styled.div`
  z-index: 10;
  width: 2.4em;
  height: 1.8em;
  position: absolute;
  top: -2em;
  cursor: pointer;
`;

const PlayBtnContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`
const VolumeControlWrap = styled.div`
  display: flex;
  gap: 0;
  .SliderRoot {
    width: 0;
    opacity: 0;
    transition: all 0.3s ease;
  }
  .SliderThumb {
    width: 0;
  }
  &:hover {
    gap: .4em;
    .SliderRoot {
      width: 5em; /* 250113 수정 */
      opacity: 1;
    }
    .SliderThumb {
      width: 1.2em;
    }
  }
`;

const LiveDot = styled.div<{ isAtLive: boolean }>`
  width: 0.8em;
  height: 0.8em;
  border-radius: 50%;
  margin-right: 0.5em;
  background-color: ${({ isAtLive }) => isAtLive ? '#FF0000' : '#666666'};
  transition: background-color 0.2s ease;
`;

const LiveContainer = styled.div<{ isAtLive: boolean }>`
  display: flex;
  align-items: center;
  cursor: ${({ isAtLive }) => isAtLive ? 'default' : 'pointer'};
  
  span {
    color: white;
    font-size: 1.4em;
    padding-right: 0.5em;
  }
`;