import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import styled, { createGlobalStyle } from 'styled-components';

// ✅ store (zustand 등)에서 가져오는 상태 & 액션들
import usePlayerStore from '../../store/playerStore';
import useMultiViewStore from '../../store/multiViewStore';
import useTagStore from '../../store/tagViewStore';
import useClipStore from '../../store/clipViewStore';

// ✅ UI 컴포넌트들
import { Controls } from '../Controls';
import { MultiViewPopover } from '../MultiViewPopover';
import { TagViewPopover } from '../TagViewPopover';
import { ClipViewPopover } from '../ClipViewPopover';

// import screenfull from 'screenfull';
import "pretendard/dist/web/static/pretendard.css";
import { MultiViewPopoverSmall } from '../MultiViewPopoverSmall';

// ✅ 인터페이스
import { HogakPlayerProps } from './interfaces';

import 'pretendard/dist/web/static/pretendard.css';
import Player from 'video.js/dist/types/player';
import '@theonlyducks/videojs-zoom';
import '@theonlyducks/videojs-zoom/styles';
import usePinchZoomAndMove from '../../hooks/usePinchZoomMove';
import { TagSaveViewPopover } from '../TagSaveViewPopover';
import useLiveStore from '../../store/liveStore';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0; 
    padding: 0; 
    box-sizing: border-box;
  }

  html, body, #root {
    margin: 0; 
    padding: 0;
    height: 100%;
    font-family: 'Pretendard';
    font-weight: 400;
    letter-spacing: -0.02px;
  }
