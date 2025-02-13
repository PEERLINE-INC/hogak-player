import ArrowDownIcon from "../../assets/icons/icon_arrow_down.svg?react";
import PlayingIcon from "../../assets/icons/icon_playing.svg?react";
import usePlayerStore from "../../store/playerStore";

import styled from 'styled-components';
import useMultiViewStore from "../../store/multiViewStore";
import { MultiViewSource } from "../HogakPlayer/interfaces";

interface MultiViewPopoverProps {
  isShow: boolean;
  getCurrentSeconds: () => number;
}

export const MultiViewPopoverSmall = ({ isShow, getCurrentSeconds }: MultiViewPopoverProps) => {
  const url = usePlayerStore((state) => state.url);
  const setUrl = usePlayerStore((state) => state.setUrl);
  const setIsShowMultiView = usePlayerStore((state) => state.setIsShowMultiView);
  const setIsPanoramaMode = usePlayerStore((state) => state.setIsPanoramaMode);
  const multiViewSources = useMultiViewStore((state) => state.multiViewSources);
  const setPendingSeek = useMultiViewStore((state) => state.setPendingSeek);

  const handleChangeMultiView = (source: MultiViewSource) => {
    const seconds = getCurrentSeconds();
    setPendingSeek(seconds);
    console.log('handleChangeMultiView', source, seconds);
    setIsPanoramaMode(source.isPanorama ?? false);
    setUrl(source.url);
  };

  return (
    <PopoverContainer isShow={isShow} className="hogak-popover">

      {/* 241224 클래스 추가 */}
      <FlexRow gap={12} className='popover_list'>
        {multiViewSources.map((source, index) => (
            <FlexCol gap={8} key={index} onClick={() => handleChangeMultiView(source)} style={{ cursor: 'pointer', width: '20%', height: 'calc(100% - 1em)' }}>

              {/* 241224 스타일 수정 */}
              <FlexCol gap={4}>
                <div style={{ fontSize: '1em', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'  }}>
                  {source.title}
                </div>
                {/* <div style={{ fontSize: '0.8em', color: '#999' }}>
                  {source.description}
                </div> */}
              </FlexCol>
              <div style={{ position: 'relative', aspectRatio: '5 / 3', height: 'calc(100% - 1em)' }}>
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
                    flexDirection: 'column',
                    background: 'rgba(0,0,0,0.7)'
                  }}
                >
                  <IconButton className="playing_icon">
                    <PlayingIcon></PlayingIcon>
                  </IconButton>
                  재생중
                </div>
              )}
            </div>
              {/* 241224 스타일 수정 */}
              
            </FlexCol>
          )
        )}
      </FlexRow>

      <FlexRow className="down_btn_wrap">
        <IconButton onClick={() => setIsShowMultiView(false)} className="down_btn">
          <ArrowDownIcon style={{ transform: 'scaleX(-1)' }} />
        </IconButton>
      </FlexRow> 
    </PopoverContainer>
  );
};

const PopoverContainer = styled.div<{ isShow: boolean }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%; 
  min-width: 18em;
  height: 30%;
  min-height: 6.8em;
  background-color: rgba(0, 0, 0, 0.66);
  display: ${(props) => (props.isShow ? 'flex' : 'none')}; /* 상태에 따라 표시/숨김 */
  z-index: 2;
  padding: 1em 4em 0.4em 1.8em;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  color: white;
  box-sizing: border-box;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  gap: 0.9em;
`;

const FlexRow = styled.div<{ gap?: number }>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.gap ? props.gap * 0.1 : 0}em; /* 241224 gap em 단위 수정 */
  &.flex-end {
    justify-content: flex-end;
  }
  &.popover_list {
    overflow: hidden;
    overflow-x: auto;
    padding-bottom: 1em;
    align-items: stretch;
    gap: 0.9em;
    width: 100%;
  }
  &.popover_list::-webkit-scrollbar {
    height: 0.3em;
  }
  &.popover_list::-webkit-scrollbar-thumb {
    background-color: #808080;
    border-radius: 0.4em;
  }
  &.down_btn_wrap {
    position: absolute;
    right: 1.7em;
    top: 2em;
  }
`;

const FlexCol = styled.div<{ gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.gap ? props.gap * 0.1 : 0}em; /* 241224 gap em 단위 수정 */
`;

const IconButton = styled.div`
  width: 24px;
  /* padding: 4px; */
  cursor: pointer;

  /* 241224 추가 */
  &.down_btn {
    width: 1.2em;
    height: 0.7em;
  }
  &.playing_icon {
    width: 10%;
    height: auto;
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