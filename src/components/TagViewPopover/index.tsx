import ArrowLeftIcon from "../../assets/icons/icon_arrow_left_white.svg?react";
import usePlayerStore from "../../store/playerStore";
import RedTagIcon from "../../assets/icons/mark_red.svg?react";
import styled from 'styled-components';

interface TagViewPopoverProps {
  isShow: boolean;
}

export const TagViewPopover = ({ isShow }: TagViewPopoverProps) => {
  const setIsShowTagView = usePlayerStore((state) => state.setIsShowTagView);

  return (
    <PopoverContainer isShow={isShow}>
      <FlexCol gap={8} style={{ paddingLeft: 4 }}>
        <FlexRow>
          <IconButton onClick={() => setIsShowTagView(false)}>
            <ArrowLeftIcon width={24} style={{ transform: 'scaleX(-1)' }} />
          </IconButton>
          <div style={{ fontSize: 14 }}>태그 추가</div>
        </FlexRow>
        {/* TODO: 태그 클릭 이벤트 필요 */}
        <FlexRow style={{ cursor: 'pointer' }} onClick={(e) => {}}>
          <TagIcon>
            <RedTagIcon width={36} height={24} />
          </TagIcon>
          <div style={{ fontSize: 14 }}>
            홈런
          </div>
        </FlexRow>
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

const TagIcon = styled.div`
  width: 24px;
  height: 24px;
  margin-right: 8px;
  background-color: white;
  border-radius: 9999px;
  padding: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`;