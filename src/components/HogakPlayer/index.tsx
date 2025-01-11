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
import useClipStore from '../../store/clipViewStore';

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
  const setIsShowTagView = usePlayerStore((state) => state.setIsShowTagView);
  const setTags = useTagStore((state) => state.setTags);
  const setTagMenus = useTagStore((state) => state.setTagMenus);
  const enableDefaultFullScreen = props.enableDefaultFullscreen ?? true;
  const isFullScreen = usePlayerStore((state) => state.isFullScreen);
  // const setIsFullScreen = usePlayerStore((state) => state.setIsFullScreen);
  const setIsShowClipView = usePlayerStore((state) => state.setIsShowClipView);
  const isShowClipView = usePlayerStore((state) => state.isShowClipView);
  const setIsReady = usePlayerStore((state) => state.setIsReady);
  const setBackIconType = usePlayerStore((state) => state.setBackIconType);
  const skipDirection = usePlayerStore((state) => state.skipDirection);
  const setIsViewThumbMarker = usePlayerStore((state) => state.setIsViewThumbMarker);
  const setCurrentSeconds = useClipStore((state) => state.setCurrentSeconds);

  const onBack = props.onBack ?? (() => {});
  const onClickTagButton = props.onClickTagButton ?? (() => {});
  const onChangeClipDuration = props.onChangeClipDuration ?? (() => {});
  const onClickClipSave = props.onClickClipSave ?? (() => {});
  
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

  useEffect(() => {
    setBackIconType(props.backIconType ?? 'arrowLeft');
  }, [props.backIconType]);

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

  useEffect(() => {
    console.log(`

██╗  ██╗ ██████╗  ██████╗  █████╗ ██╗  ██╗    ██████╗ ██╗      █████╗ ██╗   ██╗███████╗██████╗ 
██║  ██║██╔═══██╗██╔════╝ ██╔══██╗██║ ██╔╝    ██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗
███████║██║   ██║██║  ███╗███████║█████╔╝     ██████╔╝██║     ███████║ ╚████╔╝ █████╗  ██████╔╝
██╔══██║██║   ██║██║   ██║██╔══██║██╔═██╗     ██╔═══╝ ██║     ██╔══██║  ╚██╔╝  ██╔══╝  ██╔══██╗
██║  ██║╚██████╔╝╚██████╔╝██║  ██║██║  ██╗    ██║     ███████╗██║  ██║   ██║   ███████╗██║  ██║
╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝    ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
                                                                                               
    `)
    console.log("%c Version : 0.4.2-beta.15","color:red;font-weight:bold;");
  }, []);

  const playerRef = useRef<ReactPlayer | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const setClipValuesRef = useRef<((values: number[]) => void) | null>(null);

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
    setClipView: (value: boolean, initialCurrentSeconds?: number) => {
      if (value) {
        setIsPlay(false);
        let currentSeconds = playerRef.current?.getCurrentTime() ?? 0;
        if (initialCurrentSeconds) {
          currentSeconds = initialCurrentSeconds;
        }

        setCurrentSeconds(currentSeconds);
        setIsShowClipView(true);
      } else {
        setIsShowClipView(false);
        if (!isPlay) {
            setIsPlay(true);
        }
      }
    },
    setClipValues: (values: number[]) => {
      // 유효하지 않은 값이 들어오면 오류
      if (values.length !== 2 || values[0] >= values[1]) {
        throw new Error('Invalid clip values');
      }
      // number 타입이 아니면 오류
      if (typeof values[0] !== 'number' || typeof values[1] !== 'number') {
        throw new Error('Invalid clip values type');
      }
      if (setClipValuesRef.current) {
        setClipValuesRef.current(values);
      }
    },
    setTagView: (value: boolean) => setIsShowTagView(value),
    seekTo: (value: number, type: "seconds" | "fraction") => {
      if (!["seconds", "fraction"].includes(type)) {
        throw new Error('Invalid seek type');
      }
      if (type === "fraction") {
        if (value < 0 || value > 1) {
          throw new Error('Invalid seek value');
        }
      }

      playerRef.current?.seekTo(value, type);
    },
    setIsViewThumbMarker: (value: boolean) => {
      setIsViewThumbMarker(value);
    },
    getIsFullScreen: () => isFullScreen,
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
          <ClipViewPopover seekTo={seekTo} onChangeClipDuration={onChangeClipDuration} isShow={isShowClipView} setValuesRef={setClipValuesRef} onSave={onClickClipSave} /> {/* 241224 클립 */}
          {skipDirection && 
            <SkipMessage style={{ left: skipDirection === 'left' ? "20%" : "80%", top: "50%" }}>
              {skipDirection === 'left' ? '-10초' : '+10초'}
            </SkipMessage>
          }
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

const SkipMessage = styled.div`
  z-index: 10;
  opacity: 1;
  color: #fff;
  font-size: 2em;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
