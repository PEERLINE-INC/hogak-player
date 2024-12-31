import { useState } from 'react';
import ReactPlayer from 'react-player';
import styled from 'styled-components';
import * as Slider from "@radix-ui/react-slider";
import ArrowLeftIcon from "../../assets/icons/icon_arrow_left_white.svg?react";
import PlayIcon from "../../assets/icons/vod_play.svg?react";
import PauseIcon from "../../assets/icons/vod_pause.svg?react";
import VolumeIcon from "../../assets/icons/icon_volume.svg?react";
import MultiViewIcon from "../../assets/icons/icon_multiview.svg?react";
import FullScreenIcon from "../../assets/icons/icon_zoom.svg?react";
import TagViewIcon from "../../assets/icons/icon_tag_white.svg?react";
import usePlayerStore from '../../store/playerStore';
import { PlayTime } from '../PlayTime';
import './styles.css';
import useMultiViewStore from '../../store/multiViewStore';
import useTagStore from '../../store/tagViewStore';
import ScreenCastIcon from '../../assets/icons/icon_screencast.svg?react';
import ClipIcon from '../../assets/icons/icon_clip_white.svg?react';
import PlayControlIcon from '../../assets/icons/icon_play_control.svg?react';
import SpeedControlIcon from '../../assets/icons/icon_speed_control.svg?react';
import useClipStore from '../../store/clipViewStore';

interface ControlsProps {
  playerRef: React.RefObject<ReactPlayer | null>;
  onBack?: () => void;
}

