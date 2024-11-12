import { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import styled from 'styled-components';
import { OnProgressProps } from 'react-player/base';
import { PlayTime } from '../PlayTime';

interface HogakPlayerProps {
  isPlay: boolean;
  setIsPlay: (isPlay: boolean) => void;
  url: string;
  width: number;
  height: number;
}

export function HogakPlayer(props: HogakPlayerProps) {
  const {
    isPlay,
    setIsPlay,
    url,
    width,
    height,
  } = props;
  const playerRef = useRef(null);
  const [_, setReady] = useState(false);
  const [pip, setPip] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1.0);
  const [isSeek, setIsSeek] = useState(false);

  const onEnded = () => {
    setIsPlay(false);
  };

  const handleTogglePIP = () => {
    setPip(!pip);
  }

  const handleSeekMouseDown = () => {
    setIsSeek(true);
  };
  const handleSeekChange = (e: any) => {
    setPlayed(parseFloat(e.target.value));
  }
  const handleSeekMouseUp = (e: any) => {
    setIsSeek(false);
    if (playerRef.current) {
      // @ts-ignore
      playerRef.current.seekTo(parseFloat(e.target.value));
    }
  }

  const handleDuration = (duration: number) => {
    console.log('onDuration', duration);
    setDuration(duration);
  }

  const handleProgress = (state: OnProgressProps) => {
    console.log('onProgress', state);
    if (!isSeek) {
      setPlayed(state.played);
    }
  };

  return (
    <FlexContainer>
      <HogakPlayerWrap>
        <ReactPlayer
          width={width}
          height={height}
          ref={playerRef}
          url={url}
          className='hogak-player'
          playing={isPlay}
          controls={false}
          onEnded={onEnded}
          onReady={() => setReady(true)}
          onDuration={handleDuration}
          onProgress={handleProgress}
          volume={volume}
          pip={pip}
        />
        <PlayTime seconds={duration * played} />
        {' / '}
        <PlayTime seconds={duration} />
        <input
          style={{ width: '100%' }}
          type='range' min={0} max={0.999999} step='any'
          value={played}
          onMouseDown={handleSeekMouseDown}
          onChange={handleSeekChange}
          onMouseUp={handleSeekMouseUp}
        />
        <input type='range' min={0} max={1} step='any' value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} />
        {ReactPlayer.canEnablePIP(url) &&
          <button onClick={handleTogglePIP}>{pip ? 'PIP 비활성화' : 'PIP 활성화'}</button>
        }
      </HogakPlayerWrap>
    </FlexContainer>
  );
}

const FlexContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const HogakPlayerWrap = styled.div`
  padding: 20px;
  z-index: 2;
`;