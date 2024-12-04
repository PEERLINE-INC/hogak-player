export class MultiViewSource {
  constructor(
    public thumbnailUrl: string,
    public title: string,
    public url: string,
  ) {}
}

export type HogakPlayerProps = {
  title?: string;
  isPlay?: boolean;
  setIsPlay?: (isPlay: boolean) => void;
  url: string;
  width?: number;
  height?: number;
  multiViewSources?: MultiViewSource[];
}