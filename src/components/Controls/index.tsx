import { useState } from 'react';
import ReactPlayer from 'react-player';
import styled from 'styled-components';
import * as Slider from "@radix-ui/react-slider";
import PlayIcon from "../../assets/icons/vod_play.svg?react";
import PauseIcon from "../../assets/icons/vod_pause.svg?react";
import VolumeIcon from "../../assets/icons/icon_volume.svg?react";
import usePlayerStore from '../../store/playerStore';
import { PlayTime } from '../PlayTime';
import './styles.css';

interface ControlsProps {
  playerRef: React.RefObject<ReactPlayer | null>;
}

export function Controls(props: ControlsProps) {
  const {
    playerRef,
  } = props;

  const url = usePlayerStore((state) => state.url);
  const pip = usePlayerStore((state) => state.pip);
  const setPip = usePlayerStore((state) => state.setPip);
  const isPlay = usePlayerStore((state) => state.isPlay);
  const setIsPlay = usePlayerStore((state) => state.setIsPlay);
  const setIsSeek = usePlayerStore((state) => state.setIsSeek);
  const duration = usePlayerStore((state) => state.duration);
  const played = usePlayerStore((state) => state.played);
  const setPlayed = usePlayerStore((state) => state.setPlayed);
  const volume = usePlayerStore((state) => state.volume);
  const setVolume = usePlayerStore((state) => state.setVolume);

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

  return (
    <ControlsWrapper>
      <ControlsContainer>
        <TopContainer>
          <h2 style={{ color: 'white' }}>Hogak Player</h2>
        </TopContainer>
        <MiddleContainer>
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
        </MiddleContainer>
        <BottomContainer>
          <SliderContainer>
            <Slider.Root className="SliderRoot"
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
              <Slider.Thumb className="SliderThumb" aria-label="Volume" />
            </Slider.Root>
          </SliderContainer>
          <ControlBox>
            <InnerControls>
              <IconButton onClick={(_) => setIsPlay(!isPlay)}>
                {isPlay ? (
                  <PlayIcon width={24} fontSize="medium" />
                ) : (
                  <PauseIcon width={24} fontSize="medium" />
                )}{" "}
              </IconButton>

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
                style={{ width: '100%' }}
              >
                <Slider.Track className="SliderTrack">
                  <Slider.Range className="SliderRange" />
                </Slider.Track>
                <Slider.Thumb className="SliderThumb" aria-label="Volume" />
              </Slider.Root>

              <PlayTime seconds={duration * played} />
              {' / '}
              <PlayTime seconds={duration} />
              {ReactPlayer.canEnablePIP(url) &&
                <button onClick={() => setPip(!pip)}>{pip ? 'PIP OFF' : 'PIP ON'}</button>
              }
            </InnerControls>

          </ControlBox>
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
  align-items: center;
  justify-content: space-between;
  margin: 5px 20px;
`;

const MiddleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BottomContainer = styled.div`
`;

const IconButton = styled.div`
  padding: 0 10px;
  color: #7b2cbf;
`;

const SliderContainer = styled.div`
  // width: 100%;
  display: flex;
  align-items: center;
  padding: 0 16px;
`;

const ControlBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InnerControls = styled.div`
  display: flex;
  padding: 10px 0;
  align-items: center;
  width: 50%;
`;