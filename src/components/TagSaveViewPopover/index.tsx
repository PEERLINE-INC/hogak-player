import styled from "styled-components";
import CancelIcon from '../../assets/icons/icon_cancel.svg?react';
import SaveIcon from '../../assets/icons/icon_save.svg?react';
import ArrowLeftIcon from "../../assets/icons/icon_arrow_left_white.svg?react";
import TagViewIcon from "../../assets/icons/icon_tag_white.svg?react";
import ScreenCastIcon from '../../assets/icons/icon_screencast.svg?react';
import MultiViewIcon from "../../assets/icons/icon_multiview.svg?react";
import usePlayerStore from "../../store/playerStore";

interface TagSaveViewPopoverProps {
    isShow: boolean;
    onSave?: () => void;
    onCancel?: () => void;
}

export const TagSaveViewPopover = (props: TagSaveViewPopoverProps) => {
    const {
        isShow,
        onSave,
        onCancel,
    } = props;

    const isFullScreen = usePlayerStore((state) => state.isFullScreen);

    const handleCancel = () => {
        onCancel?.();
    };
    const handleSave = () => {
        handleCancel();
        onSave?.();
    };

    return (
        <PopoverContainer isShow={isShow}>
            <TopContainer>
                {/* 250113 클래스 네임 추가 */}
                <FlexRow style={{ width: 'calc(100% - 10em' }} className="icon_box">
                    <IconButton onClick={handleCancel}
                        className='back_btn'
                    >
                        <ArrowLeftIcon width={'100%'} height={'100%'} />
                    </IconButton>
                    {/* 241224 스타일 삭제 및 video_title 클래스 추가 */}
                    <div className='video_title'/* style={{ color: 'white', marginLeft: 16 }} */>{/* {title} */}</div>
                </FlexRow>

                {/* 250113 간격 수정 및  클래스 네임 추가 */}
                <FlexRow gap={16} className="icon_box">
                    <IconButton className='tag_btn'>
                        <TagViewIcon />
                    </IconButton>
                    <IconButton className='screencast_btn'>
                        <ScreenCastIcon />
                    </IconButton>
                    { /* multiViewSources.length && */ <IconButton /* onClick={() => setIsShowMultiView(true)}  */ className='multiview_btn'>
                        <MultiViewIcon />
                    </IconButton>}
                </FlexRow>
            </TopContainer>

            <MiddleContainer>
                {/* 250113 간격 수정 및 클래스 추가 */}
                <FlexCol style={{ paddingRight: '1em', gap: '1.3em' }} className="icon_box">
                    {isFullScreen && (
                        <>
                            <FlexCol>
                                <IconButton className='side_icon side_save' onClick={handleSave}>
                                    <SaveIcon />
                                    <p className='side_icon_name'>저장</p>
                                </IconButton>
                            </FlexCol>
                            <FlexCol>
                                <IconButton className='side_icon side_cancel' onClick={handleCancel}>
                                    <CancelIcon />
                                    <p className='side_icon_name'>취소</p>
                                </IconButton>
                            </FlexCol>
                        </>
                    )}
                </FlexCol>
            </MiddleContainer>

        </PopoverContainer>


    )
}

const PopoverContainer = styled.div<{ isShow: boolean }>`
    display: ${(props) => (props.isShow ? 'flex' : 'none')}; /* 상태에 따라 표시/숨김 */
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
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
    /* 250113 추가 */
    &.icon_box {
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
        }
`;

const FlexCol = styled.div<{ gap?: number }>`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.gap ? props.gap * 0.1 : 0}em; 
    /* 250113 추가 */
    &.icon_box {
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
        }
`;