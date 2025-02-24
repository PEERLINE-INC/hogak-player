export class MultiViewSource {
  constructor(
    public thumbnailUrl: string,
    public title: string,
    public description: string,
    public url: string,
    public isPanorama?: boolean,
  ) {}
}

export class TagProps {
  constructor(
    public id: string | number,
    public seconds: number,
    public title: string,
    public iconUrl: string,
  ) {}
}

export class TagMenuProps {
  constructor(
    public id: string | number,
    public title: string,
    public iconUrl: string,
  ) {}
}

export type OnClickAddTagEventObject = {
  id: string | number;
  title: string;
  seconds: number;
}

export type HogakPlayerProps = {
  title?: string;
  isPlay?: boolean;
  isLive?: boolean;
  isAutoplay?: boolean;
  setIsPlay?: (isPlay: boolean) => void;
  onBack?: () => void;
  backIconType?: 'close' | 'arrowLeft';
  url: string;
  isPanorama?: boolean;
  width?: number | undefined;
  height?: number | undefined;
  multiViewSources?: MultiViewSource[];
  tags?: TagProps[];
  tagMenus?: TagMenuProps[];
  onClickAddTag?: (data: OnClickAddTagEventObject) => void;
  onChangeClipDuration?: (data: number[]) => void;
  enableDefaultFullscreen?: boolean;
  onChangeFullScreen?: (isFullScreen: boolean) => void;
  onClickTagButton?: () => void;
  onClickClipSave?: () => void;
  onClickTagSave?: () => void;
  onClickTagCancel?: () => void;
  onPlay?: () => void | boolean;

  disableClip?: boolean;
  disableTag?: boolean;
  disableMultiView?: boolean;

  enablePrerollAd?: boolean;
  prerollAdUrl?: string;

  // 오버레이
  enableScoreBoardOverlay?: boolean;
  scoreBoardOverlayUrl?: string;

  // 오프셋
  offsetStart?: number;
  offsetEnd?: number;
}