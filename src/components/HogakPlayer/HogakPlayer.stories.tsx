import type { Meta, StoryObj } from '@storybook/react'

import { HogakPlayer } from '.'
import { OnClickAddTagEventObject } from './interfaces'
import { useRef } from 'react';

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
    url: {
      defaultValue: '',
      description: '재생할 영상의 URL입니다.',
      type: 'string',
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
            seconds: { name: 'number' },
            title: { name: 'string' },
            iconType: { name: 'string' },
          },
        },
      }
    },
    onBack: {
      description: '뒤로가기 버튼을 클릭했을 때 호출되는 콜백입니다.',
      action: 'onBack',
    },
    onClickAddTag: {
      description: `태그 추가 버튼 클릭 시 호출되는 콜백입니다.`,
      action: 'onClickAddTag',
    },
  },
  args: {
    title: '',
    url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    width: undefined,
    height: undefined,
    isPlay: false,
    setIsPlay: () => {},
    onBack: () => {
      alert('onBack');
    },
    onClickAddTag: (data: OnClickAddTagEventObject) => {
      console.log('onClickAddTag:', data);
      alert(`onClickAddTag`);
    },
    multiViewSources: [
      {
        thumbnailUrl: 'https://picsum.photos/seed/picsum/300/200',
        title: '[멀티VIEW] 1번 카메라',
        url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
      },
      {
        thumbnailUrl: 'https://picsum.photos/seed/picsum2/300/200',
        title: '[멀티VIEW] 2번 카메라',
        url: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
      },
    ],
    tags: [
      {
        seconds: 179,
        title: '02:59 홈런',
        iconType: 'red',
      },
      {
        seconds: 306,
        title: '05:06 홈런',
        iconType: 'red',
      },
      {
        seconds: 560,
        title: '09:20 홈런',
        iconType: 'red',
      },
    ],
  },
} satisfies Meta<typeof HogakPlayer>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  render: (args) => {
    const playerRef = useRef<{ getCurrentSeconds: () => number } | null>(null);

    return (
      <div>
        <HogakPlayer {...args} ref={playerRef} />
      </div>
    );
  },
};