`;

export const HogakPlayer = forwardRef(function HogakPlayer(
  props: HogakPlayerProps,
  ref
) {
  /**
   * ----------------------------------------------------------------
   * 1. 기존 store / props 로직 그대로 가져오기
   * ----------------------------------------------------------------
   */
  const url = usePlayerStore((state) => state.url);
  const setUrl = usePlayerStore((state) => state.setUrl);
  const setTitle = usePlayerStore((state) => state.setTitle);
  const isLive = usePlayerStore((state) => state.isLive);
  const setIsLive = usePlayerStore((state) => state.setIsLive);

  const pip = usePlayerStore((state) => state.pip);
  const isPlay = usePlayerStore((state) => state.isPlay);
  const setIsPlay = usePlayerStore((state) => state.setIsPlay);
  const duration = usePlayerStore((state) => state.duration);
  const setDuration = usePlayerStore((state) => state.setDuration);
  const setPlayed = usePlayerStore((state) => state.setPlayed);
  const volume = usePlayerStore((state) => state.volume);

  const isShowMultiView = usePlayerStore((state) => state.isShowMultiView);
  const setMultiViewSources = useMultiViewStore(
    (state) => state.setMultiViewSources
  );

  const isShowTagView = usePlayerStore((state) => state.isShowTagView);
  const setIsShowTagView = usePlayerStore((state) => state.setIsShowTagView);
  const setTags = useTagStore((state) => state.setTags);
  const setTagMenus = useTagStore((state) => state.setTagMenus);

  const enableDefaultFullScreen = props.enableDefaultFullscreen ?? true;
  const isFullScreen = usePlayerStore((state) => state.isFullScreen);
  const setIsShowClipView = usePlayerStore((state) => state.setIsShowClipView);
  const isShowClipView = usePlayerStore((state) => state.isShowClipView);
  const setIsReady = usePlayerStore((state) => state.setIsReady);
  const setBackIconType = usePlayerStore((state) => state.setBackIconType);
  const skipDirection = usePlayerStore((state) => state.skipDirection);
  const setIsViewThumbMarker = usePlayerStore((state) => state.setIsViewThumbMarker);

  const setCurrentSeconds = useClipStore((state) => state.setCurrentSeconds);
  const speed = usePlayerStore((state) => state.speed);
  const isShowTagSaveView = usePlayerStore((state) => state.isShowTagSaveView);
  const isPanoramaMode = usePlayerStore((state) => state.isPanoramaMode);
  const setIsPanoramaMode = usePlayerStore((state) => state.setIsPanoramaMode);
  const isDisableClip = usePlayerStore((state) => state.isDisableClip);
  const setIsDisableClip = usePlayerStore((state) => state.setIsDisableClip);
  const isDisableTag = usePlayerStore((state) => state.isDisableTag);
  const setIsDisableTag = usePlayerStore((state) => state.setIsDisableTag);
  const setIsDisableMultiView = usePlayerStore((state) => state.setIsDisableMultiView);

  const setAtLive = useLiveStore((state) => state.setAtLive);

  // 외부에서 주어지는 콜백들
  const onBack = props.onBack ?? (() => {});
  const onClickTagButton = props.onClickTagButton ?? (() => {});
  const onChangeClipDuration = props.onChangeClipDuration ?? (() => {});
  const onClickClipSave = props.onClickClipSave ?? (() => {});
  const onClickTagSave = props.onClickTagSave ?? (() => {});
  const onClickTagCancel = props.onClickTagCancel ?? (() => {});

  /**
   * ----------------------------------------------------------------
   * 2. Video.js 관련 ref & 초기화
   * ----------------------------------------------------------------
   */
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<Player | null>(null);
  // ClipViewPopover와 연동하는 ref
  const setClipValuesRef = useRef<((values: number[]) => void) | null>(null);
  const zoomPluginRef = useRef<any>(null);
  const { setScale, setCurrentOffset } = usePinchZoomAndMove(playerContainerRef, zoomPluginRef);

  // Video.js Player 초기화
  useEffect(() => {
    if (!url) return; // URL이 없으면 초기화하지 않음

    if (!playerRef.current) {
      const videoElement = document.createElement('video-js');
      videoRef.current?.appendChild(videoElement);
      
      // Video.js 인스턴스 생성
      const player = videojs(videoElement, {
        liveTracker: isLive,
        autoplay: false,
        enableSmoothSeeking: true,
        playsinline: true,
        controls: false,
        aspectRatio: '16:9',
        sources: [{
          src: url,
          type: 'application/x-mpegurl'
        }]
      });
      
      playerRef.current = player;
      // @ts-ignore
      const zoomPlugin = player.zoomPlugin({
        showZoom: false,
        showMove: false,
        showRotate: false,
        gestureHandler: false,
      });
      zoomPluginRef.current = zoomPlugin;

      // 이벤트 리스너 등록
      player.on('ready', handleOnReady);
      player.on('play', handleOnPlay);
      player.on('timeupdate', handleOnTimeUpdate);
      player.on('ended', handleOnEnded);
      player.on('loadedmetadata', handleOnDuration);
      player.on('error', handleOnError);
      if (isLive) {
        // @ts-ignore
        player.liveTracker.on('seekableendchange', handleOnSeekableEndChange);
        // @ts-ignore
        player.liveTracker.on('liveedgechange', handleOnLiveEdgeChange);
      }
    } else {
      // player가 이미 존재하면 source만 업데이트
      playerRef.current.src({
        src: url,
        type: 'application/x-mpegurl'
      });
      playerRef.current.play();
    }
  }, [url, isLive]); // url, isLive 변경될 때만 실행

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  /**
   * ----------------------------------------------------------------
   * 3. props.isPlay / volume / pip 등의 값 반영
   * ----------------------------------------------------------------
   */
  useEffect(() => {
    if (!playerRef.current) return;
    if (isPlay) {
      playerRef.current.play()?.catch((error) => {
        console.error('Error playing video :', error);
      });
    } else {
      playerRef.current.pause();
    }
  }, [isPlay]);

  useEffect(() => {
    if (!playerRef.current) return;
    if (volume !== undefined) {
      playerRef.current.volume(volume);
    }
  }, [volume]);

  // Video.js는 기본적으로 PIP를 직접 지원하지 않으므로,
  // 필요하다면 별도 플러그인을 사용하거나 브라우저 Picture-in-Picture API를 래핑해야 함.
  useEffect(() => {
    if (pip) {
      // pip 활성화 로직(별도 구현 필요)
      console.log('[Video.js] PIP requested - 별도 구현 필요');
    }
  }, [pip]);

  // 재생 속도
  useEffect(() => {
    if (!playerRef.current) return;
    playerRef.current.playbackRate(speed);
  }, [speed]);

  /**
   * ----------------------------------------------------------------
   * 4. 기존 useEffects: store 업데이트
   * ----------------------------------------------------------------
   */
  // url, title, multiView, tag 등등은 기존과 동일하게 처리
  useEffect(() => {
    setIsPlay(props.isPlay ?? false);
  }, [props.isPlay]);

  useEffect(() => {
    setIsLive(props.isLive ?? false);
  }, [props.isLive]);

  useEffect(() => {
    setIsPanoramaMode(props.isPanorama ?? false);
  }, [props.isPanorama]);

  useEffect(() => {
    setUrl(props.url);
    if (isPanoramaMode) {
      setScale(1);
      setCurrentOffset(0, 0);
    } else {
      setScale(1);
      setCurrentOffset(0, 0);
    }
  }, [props.url]);

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

  // 풀스크린 로직 (screenfull → Video.js 자체 fullscreen or 별도 라이브러리)
  useEffect(() => {
    if (props.onChangeFullScreen) {
      props.onChangeFullScreen(isFullScreen);
    }
    setScale(1);
    setCurrentOffset(0, 0);

    if (!enableDefaultFullScreen) return;

    // Video.js 자체 풀스크린 (requestFullscreen / exitFullscreen)
    // isFullScreen 상태가 바뀌면 직접 제어
    // if (playerRef.current) {
    //   if (isFullScreen) {
    //     playerRef.current.requestFullscreen();
    //   } else {
    //     playerRef.current.exitFullscreen();
    //   }
    // }
  }, [isFullScreen]);

  useEffect(() => {
    setIsDisableClip(props.disableClip ?? false);
    setIsDisableTag(props.disableTag ?? false);
    setIsDisableMultiView(props.disableMultiView ?? false);
  }, [props.disableClip, props.disableTag, props.disableMultiView]);

  /**
   * ----------------------------------------------------------------
   * 5. Video.js 이벤트 핸들러들
   * ----------------------------------------------------------------
   */

  useEffect(() => {
    console.log(`
