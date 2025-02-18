import { create } from 'zustand'

interface PlayerState {
  url: string;
  setUrl: (url: string) => void;
  isLive: boolean;
  setIsLive: (isLive: boolean) => void;
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
  isMute: boolean;
  setIsMute: (isMute: boolean) => void;
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
  isShowTagSaveView: boolean;
  setIsShowTagSaveView: (isShowTagSaveView: boolean) => void;
  isPanoramaMode: boolean;
  setIsPanoramaMode: (isPanoramaMode: boolean) => void;
  isDisableClip: boolean;
  setIsDisableClip: (isDisableClip: boolean) => void;
  isDisableTag: boolean;
  setIsDisableTag: (isDisableTag: boolean) => void;
  isDisableMultiView: boolean;
  setIsDisableMultiView: (isDisableMultiView: boolean) => void;
  enableScoreBoardOverlay: boolean;
  setEnableScoreBoardOverlay: (enableScoreBoardOverlay: boolean) => void;
  scoreBoardOverlayUrl: string;
  setScoreBoardOverlayUrl: (scoreBoardOverlayUrl: string) => void;
  offsetStart: number;
  setOffsetStart: (offsetStart: number) => void;
  offsetEnd: number;
  setOffsetEnd: (offsetEnd: number) => void;
}

const usePlayerStore = create<PlayerState>()(
  (set) => ({
    url: '',
    setUrl: (url: string) => set({ url }),
    isLive: false,
    setIsLive: (isLive: boolean) => set({ isLive }),
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
    isMute: false,
    setIsMute: (isMute: boolean) => set({ isMute }),
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
    isShowTagSaveView: false,
    setIsShowTagSaveView: (isShowTagSaveView: boolean) => set({ isShowTagSaveView }),
    speed: 1,
    setSpeed: (speed: number) => set({ speed }),
    quality: 720,
    setQuality: (quality: number) => set({ quality }),
    isPanoramaMode: false,
    setIsPanoramaMode: (isPanoramaMode: boolean) => set({ isPanoramaMode }),
    isDisableClip: false,
    setIsDisableClip: (isDisableClip: boolean) => set({ isDisableClip }),
    isDisableTag: false,
    setIsDisableTag: (isDisableTag: boolean) => set({ isDisableTag }),
    isDisableMultiView: false,
    setIsDisableMultiView: (isDisableMultiView: boolean) => set({ isDisableMultiView }),
    enableScoreBoardOverlay: false,
    setEnableScoreBoardOverlay: (enableScoreBoardOverlay: boolean) => set({ enableScoreBoardOverlay }),
    scoreBoardOverlayUrl: '',
    setScoreBoardOverlayUrl: (scoreBoardOverlayUrl: string) => set({ scoreBoardOverlayUrl }),
    offsetStart: 0,
    setOffsetStart: (offsetStart: number) => set({ offsetStart }),
    offsetEnd: 0,
    setOffsetEnd: (offsetEnd: number) => set({ offsetEnd }),
  }),
)

export default usePlayerStore;