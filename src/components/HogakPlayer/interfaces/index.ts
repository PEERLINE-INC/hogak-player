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

export type PrerollAdType = 'IMA' | 'URL' | undefined | null;

export type HogakPlayerProps = {
  title?: string;
  isPlay?: boolean;
  isLive?: boolean;
  isAutoplay?: boolean;
  setIsPlay?: (isPlay: boolean) => void;
  onBack?: () => void;
  backIconType?: 'close' | 'arrowLeft';
  url: string;
  thumbnailUrl?: string;
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
  errorMessage?: string | null | undefined;

  disableClip?: boolean;
  disableTag?: boolean;
  disableMultiView?: boolean;
  disablePlayer?: boolean;

  prerollAdType?: PrerollAdType;
  prerollAdUrl?: string;
  prerollAdSkipSeconds?: number;

  // 오버레이
  enableScoreBoardOverlay?: boolean;
  scoreBoardOverlayUrl?: string;

  // 오프셋
  offsetStart?: number;
  offsetEnd?: number;
  offsetSeek?: number;

  // 클립 썸네일
  eventId?: string;
  clipThumbnailApiHost?: string;

  // 좌우 버튼 활성화
  enableLeftRightArrowButton?: boolean;
  // 좌우 버튼 클릭 시 이벤트
  onClickLeftArrowButton?: () => void;
  onClickRightArrowButton?: () => void;

  // 크롬캐스트
  onClickChromecastButton?: () => void;
}