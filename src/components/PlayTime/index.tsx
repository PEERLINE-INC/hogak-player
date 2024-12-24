interface HogakPlayerPlayTimeProps {
  seconds: number;
}

export function PlayTime(props: HogakPlayerPlayTimeProps) {
  const {
    seconds,
  } = props;

  return (
    <time dateTime={`P${Math.round(seconds)}S`} style={{ color: 'white', fontSize: '1.4em' }}>{/*  241224 fontSize 수정 */}
      {format(seconds)}
    </time>
  )
}

function format(seconds: number) {
  const date = new Date(seconds * 1000)
  const hh = date.getUTCHours()
  const mm = date.getUTCMinutes()
  const ss = pad(date.getUTCSeconds())
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`
  }
  return `${mm}:${ss}`
}

function pad(string: string | number) {
  return ('0' + string).slice(-2)
}