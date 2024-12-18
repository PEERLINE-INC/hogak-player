import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import styled from 'styled-components';
import { OnProgressProps } from 'react-player/base';
import usePlayerStore from '../../store/playerStore';
import { Controls } from '../Controls';
import { MultiViewPopover } from '../MultiViewPopover';
import useMultiViewStore from '../../store/multiViewStore';
import { HogakPlayerProps } from './interfaces';
import { TagViewPopover } from '../TagViewPopover';
import useTagStore from '../../store/tagViewStore';

export const HogakPlayer = forwardRef(function (props: HogakPlayerProps, ref) {
  const url = usePlayerStore((state) => state.url);
  const setUrl = usePlayerStore((state) => state.setUrl);
  const setTitle = usePlayerStore((state) => state.setTitle);
  const pip = usePlayerStore((state) => state.pip);
  const isPlay = usePlayerStore((state) => state.isPlay);
  const isSeek = usePlayerStore((state) => state.isSeek);
  const setIsPlay = usePlayerStore((state) => state.setIsPlay);
  const setDuration = usePlayerStore((state) => state.setDuration);
  const setPlayed = usePlayerStore((state) => state.setPlayed);
  const volume = usePlayerStore((state) => state.volume);
  const isShowMultiView = usePlayerStore((state) => state.isShowMultiView);
  const setMultiViewSources = useMultiViewStore((state) => state.setMultiViewSources);
  const isShowTagView = usePlayerStore((state) => state.isShowTagView);
  const setTags = useTagStore((state) => state.setTags);
  const onBack = props.onBack;

  useEffect(() => {
    setIsPlay(props.isPlay ?? false);
    setUrl(props.url);
  }, [props.isPlay, props.url]);

  useEffect(() => {
    setTitle(props.title ?? '');
  }, [props.title]);

  useEffect(() => {
    setMultiViewSources(props.multiViewSources ?? []);
  }, [props.multiViewSources]);

  useEffect(() => {
    setTags(props.tags ?? []);
  }, [props.tags]);

  const playerRef = useRef<ReactPlayer | null>(null);
  const [_, setReady] = useState(false);

  const onEnded = () => {
    setIsPlay(false);
  };

  const handleDuration = (duration: number) => {
    // console.log('onDuration', duration);
    setDuration(duration);
  }

  const handleProgress = (state: OnProgressProps) => {
    console.log('onProgress', state);
    if (!isSeek) {
      setPlayed(state.played);
    }
  };

  // 메소드 노출
  useImperativeHandle(ref, () => ({
    getCurrentSeconds: () => {
      return playerRef.current?.getCurrentTime() ?? 0;
    },
  }));

  return (
    <PlayerContainer
      width={props.width}
      height={props.height}
    >
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
            onError={(e) => console.error('onError', e)}
            onSeek={(seconds: number) => console.log('onSeek', seconds)}
            onDuration={handleDuration}
            onProgress={handleProgress}
            volume={volume}
            pip={pip}
            playsinline={true}
          />
          <MultiViewPopover isShow={isShowMultiView} />
          <TagViewPopover isShow={isShowTagView} onAddTagClick={props.onClickAddTag} />
          <Controls playerRef={playerRef} onBack={onBack} />
        </PlayerWrapper>
      </Container>
    </PlayerContainer>
  );
});

const Container = styled.div`
  width: 100%;
  margin-left: auto;
  box-sizing: border-box;
  margin-right: auto;
`;

const PlayerContainer = styled.div<{ width: number | undefined; height: number | undefined }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${(props) => props.width ? `width: ${props.width}px;` : 'width: 100%;'}
  ${(props) => props.height ? `height: ${props.height}px;` : 'height: 100%;'}
  
  .hogak-player {
    object-fit: cover;
    padding: 0;
    margin: 0;
  }
`;

const PlayerWrapper = styled.div`
  position: relative;
`;