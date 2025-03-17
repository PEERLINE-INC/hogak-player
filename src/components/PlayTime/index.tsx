
interface HogakPlayerPlayTimeProps {
  seconds: number;
  testId?: string;
}

export function PlayTime(props: HogakPlayerPlayTimeProps) {
  const { seconds, testId } = props;

  return (
    <time dateTime={`P${Math.round(seconds || 0)}S`} style={{ color: 'white', fontSize: '1.4em', fontVariantNumeric: 'tabular-nums' }} data-testid={testId}>
      {format(seconds)}
    </time>
  );
}

function format(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    seconds = 0; // 유효하지 않은 값일 경우 0초로 설정
  }

  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = pad(date.getUTCSeconds());

  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`;
  }
  return `${pad(mm)}:${ss}`;
}

function pad(string: string | number) {
  return ('0' + string).slice(-2);
}
