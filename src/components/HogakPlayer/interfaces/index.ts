export class MultiViewSource {
  constructor(
    public thumbnailUrl: string,
    public title: string,
    public url: string,
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
  setIsPlay?: (isPlay: boolean) => void;
  onBack?: () => void;
  url: string;
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
}