export function Controls(props: ControlsProps) {
  const {
    playerRef,
    onBack,
  } = props;

  //const url = usePlayerStore((state) => state.url); 241224 PIP 버튼 주석
  const title = usePlayerStore((state) => state.title);
  //const pip = usePlayerStore((state) => state.pip); 241224 PIP 버튼 주석
  // const setPip = usePlayerStore((state) => state.setPip) 241224 PIP 버튼 주석;
  const isPlay = usePlayerStore((state) => state.isPlay);
  const setIsPlay = usePlayerStore((state) => state.setIsPlay);
  const setIsSeek = usePlayerStore((state) => state.setIsSeek);
  const duration = usePlayerStore((state) => state.duration);
  const played = usePlayerStore((state) => state.played);
  const setPlayed = usePlayerStore((state) => state.setPlayed);
  const volume = usePlayerStore((state) => state.volume);
  const setVolume = usePlayerStore((state) => state.setVolume);
  const isFullScreen = usePlayerStore((state) => state.isFullScreen);
  const setIsFullScreen = usePlayerStore((state) => state.setIsFullScreen);
  const setIsShowMultiView = usePlayerStore((state) => state.setIsShowMultiView);
  const multiViewSources = useMultiViewStore((state) => state.multiViewSources);
  const setIsShowTagView = usePlayerStore((state) => state.setIsShowTagView);
  const tags = useTagStore((state) => state.tags);
  const setIsShowClipView = usePlayerStore((state) => state.setIsShowClipView);
  const setCurrentSeconds = useClipStore((state) => state.setCurrentSeconds);

  const [mute] = useState(false);

  const handleSeekMouseDown = () => {
    console.log('handleSeekMouseDown');
    setIsSeek(true);
  };
  const handleSeekChange = ([value]: number[]) => {
    console.log('handleSeekChange', value);
    setPlayed(value / 100);
  }
  const handleSeekMouseUp = () => {
    console.log('handleSeekMouseUp');
    setIsSeek(false);
    if (playerRef.current) {
      playerRef.current.seekTo(played);
    } else {
      console.warn('playerRef is null, cannot seek');
    }
  };
  const handleTagClick = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds);
    } else {
      console.warn('playerRef is null, cannot seek');
    }
  };

  return (
    <ControlsWrapper>
      <ControlsContainer>
        <TopContainer>
          <FlexRow style={{width: 'calc(100% - 10em'}}>
            <IconButton onClick={() => {
              if (onBack) {
                onBack();
              }
            }}
            className='back_btn'
            >
              <ArrowLeftIcon width={'100%'} height={'100%'} />
            </IconButton>
            {/* 241224 스타일 삭제 및 video_title 클래스 추가 */}
            <div className='video_title'/* style={{ color: 'white', marginLeft: 16 }} */>{title}</div>
          </FlexRow>

          {/* 241224 아이콘 추가 및 클래스네임 설정 */}
          <FlexRow gap={12}>
            <IconButton className='tag_btn'>
              <TagViewIcon/>
            </IconButton>
            <IconButton className='screencast_btn'>
              <ScreenCastIcon/>
            </IconButton>
            { multiViewSources.length && <IconButton onClick={() => setIsShowMultiView(true)} className='multiview_btn'>
              <MultiViewIcon/>
            </IconButton>}
          </FlexRow>
        </TopContainer>

        {/* 241224 플레이 버튼 구조 변경 */}
        <PlayBtnContainer>
          <FlexCol>
            {/* <IconButton onDoubleClick={onRewind}>
                <FastRewind fontSize="medium" />
              </IconButton> */}
              <IconButton onClick={(_) => setIsPlay(!isPlay)} className='play_btn'>
                {isPlay ? (
                  <PauseIcon />
                ) : (
                  <PlayIcon />
                )}{" "}
              </IconButton>
              {/* <IconButton>
                <FastForward fontSize="medium" onDoubleClick={onForward} />
              </IconButton> */}
          </FlexCol>
        </PlayBtnContainer>
        {/* //241224 플레이 버튼 구조 변경 */}

        
        <MiddleContainer>
          {/* 241224 side 아이콘 구조 변경 및 아이콘 이름 추가 */}
          <FlexCol style={{paddingRight: '1.6em', gap: '2em'}}>
            { isFullScreen && (
              <>
                <FlexCol>
                  <IconButton className='side_icon side_clip' onClick={() => {
                    setIsPlay(false);
                    setCurrentSeconds(playerRef.current?.getCurrentTime() ?? 0);
                    setIsShowClipView(true);
                  }}>
                    <ClipIcon/>
                    <p className='side_icon_name'>클립</p>
                  </IconButton>
                </FlexCol>
                <FlexCol>
                  <IconButton onClick={(_) => setIsShowTagView(true)} className='side_icon side_tag'>
                    <TagViewIcon/>
                    <p className='side_icon_name'>태그</p>
                  </IconButton>
                </FlexCol>
              </>
            )}
          </FlexCol>
        </MiddleContainer>

        <BottomContainer>
          <ControlBox>
            <FlexRow>
              <PlayTime seconds={duration * played} />
              {/* 241224 fontSize, padding 수정 */}
              <span style={{ color: 'white', fontSize: '1.4em', paddingLeft: '0.5em', paddingRight: '0.5em' }}> / </span>
              <PlayTime seconds={duration} />
            </FlexRow>
            <FlexRow gap={8}>
              <IconButton className='play_control_btn'>
                <PlayControlIcon/>
              </IconButton>
              <IconButton className='speed_control_btn'>
                <SpeedControlIcon/>
              </IconButton>
              <FlexRow>
                <VolumeControlWrap>
                  <IconButton className='volume_control_btn'>
                    {mute ? (
                      <VolumeIcon/>
                    ) : (
                      <VolumeIcon/>
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
          <SliderContainer>
            <Slider.Root className="SliderRoot"
              style={{ width: '100%' }}
              value={[played * 100]}
              max={100}
              step={0.1}
              onMouseDown={handleSeekMouseDown}
              onMouseUp={handleSeekMouseUp}
              onValueChange={handleSeekChange}
            >
              <Slider.Track className="SliderTrack">
                <Slider.Range className="SliderRange" />
              </Slider.Track>
              <Slider.Thumb className="SliderThumb" aria-label="Time" />
              {tags.map((tag, index) => {
                // 태그의 위치를 계산합니다.
                const left = `${(tag.seconds / duration) * 100}%`;
                return (
                  // width={'2.4em'} height={'1.8em'}
                  <TagMarker
                    key={index}
                    style={{ left }}
                    onClick={() => handleTagClick(tag.seconds)}
                  >
                    <img src={tag.iconUrl} style={{ width: '100%' }} /> {/* 241224 태그 크기 단위 수정 */}
                  </TagMarker>
                );
              })}
            </Slider.Root>
          </SliderContainer>
        </BottomContainer>
      </ControlsContainer>
    </ControlsWrapper>
  );
}

const ControlsContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 1;
  opacity: 0; /* 기본적으로 숨김 */
  transition: opacity 0.3s ease; /* 부드럽게 나타나고 사라지도록 애니메이션 추가 */
  pointer-events: none; /* 숨겨진 동안 클릭 방지 */
`;

const ControlsWrapper = styled.div`
  z-index: 1;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 100%;
  &:hover ${ControlsContainer} {
    opacity: 1; /* 마우스가 올라왔을 때 Controls 보이기 */
    background-color: rgba(0, 0, 0, 0.6);
    pointer-events: auto !important;
  }
`;

const TopContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.2em 1.6em 0 1.6em;/* 241224 수정 */

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
  justify-content: flex-end; /* 241224 수정 */
  align-items: center;
  height: 100%;
`;

const BottomContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
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
`;

const SliderContainer = styled.div`
  // width: 100%;
  display: flex;
  align-items: center;
  padding: 0;
`;

const ControlBox = styled.div`
  display: flex;
  padding: 0 1.6em; /* 241224 padding em 단위로 수정 */
  align-items: center;
  justify-content: space-between;
`;

const FlexRow = styled.div<{ gap?: number }>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.gap ? props.gap * 0.1 : 0}em; /* 241224 gap em 단위 수정 */
`;

const FlexCol = styled.div<{ gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.gap ? props.gap * 0.1 : 0}em; /* 241224 gap em 단위 수정 */
`;

const TagMarker = styled.div`
  width: 2.4em;
  height: 1.8em;
  position: absolute;
  top: -1.6em;
  transform: translateX(-50%);
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
      width: 8em;
      opacity: 1;
    }
    .SliderThumb {
      width: 1.2em;
    }
  }
`