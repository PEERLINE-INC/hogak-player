// import ArrowLeftIcon from "../../assets/icons/icon_arrow_left_white.svg?react";
import usePlayerStore from "../../store/playerStore";
import RedTagIcon from "../../assets/icons/mark_red.svg?react";
import styled from 'styled-components';
import { OnClickAddTagEventObject } from "../HogakPlayer/interfaces";
import CloseIcon from "../../assets/icons/icon_close.svg?react";

interface TagViewPopoverProps {
  isShow: boolean;
  onAddTagClick?: (data: OnClickAddTagEventObject) => void;
}

export const TagViewPopover = ({ isShow, onAddTagClick }: TagViewPopoverProps) => {
  const setIsShowTagView = usePlayerStore((state) => state.setIsShowTagView);
  const handleClickTag = (name: string) => {
    if (onAddTagClick) {
      onAddTagClick({
        seconds: 0,
        name: name,
      });
    }
  }

  return (
    <PopoverContainer isShow={isShow}>
      <FlexCol gap={8} style={{ paddingLeft: '1em', height: '100%' }}>
        <FlexRow style={{justifyContent: 'space-between'}}>
          {/* 241224 아이콘 변경 및 스타일 수정 */}
          {/* <IconButton onClick={() => setIsShowTagView(false)}>
            <ArrowLeftIcon style={{ transform: 'scaleX(-1)' }} />
          </IconButton> */}
          <div style={{ fontSize: '1.1em'}}>태그 추가</div>
          <IconButton onClick={() => setIsShowTagView(false)} className="close_btn">
            <CloseIcon/>
          </IconButton>
        </FlexRow>
        
        <FlexCol gap={12} className="popover_list">
          {['홈런'].map((tag, index) => {
            return (
              <FlexRow key={index} style={{ cursor: 'pointer' }} onClick={() => {
                handleClickTag(tag);
              }}>
                <TagIcon>
                  <RedTagIcon width={36} height={24} />
                </TagIcon>
                <div style={{ fontSize: '1em' }}>
                  {tag}
                </div>
              </FlexRow>
            )
          })}
        </FlexCol>
      </FlexCol>
    </PopoverContainer>
  );
};

const PopoverContainer = styled.div<{ isShow: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  width: 33.33%; /* 화면의 1/3 크기 */
  min-width: 14.5em;
  background-color: rgba(0, 0, 0, 0.6);
  display: ${(props) => (props.isShow ? 'flex' : 'none')}; /* 상태에 따라 표시/숨김 */
  z-index: 2;
  padding: 0.8em;
  flex-direction: column;
  justify-content: flex-start;
  color: white;

  height: 100%; /* 241224 수정 */
  box-sizing: border-box;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
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
 /*  padding: 4px; */
  cursor: pointer;

  /* 241224 추가 */
  &.close_btn {
    width: 2.2em;
    height: 2.2em;
  }
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const TagIcon = styled.div`
  width: 2.8em;
  height: 2.8em;
  margin-right: 0.8em;
  background-color: white;
  border-radius: 9999px;
  /* padding: 4px; */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;