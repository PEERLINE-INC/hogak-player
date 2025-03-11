import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, it } from 'vitest'
import { HogakPlayer } from '.'

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

  describe('오류 처리 기능 동작 테스트', () => {
    it('라이브 영상이고 url이 없을 때 메시지 표시', async () => {
      const props = {
        ...defaultProps,
        isLive: true,
        url: '',
      };
      render(<HogakPlayer {...props} />);
      
      await waitFor(() =>
        screen.getByText('라이브 시작 전입니다.')
      );
    });

    it('라이브 영상이고 url이 있을 때 메시지 숨김', async () => {
      const props = {
        ...defaultProps,
        isLive: true,
        url: '', // 처음엔 빈 URL
      };
      const { rerender } = render(<HogakPlayer {...props} />);
  
      // 1) 메시지가 표시될 때까지 대기
      await waitFor(() =>
        expect(screen.queryByText('라이브 시작 전입니다.')).toBeInTheDocument()
      );
  
      // 2) URL이 있는 상태로 다시 렌더
      rerender(<HogakPlayer {...props} url={defaultProps.url} />);
  
      // 3) 메시지가 사라질 때까지 대기
      await waitFor(() =>
        expect(screen.queryByText('라이브 시작 전입니다.')).not.toBeInTheDocument()
      );
    });
  });
})
