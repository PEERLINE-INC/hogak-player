import type { Meta, StoryObj } from '@storybook/react'

import { HogakPlayer } from '.'
import { OnClickAddTagEventObject } from './interfaces'
import { useRef, useState } from 'react';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/HogakPlayer',
  component: HogakPlayer,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  // tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    title: {
      defaultValue: '',
      description: '표시할 영상 제목입니다.',
      type: 'string',
    },
    isLive: {
      defaultValue: false,
      description: '라이브 영상인지 여부입니다.',
      type: 'boolean',
    },
    disablePlayer: {
      defaultValue: false,
      description: '플레이어 비활성화 여부입니다. onBack, onPlay 콜백은 호출됩니다. 이외의 동작은 무시됩니다. (isAutoplay 보다 우선합니다)',
      type: 'boolean',
    },
    url: {
      defaultValue: '',
      description: '재생할 영상의 URL입니다.',
      type: 'string',
    },
    thumbnailUrl: {
      defaultValue: '',
      description: '표시할 썸네일 이미지의 URL입니다.',
      type: 'string',
    },
    isPanorama: {
      defaultValue: false,
      description: '파노라마 모드의 초기값을 설정합니다. (영상 소스가 변경되면 해당 소스의 파노라마 모드 여부를 따릅니다)',
      type: 'boolean',
    },
    width: {
      defaultValue: 640,
      description: '플레이어의 너비입니다. 입력하지 않으면 100%로 취급합니다.',
      control: { type: 'number' },
    },
    height: {
      defaultValue: 360,
      description: '플레이어의 높이입니다. 입력하지 않으면 100%로 취급합니다.',
      control: { type: 'number' },
    },
    isPlay: {
      defaultValue: '',
      description: '영상을 재생할지 여부입니다.',
      type: 'boolean',
    },
    multiViewSources: {
      defaultValue: '',
      description: '멀티뷰에 표시할 영상 목록입니다.',
      type: {
        name: 'array',
        value: {
          name: 'object',
          value: {
            thumbnailUrl: { name: 'string' },
            title: { name: 'string' },
            url: { name: 'string' },
            isPanorama: { name: 'boolean' },
          },
        },
      }
    },
    tags: {
      defaultValue: '',
      description: '재생바에 표시할 태그 목록입니다.',
      type: {
        name: 'array',
        value: {
          name: 'object',
          value: {
            id: { name: 'string' },
            seconds: { name: 'number' },
            title: { name: 'string' },
            iconUrl: { name: 'string' },
          },
        },
      }
    },
    tagMenus: {
      defaultValue: '',
      description: '태그 추가 메뉴에 표시할 데이터입니다.',
      type: {
        name: 'array',
        value: {
          name: 'object',
          value: {
            id: { name: 'string' },
            title: { name: 'string' },
            iconUrl: { name: 'string' },
          },
        },
      }
    },
    disableClip: {
      defaultValue: false,
      description: '클립 기능을 비활성화할지 여부입니다.',
      type: 'boolean',
    },
    disableTag: {
      defaultValue: false,
      description: '태그 기능을 비활성화할지 여부입니다.',
      type: 'boolean',
    },
    disableMultiView: {
      defaultValue: false,
      description: '멀티뷰 기능을 비활성화할지 여부입니다.',
      type: 'boolean',
    },
    onBack: {
      description: '뒤로가기 버튼을 클릭했을 때 호출되는 콜백입니다.',
      action: 'onBack',
    },
    backIconType: {
      defaultValue: 'arrowLeft',
      description: '뒤로가기 버튼의 아이콘 타입입니다. (arrowLeft: 왼쪽 화살표, close: 닫기 아이콘)',
      type: 'string',
    },
    onClickAddTag: {
      description: `태그 추가 버튼 클릭 시 호출되는 콜백입니다.`,
      action: 'onClickAddTag',
    },
    onChangeClipDuration: {
      description: `클립의 시작(초)), 종료(초) 값이 변경될 때 호출되는 콜백입니다. (ex: [0, 10])`,
      action: 'onChangeClipDuration',
    },
    onChangeFullScreen: {
      description: `전체화면 모드가 변경될 때 호출되는 콜백입니다.`,
      action: 'onChangeFullScreen',
    },
    enableDefaultFullscreen: {
      defaultValue: true,
      description: `전체화면 기본 기능을 사용할지 여부입니다.`,
      type: 'boolean',
    },
    onClickTagButton: {
      description: `태그 버튼 클릭 시 호출되는 콜백입니다. (전체 화면의 태그 버튼 클릭 시에는 호출되지 않습니다)`,
      action: 'onClickTagButton',
    },
    onClickClipSave: {
      description: `클립 저장 버튼 클릭 시 호출되는 콜백입니다.`,
      action: 'onClickClipSave',
    },
    onClickTagSave: {
      description: `태그 저장 버튼 클릭 시 호출되는 콜백입니다.`,
      action: 'onClickTagSave',
    },
    onClickTagCancel: {
      description: `태그 취소 버튼 클릭 시 호출되는 콜백입니다.`,
      action: 'onClickTagCancel',
    },
    onPlay: {
      description: `재생 시 호출되는 콜백입니다. false를 반환하면 재생이 중단됩니다.`,
      action: 'onPlay',
    },
    enablePrerollAd: {
      defaultValue: false,
      description: `프리롤 광고 기능을 사용할지 여부입니다.`,
      type: 'boolean',
    },
    prerollAdUrl: {
      defaultValue: '',
      description: `프리롤 광고 영상의 URL입니다.`,
      type: 'string',
    },
    isAutoplay: {
      defaultValue: false,
      description: `자동 재생 기능을 사용할지 여부입니다.`,
      type: 'boolean',
    },
    offsetStart: {
      defaultValue: 0,
      description: `영상의 길이와 관계 없이 해당 시간부터 시작합니다.`,
      type: 'number',
    },
    offsetEnd: {  
      defaultValue: 0,
      description: `영상의 길이와 관계 없이 해당 시간까지만 재생합니다.`,
      type: 'number',
    },
    eventId: {
      defaultValue: '',
      description: `클립 썸네일 조회 시 사용할 이벤트 ID입니다.`,
      type: 'string',
    },
    clipThumbnailApiHost: {
      defaultValue: '',
      description: `클립 썸네일 조회 시 사용할 API 호스트입니다.`,
      type: 'string',
    },
    enableLeftRightArrowButton: {
      defaultValue: false,
      description: `좌우 버튼 활성화 여부입니다.`,
      type: 'boolean',
    },
    onClickLeftArrowButton: {
      description: `좌측 버튼 클릭 시 호출되는 콜백입니다.`,
      action: 'onClickLeftArrowButton',
    },
    onClickRightArrowButton: {
      description: `우측 버튼 클릭 시 호출되는 콜백입니다.`,
      action: 'onClickRightArrowButton',
    },
  },
  args: {
    title: '',
    isLive: false,
    disablePlayer: false,
    // url: 'https://dmvvk3pybr7s5.cloudfront.net/yst_stage/67b73680ae9d58685f69e3bb/venue_hls/hd_hls/hd_hls.m3u8',
    url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    thumbnailUrl: 'https://picsum.photos/seed/picsum/1920/1080',
    width: undefined,
    height: undefined,
    isPlay: false,
    isAutoplay: false,
    onBack: () => {
      console.log('onBack');
    },
    onClickAddTag: (data: OnClickAddTagEventObject) => {
      console.log('onClickAddTag:', data);
      alert(`onClickAddTag`);
    },
    onChangeClipDuration: (data: number[]) => {
      console.log('onChangeClipDuration:', data);
    },
    onChangeFullScreen: (isFullScreen: boolean) => {
      console.log('onChangeFullScreen:', isFullScreen);
    },
    onClickTagButton: () => {
      console.log('onClickTagButton');
    },
    onClickClipSave: () => {
      console.log('onClickClipSave');
    },
    onClickTagSave: () => {
      console.log('onClickTagSave');
    },
    onClickTagCancel: () => {
      console.log('onClickTagCancel');
    },
    onPlay: () => {
      console.log('onPlay');
      return true;
    },
    multiViewSources: [
      {
        thumbnailUrl: 'https://picsum.photos/seed/picsum/300/200',
        title: '[멀티VIEW] 1번 카메라',
        description: '1번 카메라 설명',
        url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
        isPanorama: false,
      },
      {
        thumbnailUrl: 'https://picsum.photos/seed/picsum2/300/200',
        title: '[멀티VIEW] 2번 카메라(파노라마)',
        description: '2번 카메라 설명',
        url: 'https://dnw98ykn7b9iq.cloudfront.net/yst/67506369e4e1ed593e37e059/venue_hls/pano_hls/pano_hls.m3u8',
        isPanorama: true,
      },
    ],
    tags: [
      {
        id: '1',
        seconds: 179,
        title: '02:59 홈런',
        iconUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png',
      },
      {
        id: '2',
        seconds: 306,
        title: '05:06 홈런',
        iconUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png',
      },
      {
        id: '3',
        seconds: 560,
        title: '09:20 홈런',
        iconUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png',
      },
    ],
    tagMenus: [
      {
        id: '1',
        title: '홈런',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/606/606078.png',
      },
      {
        id: '1',
        title: '홈런',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/606/606078.png',
      },
      {
        id: '2',
        title: '홈런',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/606/606078.png',
      },
      {
        id: '3',
        title: '홈런',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/606/606078.png',
      },
      {
        id: '4',
        title: '홈런',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/606/606078.png',
      },
      {
        id: '5',
        title: '홈런',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/606/606078.png',
      },
      {
        id: '6',
        title: '홈런',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/606/606078.png',
      },
      {
        id: '7',
        title: '홈런',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/606/606078.png',
      },
      {
        id: '8',
        title: '홈런',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/606/606078.png',
      },
      {
        id: '9',
        title: '홈런',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/606/606078.png',
      },
      {
        id: '10',
        title: '홈런',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/606/606078.png',
      },
      {
        id: '11',
        title: '홈런',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/606/606078.png',
      },
      {
        id: '12',
        title: '홈런',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/606/606078.png',
      },
      {
        id: '13',
        title: '홈런13',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/606/606078.png',
      },
      {
        id: '14',
        title: '홈런14',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/606/606078.png',
      },
      {
        id: '15',
        title: '홈런15',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/606/606078.png',
      },
    ],
    disableClip: false,
    disableTag: false,
    disableMultiView: false,
    backIconType: 'arrowLeft',
    enablePrerollAd: false,
    prerollAdUrl: 'https://dev.peerline.net/hogak/thumbnail/hogak_preroll_ad.mp4',
    enableScoreBoardOverlay: false,
    scoreBoardOverlayUrl: 'https://scorebug.peerline.net:24200/output/v5VaeOG',
    offsetStart: 0,
    offsetEnd: 0,
    eventId: '1000020',
    clipThumbnailApiHost: 'http://hogak-media-service-1061815346.ap-northeast-2.elb.amazonaws.com:7788',
    enableLeftRightArrowButton: false,
    onClickLeftArrowButton: () => {
      console.log('onClickLeftArrowButton');
    },
    onClickRightArrowButton: () => {
      console.log('onClickRightArrowButton');
    },
  },
} satisfies Meta<typeof HogakPlayer>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  render: (args) => {
    const playerRef = useRef<{ 
      getCurrentSeconds: () => number, 
      setClipView: (value: boolean) => void,
      setClipValues: (values: number[]) => void,
      seekTo: (value: number, type: "seconds" | "fraction") => void,
      setIsViewThumbMarker: (value: boolean) => void,
      setTagView: (value: boolean) => void,
      getIsFullScreen: () => boolean,
      getCurrentStreamingUrl: () => string,
    } | null>(null);
    const [isShowClipView, setIsShowClipView] = useState(false);

    return (
      <div>
        <HogakPlayer {...args} ref={playerRef} />
        <button onClick={() => console.log('getCurrentSeconds', playerRef.current?.getCurrentSeconds())}>getCurrentSeconds()</button>
        <button onClick={() => {
          setIsShowClipView(!isShowClipView);
          playerRef.current?.setClipView(isShowClipView);
        }}>setClipView({isShowClipView.toString()})</button>
        <button onClick={() => playerRef.current?.setClipValues([15, 50])}>setClipValues([15, 50])</button>
        <button onClick={() => playerRef.current?.seekTo(10, "seconds")}>seekTo(10, "seconds")</button>
        <button onClick={() => playerRef.current?.setIsViewThumbMarker(true)}>setIsViewThumbMarker(true)</button>
        <button onClick={() => playerRef.current?.setTagView(true)}>setTagView(true)</button>
        <button onClick={() => console.log('getIsFullScreen', playerRef.current?.getIsFullScreen())}>getIsFullScreen()</button>
        <button onClick={() => console.log('getCurrentStreamingUrl', playerRef.current?.getCurrentStreamingUrl())}>getCurrentStreamingUrl()</button>
      </div>
    );
  },
};