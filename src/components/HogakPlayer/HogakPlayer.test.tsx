import { vi } from 'vitest'

vi.mock('videojs-contrib-ads', () => ({ default: vi.fn() }));
vi.mock('videojs-overlay', () => ({ default: vi.fn() }));
vi.mock('@silvermine/videojs-chromecast', () => ({ default: vi.fn() }));
vi.mock('@theonlyducks/videojs-zoom', () => ({ default: vi.fn() }));
vi.mock('videojs-contrib-quality-levels', () => ({
  on: vi.fn(),
}));

function makeEventSystem() {
  const events = Object.create(null);
  return {
    on: vi.fn((evtName, cb) => {
      if (!events[evtName]) events[evtName] = [];
      events[evtName].push(cb);
    }),
    trigger: vi.fn((evtName) => {
      (events[evtName] || []).forEach((cb: () => void) => cb());
    }),
  };
}

vi.mock('video.js', () => {
  // 실제 player 로직을 전부 무시하고, 간단히 가짜 Player 반환
  const createFakePlayer = () => {
    const es = makeEventSystem();
    const player = {
      ...es,
      one: vi.fn(),
      play: vi.fn().mockImplementation(() => {
        es.trigger('play');
        return Promise.resolve();
      }),
      pause: vi.fn(),
      src: vi.fn(),
      dispose: vi.fn(),
      isDisposed: vi.fn(),
      volume: vi.fn(),
      muted: vi.fn(),
      playbackRate: vi.fn(),
      el: vi.fn(() => ({
        querySelector: vi.fn(),
      })),
      autoplay: vi.fn(),
      chromecast: vi.fn(),
      qualityLevels: vi.fn(() => ({
        on: vi.fn(),
        selectedIndex: 0,
        length: 1,
        0: { height: 720 },
      })),
      zoomPlugin: vi.fn(),
      liveTracker: {
        on: vi.fn(),
        seekableEnd: vi.fn(() => 0),
      },
      currentTime: vi.fn(() => 0),
      duration: vi.fn(() => 0),
    };

    setTimeout(() => {
      player.trigger('play');
      player.trigger('loadedmetadata');
    }, 100);

    return player;
  };

  const mockVideoJs = vi.fn(() => {
    return createFakePlayer();
  });

  // plugin 등록 등 필요시...
  // @ts-ignore
  mockVideoJs.registerPlugin = vi.fn();
  // @ts-ignore
  mockVideoJs.Plugin = class {};

  return {
    default: mockVideoJs,
  };
});

import { afterEach, describe, it } from 'vitest'
// @ts-ignore
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { HogakPlayer } from '.'

//@ts-ignore
const defaultProps = {
  url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
}

describe('HogakPlayer test:', () => {
  afterEach(cleanup)

  it('컴포넌트 렌더링 테스트', () => {
    render(<HogakPlayer url='' />)
  })

  it('title 기능 동작 테스트', () => {
    render(<HogakPlayer url='' title='Title Test' />)
    screen.getByText('Title Test')
  })

  // describe('오류 메시지 동작 테스트', () => {
  //   it('url이 없을 때 메시지 표시', async () => {
  //     const props = {
  //       ...defaultProps,
  //       url: '',
  //       errorMessage: '오류가 발생했습니다.',
  //     };
  //     render(<HogakPlayer {...props} />);
      
  //     await waitFor(() =>
  //       screen.getByText(props.errorMessage)
  //     );
  //   });

  //   it('url이 있을 때 메시지 숨김', async () => {
  //     // 1) URL이 없을 때 메시지가 표시되는지 확인
  //     const props = {
  //       ...defaultProps,
  //       url: '',
  //       errorMessage: '오류가 발생했습니다.',
  //     };
  //     const { rerender } = render(<HogakPlayer {...props} />);
      
  //     await waitFor(() => {
  //       screen.getByText(props.errorMessage);
  //     });

  //     // 2) URL을 넣고 다시 렌더링
  //     rerender(
  //       <HogakPlayer
  //         {...props}
  //         url='https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8'
  //         errorMessage=''
  //       />
  //     );

  //     // 3) 메시지가 사라지는지 확인
  //     await waitFor(() => {
  //       expect(screen.queryByText(props.errorMessage)).toBeNull();
  //     });
  //   });
  // });

  // describe('offset 기능 동작 테스트', () => {
  //   it('offsetStart가 10이면 시작 시간은 00:00이어야 한다', async () => {
  //     const onPlayMock = vi.fn();

  //     render(
  //       <HogakPlayer
  //         url={defaultProps.url}
  //         offsetStart={10}
  //         offsetEnd={70}
  //         onPlay={onPlayMock}
  //         isAutoplay={true}
  //       />
  //     );

  //     await waitFor(() => {
  //       const start = screen.getByTestId('player-time-display-start');
  //       expect(start).toHaveTextContent('00:00');
  //     });
  //   });

  //   it('offsetEnd가 70이면 끝 시간은 01:00이어야 한다', async () => {
  //     const onPlayMock = vi.fn();

  //     render(
  //       <HogakPlayer
  //         url={defaultProps.url}
  //         offsetStart={10}
  //         offsetEnd={70}
  //         onPlay={onPlayMock}
  //         isAutoplay={true}
  //       />
  //     );

  //     await waitFor(() => {
  //       const end = screen.getByTestId('player-time-display-end');
  //       expect(end).toHaveTextContent('01:00');
  //     });
  //   });
  // });
});
