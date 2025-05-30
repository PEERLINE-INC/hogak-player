import ArrowDownIcon from "../../assets/icons/icon_arrow_down.svg?react";
import PlayingIcon from "../../assets/icons/icon_playing.svg?react";
import { createPlayerStore } from "../../store/playerStore";

import styled from 'styled-components';
import useMultiViewStore from "../../store/multiViewStore";
import { MultiViewSource } from "../HogakPlayer/interfaces";
import i18next from "i18next";

interface MultiViewPopoverProps {
  playerStore: ReturnType<typeof createPlayerStore>;
  isShow: boolean;
  getCurrentSeconds: () => number;
}

export const MultiViewPopoverSmall = ({ isShow, getCurrentSeconds, playerStore }: MultiViewPopoverProps) => {
  const url = playerStore((state) => state.url);
  const setUrl = playerStore((state) => state.setUrl);
  const setIsShowMultiView = playerStore((state) => state.setIsShowMultiView);
  const setIsPanoramaMode = playerStore((state) => state.setIsPanoramaMode);
  const multiViewSources = useMultiViewStore((state) => state.multiViewSources);
  const setPendingSeek = useMultiViewStore((state) => state.setPendingSeek);

  const handleChangeMultiView = (source: MultiViewSource) => {
    const seconds = getCurrentSeconds();
    setPendingSeek(seconds);
    console.log('handleChangeMultiView', source, seconds);
    setIsPanoramaMode(source.isPanorama ?? false);
    setUrl(source.url);

    {/* 250306 윤영민 변경 */}
    setIsShowMultiView(false)
  };

  return (
    <PopoverContainer $isShow={isShow} className="hogak-popover">

      {/* 241224 클래스 추가 */}
      <FlexRow gap={12} className='popover_list'>
        {/* 250214 스타일 수정 */}
        {multiViewSources.map((source, index) => (
            <FlexCol gap={8} key={index} onClick={() => handleChangeMultiView(source)} style={{ cursor: 'pointer', width: 'auto', height: '100%' }}>

              
              {/* 250214 높이 수정, 비율 수정 */}
              <div style={{ position: 'relative', aspectRatio: '4 / 3', height: '100%' }}>
              <img
                src={source.thumbnailUrl}
                alt="image"
                style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
              />

              {/* 241224 스타일 수정 */}{/* 250214 스타일 수정 및 구조변경 */}
              <FlexCol gap={4}>
                <div style={{ fontSize: '1.2em', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', position: 'absolute', bottom: '0', background: 'rgba(0,0,0,0.5)', padding: '0.4em 0.6em'  }}>
                  {source.title}
                </div>
                {/* <div style={{ fontSize: '0.8em', color: '#999' }}>
                  {source.description}
                </div> */}
              </FlexCol>
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
                    fontSize: '1.4em', /* 250214 수정 */
                    flexDirection: 'column',
                    background: 'rgba(0,0,0,0.7)'
                  }}
                >
                  <IconButton className="playing_icon">
                    <PlayingIcon></PlayingIcon>
                  </IconButton>
                  {i18next.t('message.playing_small')}
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

// 250214 스타일 수정
const PopoverContainer = styled.div<{ $isShow: boolean }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  min-width: 18em;
  height: 38%;
  min-height: 6.8em;
  background-color: rgba(0, 0, 0, 0.66);
  display: ${(props) => (props.$isShow ? 'flex' : 'none')}; /* 상태에 따라 표시/숨김 */
  z-index: 2;
  padding: 0.8em 4em 0.8em 0.8em;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  color: white;
  box-sizing: border-box;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  gap: 0.9em;
`

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
    /* padding-bottom: 1em; 250214 삭제 */
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
  @media screen and (min-width: 468px){font-size:12.4px;}
  @media screen and (min-width: 504px){font-size:12.6px;}
  @media screen and (min-width: 540px){font-size:12.8px;} 
`;