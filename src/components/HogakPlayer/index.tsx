import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import styled from 'styled-components';
import { OnProgressProps } from 'react-player/base';
import usePlayerStore from '../../store/playerStore';
import { Controls } from '../Controls';

interface HogakPlayerProps {
  isPlay: boolean;
  setIsPlay: (isPlay: boolean) => void;
  url: string;
  width: number;
  height: number;
}

export function HogakPlayer(props: HogakPlayerProps) {
  const {
    width,
    height,
  } = props;

  const url = usePlayerStore((state) => state.url);
  const setUrl = usePlayerStore((state) => state.setUrl);
  const pip = usePlayerStore((state) => state.pip);
  const isPlay = usePlayerStore((state) => state.isPlay);
  const isSeek = usePlayerStore((state) => state.isSeek);
  const setIsPlay = usePlayerStore((state) => state.setIsPlay);
  const setDuration = usePlayerStore((state) => state.setDuration);
  const setPlayed = usePlayerStore((state) => state.setPlayed);
  const volume = usePlayerStore((state) => state.volume);

  useEffect(() => {
    setIsPlay(props.isPlay);
    setUrl(props.url);
  }, [props.isPlay, props.url]);

  const playerRef = useRef<ReactPlayer | null>(null);
  const [_, setReady] = useState(false);

  const onEnded = () => {
    setIsPlay(false);
  };

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
    <PlayerContainer width={width} height={height}>
      <Container>
        <PlayerWrapper>
          <ReactPlayer
            width="100%"
            height="100%"
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
          <Controls playerRef={playerRef} />
        </PlayerWrapper>
      </Container>
    </PlayerContainer>
  );
}

const Container = styled.div`
  width: 100%;
  margin-left: auto;
  box-sizing: border-box;
  margin-right: auto;
`;

const PlayerContainer = styled.div<{ width?: number; height?: number }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${(props) => props.width ? `width: ${props.width}px;` : 'width: 100%;'}
  ${(props) => props.height && `height: ${props.height}px;`}
  
  .hogak-player {
    object-fit: cover;
    padding: 0;
    margin: 0;
  }
`;

const PlayerWrapper = styled.div`
  position: relative;
`;