import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import ReactPlayer from 'react-player';
import styled, { createGlobalStyle } from 'styled-components';
import { OnProgressProps } from 'react-player/base';
import usePlayerStore from '../../store/playerStore';
import { Controls } from '../Controls';
import { MultiViewPopover } from '../MultiViewPopover';
import useMultiViewStore from '../../store/multiViewStore';
import { HogakPlayerProps } from './interfaces';
import { TagViewPopover } from '../TagViewPopover';
import useTagStore from '../../store/tagViewStore';
import { ClipViewPopover } from '../ClipViewPopover'; // /* 241224 클립 추가 */
// import screenfull from 'screenfull';
import "pretendard/dist/web/static/pretendard.css";

const GlobalStyles = createGlobalStyle`
  html, body, #root {
    font-family: 'Pretendard';
    font-weight: 400;
    letter-spacing: -0.02px;
  }
`;

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
  const setTagMenus = useTagStore((state) => state.setTagMenus);
  const enableDefaultFullScreen = props.enableDefaultFullscreen ?? true;
  const isFullScreen = usePlayerStore((state) => state.isFullScreen);
  // const setIsFullScreen = usePlayerStore((state) => state.setIsFullScreen);
  const setIsShowClipView = usePlayerStore((state) => state.setIsShowClipView);
  const isShowClipView = usePlayerStore((state) => state.isShowClipView);
  const setIsReady = usePlayerStore((state) => state.setIsReady);

  const onBack = props.onBack ?? (() => {});
  const onClickTagButton = props.onClickTagButton ?? (() => {});
  const onChangeClipDuration = props.onChangeClipDuration ?? (() => {});
  
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

  useEffect(() => {
    setTagMenus(props.tagMenus ?? []);
  }, [props.tagMenus]);

  // useEffect(() => {
  //   if (!enableDefaultFullScreen) return;

  //   const handleFullScreenChange = () => {
  //     setIsFullScreen(screenfull.isFullscreen);
  //   };
  //   if (screenfull.isEnabled) {
  //     screenfull.on('change', handleFullScreenChange);
  //   }

  //   // cleanup
  //   return () => {
  //     if (screenfull.isEnabled) {
  //       screenfull.off('change', handleFullScreenChange);
  //     }
  //   }
  // });

  useEffect(() => {
    if (props.onChangeFullScreen) {
      props.onChangeFullScreen(isFullScreen);
    }

    if (!enableDefaultFullScreen) return;
    // if (screenfull.isEnabled && playerContainerRef.current) {
    //   if (isFullScreen) {
    //     screenfull.request(playerContainerRef.current);
    //   } else {
    //     screenfull.exit();
    //   }
    // }
  }, [isFullScreen]);

  const playerRef = useRef<ReactPlayer | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  const onEnded = () => {
    setIsPlay(false);
  };

  const handleDuration = (duration: number) => {
    // console.log('onDuration', duration);
    setDuration(duration);
  }

  const handleProgress = (state: OnProgressProps) => {
    // console.log('onProgress', state);
    if (!isSeek) {
      setPlayed(state.played);
    }
  };
  const handleOnReady = () => {
    console.log('onReady');
    setIsReady(true);
  };
  const handleOnStart = () => {
    console.log('onStart');
  };
  const handleOnPlay = () => {
    console.log('onPlay');
  };

  const seekTo = (played: number) => {
    playerRef.current?.seekTo(played);
  }

  const getCurrentSeconds = () => {
    return playerRef.current?.getCurrentTime() ?? 0;
  }

  // 메소드 노출
  useImperativeHandle(ref, () => ({
    getCurrentSeconds: () => {
      return playerRef.current?.getCurrentTime() ?? 0;
    },
    setClipView: (value: boolean) => setIsShowClipView(value),
  }));
  
  return (
    <PlayerContainer
      ref={playerContainerRef}
      width={props.width}
      height={props.height}
    >
      <GlobalStyles />
      <Container>
        {/* 241224 클래스 (video_ratio_wrapper) 추가
        : 비디오 비율 16:9 고정, 
        비율 고정 원하지 않으시면 (video_ratio_wrapper) 클래스 제거하시면 됩니다. */}
        <PlayerWrapper className={isFullScreen ? '' : 'video_ratio_wrapper'}>
          <ReactPlayer
            width="100%"
            height="100%"
            ref={playerRef}
            url={url}
            className='hogak-player'
            playing={isPlay}
            controls={false}
            onEnded={onEnded}
            onReady={handleOnReady}
            onStart={handleOnStart}
            onPlay={handleOnPlay}
            onError={(e) => console.error('onError', e)}
            onSeek={(seconds: number) => console.log('onSeek', seconds)}
            onDuration={handleDuration}
            onProgress={handleProgress}
            volume={volume}
            pip={pip}
            playsinline={true}
          />
          <MultiViewPopover isShow={isShowMultiView} seekTo={seekTo} getCurrentSeconds={getCurrentSeconds} />
          <TagViewPopover isShow={isShowTagView} onAddTagClick={props.onClickAddTag} />
          <Controls playerRef={playerRef} onBack={onBack} onClickTagButton={onClickTagButton} />
          <ClipViewPopover seekTo={seekTo} onChangeClipDuration={onChangeClipDuration} isShow={isShowClipView} /> {/* 241224 클립 */}
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
  height: 100%;/* 240108 추가 */
`;

const PlayerContainer = styled.div<{ width: number | undefined; height: number | undefined }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${(props) => props.width ? `width: ${props.width}px;` : 'width: 100%;'}
  ${(props) => props.height ? `height: ${props.height}px;` : 'height: 100%;'}
  
  /* 241224 반응형 font-size 추가 */
  font-size: 5px;
  /* EM rules */
  @media screen and (min-width: 216px){font-size:6px;}
  @media screen and (min-width: 229px){font-size:6.3611px;}
  @media screen and (min-width: 250px){font-size:6.9444px;}
  @media screen and (min-width: 252px){font-size:7px;}
  @media screen and (min-width: 288px){font-size:8px;}
  @media screen and (min-width: 292px){font-size:8.1111px;}
  /* iphone 5 */
  @media screen and (min-width: 320px){font-size:8.8888px;}
  @media screen and (min-width: 324px){font-size:9px;}
  @media screen and (min-width: 360px){font-size:10px;}

  .hogak-player {
    object-fit: cover;
    padding: 0;
    margin: 0;

    /* 241224 추가 */
    font-size: 0;
  }
`;

const PlayerWrapper = styled.div`
  position: relative;
  height: 100%; /* 240108 추가 */

  /* 241224 추가 */
  &.video_ratio_wrapper {
    padding-top: calc((9 / 16) * 100%);
    background: black;

    .hogak-player {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
`;