export class MultiViewSource {
  constructor(
    public thumbnailUrl: string,
    public title: string,
    public url: string,
  ) {}
}

export class TagProps {
  constructor(
    public seconds: number,
    public title: string,
    public iconType: string,
  ) {}
}

export type OnClickAddTagEventObject = {
  name: string;
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
  onClickAddTag?: (data: OnClickAddTagEventObject) => void;
}