import ArrowLeftIcon from "../../assets/icons/icon_arrow_left_white.svg?react";
import usePlayerStore from "../../store/playerStore";

import styled from 'styled-components';
import useMultiViewStore from "../../store/multiViewStore";

interface MultiViewPopoverProps {
  isShow: boolean;
}

export const MultiViewPopover = ({ isShow }: MultiViewPopoverProps) => {
  const url = usePlayerStore((state) => state.url);
  const setUrl = usePlayerStore((state) => state.setUrl);
  const setIsShowMultiView = usePlayerStore((state) => state.setIsShowMultiView);
  const multiViewSources = useMultiViewStore((state) => state.multiViewSources);

  return (
    <PopoverContainer isShow={isShow}>
      <IconButton onClick={() => setIsShowMultiView(false)} className="back_btn">
        <ArrowLeftIcon style={{ transform: 'scaleX(-1)' }} />
      </IconButton>

      {/* 241224 클래스 추가 */}
      <FlexCol gap={12} className='popover_list'>
        {multiViewSources.map((source, index) => (
            <FlexRow gap={8} key={index} onClick={() => setUrl(source.url)} style={{ cursor: 'pointer' }}>
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
                  {source.title}
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
`;