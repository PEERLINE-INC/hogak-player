import styled from "styled-components";
import CancelIcon from '../../assets/icons/icon_cancel.svg?react';
import SaveIcon from '../../assets/icons/icon_save.svg?react';
import ArrowLeftIcon from "../../assets/icons/icon_arrow_left_white.svg?react";
import TagViewIcon from "../../assets/icons/icon_tag_white.svg?react";
import ScreenCastIcon from '../../assets/icons/icon_screencast.svg?react';
import MultiViewIcon from "../../assets/icons/icon_multiview.svg?react";
import usePlayerStore from "../../store/playerStore";
import ReactSlider from "react-slider";
import useClipStore from "../../store/clipViewStore";
import './styles.css';

interface ClipViewPopoverProps {
    isShow: boolean;
}

function format(seconds: number) {
    const date = new Date(seconds * 1000)
    const hh = date.getUTCHours()
    const mm = date.getUTCMinutes()
    const ss = pad(date.getUTCSeconds())
    if (hh) {
        return `${hh}:${pad(mm)}:${ss}`
    }
    return `${mm}:${ss}`
}

function pad(string: string | number) {
    return ('0' + string).slice(-2)
}

export const ClipViewPopover = ({ isShow }: ClipViewPopoverProps) => {
    const currentSeconds = useClipStore((state) => state.currentSeconds);
    const setIsShowClipView = usePlayerStore((state) => state.setIsShowClipView);

    return (
        <PopoverContainer isShow={isShow}>
            <TopContainer>
                <FlexRow style={{ width: 'calc(100% - 10em' }}>
                    <IconButton onClick={() => setIsShowClipView(false)}
                        className='back_btn'
                    >
                        <ArrowLeftIcon width={'100%'} height={'100%'} />
                    </IconButton>
                    {/* 241224 스타일 삭제 및 video_title 클래스 추가 */}
                    <div className='video_title'/* style={{ color: 'white', marginLeft: 16 }} */>{/* {title} */}</div>
                </FlexRow>


                <FlexRow gap={12}>
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
                <FlexCol style={{ paddingRight: '1.6em', gap: '2em' }}>
                    <FlexCol>
                        <IconButton className='side_icon side_save'>
                            <SaveIcon />
                            <p className='side_icon_name'>저장</p>
                        </IconButton>
                    </FlexCol>
                    <FlexCol>
                        <IconButton className='side_icon side_cancel' onClick={() => setIsShowClipView(false)}>
                            <CancelIcon />
                            <p className='side_icon_name'>취소</p>
                        </IconButton>
                    </FlexCol>
                </FlexCol>
            </MiddleContainer>

            <ClipRangeWrap>
                <ClipRangeWrapper>{/* 241227 추가 */}
                    <ThumbnailTrack>
                        {[...Array(8)].map((_, index) => (
                            <Thumbnail key={index} url="https://picsum.photos/seed/picsum/200/300" />
                        ))}

                        {/* 241227 구조변경 */}
                        <SliderWrap>
                            <ReactSlider
                                className="hogak-clip-slider"
                                thumbClassName="clip-thumb"
                                trackClassName="clip-track"
                                snapDragDisabled={false}
                                min={currentSeconds - 90 > 0 ? currentSeconds - 90 : 0}
                                max={currentSeconds + 90}
                                step={0.1}
                                defaultValue={[(currentSeconds - 30 > 0 ? currentSeconds : 0), currentSeconds + 30]}
                                ariaLabel={['클립 시작', '클립 종료']}
                                ariaValuetext={state => `${format(state.valueNow)}`}
                                renderThumb={(props, state) => <ClipThumb {...props}>{format(state.valueNow)}</ClipThumb>}
                                pearling
                                minDistance={10}
                            />
                        </SliderWrap>
                    </ThumbnailTrack>
                </ClipRangeWrapper>
            </ClipRangeWrap>

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
    /* 241227 추가 */
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
`;
// 241227 추가
const ClipRangeWrapper = styled.div`
    height: 55%;
    position: relative;
    top: 20%;
`
// 클립 슬라이더 선택 바
const ClipThumb = styled.div`
    /* 241227 수정 */
    background-color: #81EB47;
    width: 1.2em;
    height: 100%;
    color: white;
    cursor: ew-resize;
    text-indent: -9999px;
`;

// 썸네일 트랙
const ThumbnailTrack = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    gap: 1em;
`;

// 썸네일 이미지
const Thumbnail = styled.div<{ url: string }>`
    flex: 1;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-image: url(${(props) => props.url});
`;

// 241227 추가
const SliderWrap = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`