██╗  ██╗ ██████╗  ██████╗  █████╗ ██╗  ██╗    ██████╗ ██╗      █████╗ ██╗   ██╗███████╗██████╗ 
██║  ██║██╔═══██╗██╔════╝ ██╔══██╗██║ ██╔╝    ██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗
███████║██║   ██║██║  ███╗███████║█████╔╝     ██████╔╝██║     ███████║ ╚████╔╝ █████╗  ██████╔╝
██╔══██║██║   ██║██║   ██║██╔══██║██╔═██╗     ██╔═══╝ ██║     ██╔══██║  ╚██╔╝  ██╔══╝  ██╔══██╗
██║  ██║╚██████╔╝╚██████╔╝██║  ██║██║  ██╗    ██║     ███████╗██║  ██║   ██║   ███████╗██║  ██║
╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝    ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝                                                                                           
    `)
    console.log("%c Version : 0.5.2","color:red;font-weight:bold;");
  }, []);
  
  const handleOnReady = () => {
    console.log('onReady (video.js)');
    setIsReady(true);
  };

  const handleOnPlay = () => {
    console.log('onPlay (video.js)');
    setIsReady(true);
  };

  const handleOnTimeUpdate = () => {
    if (!playerRef.current) return;
    if (isLive) {
      // @ts-ignore
      const liveTracker = playerRef.current.liveTracker;
      const current = playerRef.current.currentTime() ?? 0;
      const duration = liveTracker.liveWindow();
      const atLive = liveTracker.atLiveEdge();
      // console.log('handleOnTimeUpdate duration (live)', duration);
      setDuration(duration);
      setPlayed(current / duration);
      setAtLive(atLive);
    } else {
      // played = (현재시간 / 전체길이)
      const current = playerRef.current.currentTime() ?? 0;
      const duration = playerRef.current.duration() ?? 1; // 0일 경우 대비
      const playedFraction = current / duration;
      // console.log('handleOnTimeUpdate (video.js)', playedFraction);
      setPlayed(playedFraction);
    }
  };

  const handleOnEnded = () => {
    console.log('onEnded (video.js)');
    setIsPlay(false);
  }

  const handleOnDuration = () => {
    if (!playerRef.current) return;
    const duration = playerRef.current.duration() || 0;
    console.log('onDuration (video.js)', duration);
    setDuration(duration);
  };

  const handleOnError = () => {
    console.error('onError (video.js)', playerRef.current?.error());
  };

  const handleOnLiveEdgeChange = () => {
    console.log('onLiveEdgeChange (video.js)');
  };

  const handleOnSeekableEndChange = () => {
    // @ts-ignore
    const liveTracker = playerRef.current.liveTracker;
    console.log('onSeekableEndChange (video.js)', liveTracker.seekableEnd());
  };

  const seekTo = (value: number, type: 'seconds' | 'fraction') => {
    if (!playerRef.current) return;

    // fraction일 경우 전체 길이에 비례해 계산
    if (type === 'fraction') {
      if (value < 0 || value > 1) {
        throw new Error('Invalid seek value');
      }
      playerRef.current.currentTime(duration * value);
    } else {
      // seconds
      playerRef.current.currentTime(value);
    }
  };

  const getCurrentSeconds = () => {
    return playerRef.current?.currentTime() ?? 0;
  };

  const seekToLive = () => {
    if (!isLive) return;
    if (!playerRef.current) return;

    // @ts-ignore
    const liveTracker = playerRef.current.liveTracker;
    liveTracker.seekToLiveEdge();
  };

  /**
   * ----------------------------------------------------------------
   * 6. 외부에서 호출하는 메소드 (useImperativeHandle)
   * ----------------------------------------------------------------
   */
  useImperativeHandle(ref, () => ({
    getCurrentSeconds: () => {
      return playerRef.current?.currentTime() ?? 0;
    },
    setClipView: (value: boolean, initialCurrentSeconds?: number) => {
      if (isDisableClip) return;
      if (value) {
        setIsPlay(false);
        let currentSeconds = playerRef.current?.currentTime() ?? 0;
        if (initialCurrentSeconds) {
          currentSeconds = initialCurrentSeconds;
        }
        setCurrentSeconds(currentSeconds);
        setIsShowClipView(true);
      } else {
        setIsShowClipView(false);
        // 닫힐 때, 재생 상태 복구
        if (!isPlay) {
          setIsPlay(true);
        }
      }
    },
    setClipValues: (values: number[]) => {
      if (isDisableClip) return;
      if (values.length !== 2 || values[0] >= values[1]) {
        throw new Error('Invalid clip values');
      }
      if (typeof values[0] !== 'number' || typeof values[1] !== 'number') {
        throw new Error('Invalid clip values type');
      }
      if (setClipValuesRef.current) {
        setClipValuesRef.current(values);
      }
    },
    setTagView: (value: boolean) => {
      if (isDisableTag) return;
      setIsShowTagView(value);
    },
    seekTo: seekTo,
    setIsViewThumbMarker: (v: boolean) => {
      if (isDisableTag) return;
      setIsViewThumbMarker(v);
    },
    getIsFullScreen: () => isFullScreen,
  }));

  /**
   * ----------------------------------------------------------------
   * 7. 최종 렌더
   *  - 기존 스타일, Popover, Controls, ClipViewPopover 등 유지
   * ----------------------------------------------------------------
   */
  return (
    <PlayerContainer width={props.width} height={props.height} ref={playerContainerRef}>
      {/* <input type="number" defaultValue={100} onChange={(e) => {
        zoomPluginRef.current?.move(Number(e.target.value), Number(e.target.value));
      }} />
      <button onClick={() => {
        zoomPluginRef.current?.move(0, 0);
      }}>
        move
      </button> */}
      <GlobalStyles />
      <Container>
        <PlayerWrapper>
          {/* Video.js가 제어할 video 엘리먼트 */}
          <div ref={videoRef} className="hogak-player"></div>

          {/* 250113 풀스크린 true/false 멀티뷰 팝업 추가 */}
          {isFullScreen &&
            <MultiViewPopover isShow={isShowMultiView} seekTo={seekTo} getCurrentSeconds={getCurrentSeconds} />
          }
          {!isFullScreen &&
            <MultiViewPopoverSmall isShow={isShowMultiView} seekTo={seekTo} getCurrentSeconds={getCurrentSeconds} />
          }
          <TagSaveViewPopover isShow={isShowTagSaveView} onCancel={onClickTagCancel} onSave={onClickTagSave} />
          <TagViewPopover isShow={isShowTagView} onAddTagClick={props.onClickAddTag} />
          <Controls playerRef={playerRef} seekTo={seekTo} seekToLive={seekToLive} onBack={onBack} onClickTagButton={onClickTagButton} />
          <ClipViewPopover
            seekTo={seekTo}
            onChangeClipDuration={onChangeClipDuration}
            isShow={isShowClipView}
            setValuesRef={setClipValuesRef}
            onSave={onClickClipSave}
          />
          {skipDirection && (
            <SkipMessage style={{ left: skipDirection === 'left' ? "30%" : "70%", top: "50%" }}>{/* 250113 left 값 수정 */}
              <span style={{fontSize: '1.4em'}}>
                {skipDirection === 'left' ? '-10초' : '+10초'}
              </span>
            </SkipMessage>
          )}
        </PlayerWrapper>
      </Container>
    </PlayerContainer>
  )
})

/**
 * ----------------------------------------------------------------
 * 8. 스타일 정의
 * ----------------------------------------------------------------
 */
const Container = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  height: 100%; /* 240108 추가 */
`;

