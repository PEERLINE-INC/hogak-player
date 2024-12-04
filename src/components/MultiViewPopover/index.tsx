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
      <IconButton onClick={() => setIsShowMultiView(false)}>
          <ArrowLeftIcon width={24} style={{ transform: 'scaleX(-1)' }} />
        </IconButton>
      <FlexCol gap={8} style={{ paddingLeft: 4 }}>
        {multiViewSources.map((source, index) => (
            <FlexRow gap={8} key={index} onClick={() => setUrl(source.url)} style={{ cursor: 'pointer' }}>
              <div style={{ flex: 4, position: 'relative' }}>
              <img
                src={source.thumbnailUrl}
                alt="image"
                style={{ width: '100%', height: 'auto', display: 'block' }}
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
                    fontSize: 10,
                  }}
                >
                  재생중입니다
                </div>
              )}
            </div>
              <FlexCol gap={4} style={{ flex: 6 }}>
                <div style={{ fontSize: 14 }}>
                  {source.title}
                </div>
                <div style={{ fontSize: 10, color: 'gray' }}>
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
  background-color: rgba(0, 0, 0, 0.6);
  display: ${(props) => (props.isShow ? 'flex' : 'none')}; /* 상태에 따라 표시/숨김 */
  z-index: 2;
  padding: 8px;
  flex-direction: column;
  justify-content: flex-start;
  color: white;

  height: calc(100% - 6px);
  box-sizing: border-box;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
`;

const FlexRow = styled.div<{ gap?: number }>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.gap || 0}px;
`;

const FlexCol = styled.div<{ gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.gap || 0}px;
`;

const IconButton = styled.div`
  width: 24px;
  padding: 4px;
  cursor: pointer;
`;