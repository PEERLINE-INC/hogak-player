import type { Meta, StoryObj } from '@storybook/react'

import { HogakPlayer } from '.'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/HogakPlayer',
  component: HogakPlayer,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
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
      defaultValue: '',
      description: '플레이어의 너비입니다.',
      type: 'number',
    },
    height: {
      defaultValue: '',
      description: '플레이어의 높이입니다.',
      type: 'number',
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
  },
  args: {
    
  },
} satisfies Meta<typeof HogakPlayer>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    title: '',
    url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    width: 640,
    height: 360,
    isPlay: false,
    setIsPlay: () => {},
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
  },
}