const PlayerContainer = styled.div<{
  width: number | undefined;
  height: number | undefined;
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${(props) => (props.width ? `width: ${props.width}px;` : 'width: 100%;')}
  ${(props) => (props.height ? `height: ${props.height}px;` : 'height: 100%;')}

  font-size: 5px;
  @media screen and (min-width: 216px) {
    font-size: 6px;
  }
  @media screen and (min-width: 229px) {
    font-size: 6.3611px;
  }
  @media screen and (min-width: 250px) {
    font-size: 6.9444px;
  }
  @media screen and (min-width: 252px) {
    font-size: 7px;
  }
  @media screen and (min-width: 288px) {
    font-size: 8px;
  }
  @media screen and (min-width: 292px) {
    font-size: 8.1111px;
  }
  @media screen and (min-width: 320px) {
    font-size: 8.8888px;
  }
  @media screen and (min-width: 324px) {
    font-size: 9px;
  }
  @media screen and (min-width: 360px) {
    font-size: 10px;
  }

  .hogak-player {
    object-fit: cover;
    padding: 0;
    margin: 0;
    font-size: 0;
  }
`;

const PlayerWrapper = styled.div`
  position: relative;
  height: 100%;

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
  color: #fff;
  position: absolute;
  transform: translate(-50%, -50%);
  /* 250113 스타일 추가 */
  background-color: rgba(217, 217, 217,.2);
  width: 5em;
  height: 5em;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
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
