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
import RedTagIcon from "../../assets/icons/mark_red.svg?react";
import usePlayerStore from '../../store/playerStore';
import { PlayTime } from '../PlayTime';
import './styles.css';
import useMultiViewStore from '../../store/multiViewStore';
import useTagStore from '../../store/tagViewStore';

interface ControlsProps {
  playerRef: React.RefObject<ReactPlayer | null>;
}

export function Controls(props: ControlsProps) {
  const {
    playerRef,
  } = props;

  const url = usePlayerStore((state) => state.url);
  const title = usePlayerStore((state) => state.title);
  const pip = usePlayerStore((state) => state.pip);
  const setPip = usePlayerStore((state) => state.setPip);
  const isPlay = usePlayerStore((state) => state.isPlay);
  const setIsPlay = usePlayerStore((state) => state.setIsPlay);
  const isSeek = usePlayerStore((state) => state.isSeek);
  const setIsSeek = usePlayerStore((state) => state.setIsSeek);
  const duration = usePlayerStore((state) => state.duration);
  const played = usePlayerStore((state) => state.played);
  const setPlayed = usePlayerStore((state) => state.setPlayed);
  const volume = usePlayerStore((state) => state.volume);
  const setVolume = usePlayerStore((state) => state.setVolume);
  const setIsShowMultiView = usePlayerStore((state) => state.setIsShowMultiView);
  const multiViewSources = useMultiViewStore((state) => state.multiViewSources);
  const setIsShowTagView = usePlayerStore((state) => state.setIsShowTagView);
  const tags = useTagStore((state) => state.tags);

  const [mute] = useState(false);

  const handleSeekMouseDown = () => {
    setIsSeek(true);
  };
  const handleSeekChange = ([value]: number[]) => {
    setPlayed(value / 100);
  }
  const handleSeekMouseUp = () => {
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
  }

  return (
    <ControlsWrapper>
      <ControlsContainer>
        <TopContainer>
          <FlexRow>
            <IconButton>
              <ArrowLeftIcon width={24} />
            </IconButton>
            <div style={{ color: 'white', marginLeft: 16 }}>{title}</div>
          </FlexRow>
          { multiViewSources.length && <IconButton onClick={() => setIsShowMultiView(true)}>
            <MultiViewIcon width={24} />
          </IconButton>}
        </TopContainer>
        <MiddleContainer>
          <FlexCol>

          </FlexCol>
          <FlexCol>
            {/* <IconButton onDoubleClick={onRewind}>
                <FastRewind fontSize="medium" />
              </IconButton> */}
              <IconButton onClick={(_) => setIsPlay(!isPlay)}>
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
          <FlexCol style={{paddingRight: 16}}>
            <IconButton onClick={(_) => setIsShowTagView(true)}>
              <TagViewIcon width={24} />
            </IconButton>
          </FlexCol>
        </MiddleContainer>
        <BottomContainer>
          <ControlBox>
            <FlexRow>
              <PlayTime seconds={duration * played} />
              <span style={{ color: 'white', fontSize: 14, paddingLeft: 5, paddingRight: 5 }}> / </span>
              <PlayTime seconds={duration} />
            </FlexRow>
            <FlexRow gap={8}>
              <FlexRow>
                <IconButton>
                  {mute ? (
                    <VolumeIcon width={24} />
                  ) : (
                    <VolumeIcon width={24} />
                  )}
                </IconButton>
                <Slider.Root className="SliderRoot"
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={([value]) => setVolume(value / 100)}
                  style={{ width: '100px' }}
                >
                  <Slider.Track className="SliderTrack">
                    <Slider.Range className="SliderRange" />
                  </Slider.Track>
                  <Slider.Thumb className="SliderThumb" aria-label="Volume" />
                </Slider.Root>
              </FlexRow>
              {ReactPlayer.canEnablePIP(url) &&
                <button onClick={() => setPip(!pip)}>{pip ? 'PIP OFF' : 'PIP ON'}</button>
              }
              <IconButton>
                <FullScreenIcon width={24} />
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
                  <TagMarker
                    key={index}
                    style={{ left }}
                    onClick={() => handleTagClick(tag.seconds)}
                  >
                    <RedTagIcon width={24} />
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
  padding: 16px 16px 0 16px;
`;

const MiddleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

const BottomContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
`;

const IconButton = styled.div`
  padding: 4px;
  cursor: pointer;
`;

const SliderContainer = styled.div`
  // width: 100%;
  display: flex;
  align-items: center;
  padding: 0;
`;

const ControlBox = styled.div`
  display: flex;
  padding: 0 16px; 0 16px;
  align-items: center;
  justify-content: space-between;
`;

const FlexRow = styled.div<{ gap?: number }>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.gap || 0}px;
`;

const FlexCol = styled.div<{ gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.gap || 0}px;
`;

const TagMarker = styled.div`
  position: absolute;
  top: -16px;
  transform: translateX(-50%);
  cursor: pointer;
`;