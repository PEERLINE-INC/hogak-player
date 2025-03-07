import { create } from 'zustand'

interface PlayerState {
  url: string;
  setUrl: (url: string) => void;
  thumbnailUrl: string;
  setThumbnailUrl: (thumbnailUrl: string) => void;
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
  enableLeftRightArrowButton: boolean;
  setEnableLeftRightArrowButton: (enableLeftRightArrowButton: boolean) => void;
  onClickLeftArrowButton: () => void;
  setOnClickLeftArrowButton: (onClickLeftArrowButton: () => void) => void;
  onClickRightArrowButton: () => void;
  setOnClickRightArrowButton: (onClickRightArrowButton: () => void) => void;
  isShowChromecastButton: boolean;
  setIsShowChromecastButton: (isShowChromecastButton: boolean) => void;
  resetPlayerStore: () => void;
}

const usePlayerStore = create<PlayerState>()(
  (set) => ({
    url: '',
    setUrl: (url: string) => set({ url }),
    thumbnailUrl: '',
    setThumbnailUrl: (thumbnailUrl: string) => set({ thumbnailUrl }),
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
    enableLeftRightArrowButton: false,
    setEnableLeftRightArrowButton: (enableLeftRightArrowButton: boolean) => set({ enableLeftRightArrowButton }),
    onClickLeftArrowButton: () => {},
    setOnClickLeftArrowButton: (onClickLeftArrowButton: () => void) => set({ onClickLeftArrowButton }),
    onClickRightArrowButton: () => {},
    setOnClickRightArrowButton: (onClickRightArrowButton: () => void) => set({ onClickRightArrowButton }),
    isShowChromecastButton: false,
    setIsShowChromecastButton: (isShowChromecastButton: boolean) => set({ isShowChromecastButton }),
    resetPlayerStore: () => set({
      url: '',
      thumbnailUrl: '',
      isLive: false,
      title: '',
      pip: false,
      isPlay: false,
      isReady: false,
      isSeek: false,
      duration: 0,
      played: 0,
      volume: 1.0,
      isMute: false,
      isFullScreen: false,
      isShowMultiView: false,
      isShowTagView: false,
      isShowClipView: false,
      backIconType: 'arrowLeft',
      skipDirection: null,
      isViewThumbMarker: false,
      isShowTagSaveView: false,
      isPanoramaMode: false,
      isDisableClip: false,
      isDisableTag: false,
      isDisableMultiView: false,
      enableScoreBoardOverlay: false,
      scoreBoardOverlayUrl: '',
      offsetStart: 0,
      offsetEnd: 0,
      enableLeftRightArrowButton: false,
      onClickLeftArrowButton: () => {},
      onClickRightArrowButton: () => {},
      isShowChromecastButton: false,
    }),
  }),
)

export default usePlayerStore;