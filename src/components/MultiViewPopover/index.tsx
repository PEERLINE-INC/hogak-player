import ArrowLeftIcon from "../../assets/icons/icon_arrow_left_white.svg?react";
import usePlayerStore from "../../store/playerStore";

import styled from 'styled-components';
import useMultiViewStore from "../../store/multiViewStore";
import { MultiViewSource } from "../HogakPlayer/interfaces";
import { useEffect } from "react";

interface MultiViewPopoverProps {
  isShow: boolean;
  seekTo: (seconds: number, type: 'seconds' | 'fraction') => void;
  getCurrentSeconds: () => number;
}

export const MultiViewPopover = ({ isShow, seekTo, getCurrentSeconds }: MultiViewPopoverProps) => {
  const url = usePlayerStore((state) => state.url);
  const setUrl = usePlayerStore((state) => state.setUrl);
  const setIsShowMultiView = usePlayerStore((state) => state.setIsShowMultiView);
  const isReady = usePlayerStore((state) => state.isReady);
  const setIsReady = usePlayerStore((state) => state.setIsReady);
  const setIsPanoramaMode = usePlayerStore((state) => state.setIsPanoramaMode);
  const multiViewSources = useMultiViewStore((state) => state.multiViewSources);
  const pendingSeek = useMultiViewStore((state) => state.pendingSeek);
  const setPendingSeek = useMultiViewStore((state) => state.setPendingSeek);

  const handleChangeMultiView = (source: MultiViewSource) => {
    const seconds = getCurrentSeconds();
    setPendingSeek(seconds);
    setIsReady(false);
    console.log('handleChangeMultiView', source, seconds);
    setIsPanoramaMode(source.isPanorama ?? false);
    setUrl(source.url);
  };

  const handlePlayerReady = () => {
    if (pendingSeek !== null) {
      seekTo(pendingSeek, 'seconds');
      setPendingSeek(null);
    }
  };
  
  useEffect(() => {
    if (isReady) {
      handlePlayerReady();
    }
  }, [isReady]);

  return (
    <PopoverContainer isShow={isShow}>
      <IconButton onClick={() => setIsShowMultiView(false)} className="back_btn">
        <ArrowLeftIcon style={{ transform: 'scaleX(-1)' }} />
      </IconButton>

      {/* 241224 클래스 추가 */}
      <FlexCol gap={12} className='popover_list'>
        {multiViewSources.map((source, index) => (
            <FlexRow gap={8} key={index} onClick={() => handleChangeMultiView(source)} style={{ cursor: 'pointer' }}>
              {/* 241224 스타일 수정 */}
              <div style={{ position: 'relative', width: '6.6em', height: '4.8em' }}>
              <img
                src={source.thumbnailUrl}
                alt="image"
                style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
              />
              {url === source.url && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    fontSize: '1em', /* 241224 수정 */
                  }}
                >
                  재생중입니다
                </div>
              )}
            </div>
              {/* 241224 스타일 수정 */}
              <FlexCol gap={4} style={{ width: 'calc(100% - 7.4em'}}>
                <div style={{ fontSize: '1em' }}>
                  {source.title}
                </div>
                <div style={{ fontSize: '0.8em', color: '#999' }}>
                  {source.description}
                </div>
              </FlexCol>
            </FlexRow>
          )
        )}
      </FlexCol>
    </PopoverContainer>
  );
};

const PopoverContainer = styled.div<{ isShow: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  width: 33.33%; /* 화면의 1/3 크기 */
  min-width: 18em;
  background-color: rgba(0, 0, 0, 0.86);
  display: ${(props) => (props.isShow ? 'flex' : 'none')}; /* 상태에 따라 표시/숨김 */
  z-index: 2;
  padding: 1.3em 1.5em;
  flex-direction: column;
  justify-content: flex-start;
  color: white;

  height: 100%; /* 241224 수정 */
  box-sizing: border-box;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  gap: 0.9em;
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
  
  /* 241224 추가 */
  &.popover_list {
    overflow: hidden;
    overflow-y: auto;
  }
  &.popover_list::-webkit-scrollbar {
    width: 0.3em;
  }
  &.popover_list::-webkit-scrollbar-thumb {
    background-color: #808080;
    border-radius: 0.4em;
  }
`;

const IconButton = styled.div`
  width: 24px;
  /* padding: 4px; */
  cursor: pointer;

  /* 241224 추가 */
  &.back_btn {
    width: 1.4em;
    height: 2.4em;
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