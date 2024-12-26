import styled from "styled-components";
import CancelIcon from '../../assets/icons/icon_cancel.svg?react';
import SaveIcon from '../../assets/icons/icon_save.svg?react';
import { ToastPopup } from "../ToastPopup";
import ArrowLeftIcon from "../../assets/icons/icon_arrow_left_white.svg?react";
import TagViewIcon from "../../assets/icons/icon_tag_white.svg?react";
import ScreenCastIcon from '../../assets/icons/icon_screencast.svg?react';
import MultiViewIcon from "../../assets/icons/icon_multiview.svg?react";


export const ClipViewPopover = () => {
    return (
        <PopoverContainer>
            <TopContainer>
                <FlexRow style={{width: 'calc(100% - 10em'}}>
                    <IconButton /* onClick={() => {
                    if (onBack) {
                        onBack();
                    }
                    }} */
                    className='back_btn'
                    >
                    <ArrowLeftIcon width={'100%'} height={'100%'} />
                    </IconButton>
                    {/* 241224 스타일 삭제 및 video_title 클래스 추가 */}
                    <div className='video_title'/* style={{ color: 'white', marginLeft: 16 }} */>{/* {title} */}</div>
                </FlexRow>


                <FlexRow gap={12}>
                    <IconButton className='tag_btn'>
                    <TagViewIcon/>
                    </IconButton>
                    <IconButton className='screencast_btn'>
                    <ScreenCastIcon/>
                    </IconButton>
                    { /* multiViewSources.length && */ <IconButton /* onClick={() => setIsShowMultiView(true)}  */className='multiview_btn'>
                    <MultiViewIcon/>
                    </IconButton>}
                </FlexRow>
            </TopContainer>

            <MiddleContainer>
                
                <ToastPopup message="클립 구간바 재생"/>
                <FlexCol style={{paddingRight: '1.6em', gap: '2em'}}>
                    <FlexCol>
                        <IconButton className='side_icon side_save'>
                            <SaveIcon/>
                            <p className='side_icon_name'>저장</p>
                        </IconButton>
                    </FlexCol>
                <FlexCol>
                    <IconButton className='side_icon side_cancel'>
                    <CancelIcon/>
                    <p className='side_icon_name'>취소</p>
                    </IconButton>
                </FlexCol>
                </FlexCol>
            </MiddleContainer>

            <ClipRangeWrap>

            </ClipRangeWrap>
            
        </PopoverContainer>


    )
}

const PopoverContainer = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 2;
    background-color: rgba(0,0,0,.6);
`
const TopContainer = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 1.2em 1.6em 0 1.6em;

    .video_title {
    color: #ffffff;
    font-size: 1.3em;
    margin-left: 0.8em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    }
`;

const MiddleContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
`;

const IconButton = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &.back_btn {
    width: 1.4em;
    height: 2.4em;
    }
    &.tag_btn {
    width: 1.8em;
    height: 1.8em;
    }
    &.screencast_btn {
    width: 1.7em;
    height: 1.5em;
    }
    &.multiview_btn {
    width: 2em;
    height: 1.5em;
    }
    &.play_btn {
    width: 5em;
    height: 5em;
    }
    &.side_icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: auto;
        height: auto;
    }
    &.side_icon.side_save svg{
        width: 1.4em;
        height: 1.7em;
    }
    &.side_icon.side_cancel svg {
        width: 1.3em;
        height: 1.3em;
    }
    .side_icon_name {
        font-size: 1.1em;
        line-height: 1.6em;
        color: #ffffff;
        margin: 0;
    }
    svg {
        width: 100%;
        height: 100%;
    }
    

`
const FlexRow = styled.div<{ gap?: number }>`
    display: flex;
    align-items: center;
  gap: ${(props) => props.gap ? props.gap * 0.1 : 0}em; /* 241224 gap em 단위 수정 */
`;

const FlexCol = styled.div<{ gap?: number }>`
display: flex;
flex-direction: column;
gap: ${(props) => props.gap ? props.gap * 0.1 : 0}em; 
`;

const ClipRangeWrap = styled.div`
    background-color: #000;
    width: 100%;
    height: 26%;
    min-height: 5.9em;
`
