import { create } from 'zustand'

interface PlayerState {
  url: string;
  setUrl: (url: string) => void;
  title: string;
  setTitle: (title: string) => void;
  pip: boolean;
  setPip: (pip: boolean) => void;
  isPlay: boolean;
  setIsPlay: (isPlay: boolean) => void;
  isReady: boolean;
  setIsReady: (isReady: boolean) => void;
  isSeek: boolean;
  setIsSeek: (isSeek: boolean) => void;
  duration: number;
  setDuration: (duration: number) => void;
  played: number;
  setPlayed: (played: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  quality: number;
  setQuality: (quality: number) => void;
  isFullScreen: boolean;
  setIsFullScreen: (isFullScreen: boolean) => void;
  isShowMultiView: boolean;
  setIsShowMultiView: (isShowMultiView: boolean) => void;
  isShowTagView: boolean;
  setIsShowTagView: (isShowTagView: boolean) => void;
  isShowClipView: boolean;
  setIsShowClipView: (isShowClipView: boolean) => void;
  backIconType: 'close' | 'arrowLeft';
  setBackIconType: (backIconType: 'close' | 'arrowLeft') => void;
  skipDirection: 'left' | 'right' | null;
  setSkipDirection: (skipDirection: 'left' | 'right' | null) => void;
  isViewThumbMarker: boolean;
  setIsViewThumbMarker: (isViewThumbMarker: boolean) => void;
}

const usePlayerStore = create<PlayerState>()(
  (set) => ({
    url: '',
    setUrl: (url: string) => set({ url }),
    title: '',
    setTitle: (title: string) => set({ title }),
    pip: false,
    setPip: (pip: boolean) => set({ pip }),
    isPlay: false,
    setIsPlay: (isPlay: boolean) => set({ isPlay }),
    isReady: false,
    setIsReady: (isReady: boolean) => set({ isReady }),
    isSeek: false,
    setIsSeek: (isSeek: boolean) => set({ isSeek }),
    duration: 0,
    setDuration: (duration: number) => set({ duration }),
    played: 0,
    setPlayed: (played: number) => set({ played }),
    volume: 1.0,
    setVolume: (volume: number) => set({ volume }),
    isFullScreen: false,
    setIsFullScreen: (isFullScreen: boolean) => set({ isFullScreen }),
    isShowMultiView: false,
    setIsShowMultiView: (isShowMultiView: boolean) => set({ isShowMultiView }),
    isShowTagView: false,
    setIsShowTagView: (isShowTagView: boolean) => set({ isShowTagView }),
    isShowClipView: false,
    setIsShowClipView: (isShowClipView: boolean) => set({ isShowClipView }),
    backIconType: 'arrowLeft',
    setBackIconType: (backIconType: 'close' | 'arrowLeft') => set({ backIconType }),
    skipDirection: null,
    setSkipDirection: (skipDirection: 'left' | 'right' | null) => set({ skipDirection }),
    isViewThumbMarker: false,
    setIsViewThumbMarker: (isViewThumbMarker: boolean) => set({ isViewThumbMarker }),
    speed: 1,
    setSpeed: (speed: number) => set({ speed }),
    quality: 720,
    setQuality: (quality: number) => set({ quality }),
  }),
)

export default usePlayerStore;