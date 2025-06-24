import i18next from 'i18next';
import styled from 'styled-components';
import { createPlayerStore } from '../../store/playerStore';

const SkipAd = styled.button`
  /* Layout */
  position: absolute;
  top: 75%;
  right: 16px;
  z-index: 1001;

  display: inline-flex;
  align-items: center;
  gap: 8px;           /* space between text and icon */
  padding: 6px 16px;

  /* Look & feel */
  background: #000;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  user-select: none;

  /* Simple press/hover feedback (optional) */
  &:hover { opacity: 0.85; }
  &:active { opacity: 0.7; }

  /* Make sure the icon inherits the current font color */
  svg { fill: currentColor; }
`;

interface Props {
  playerStore: ReturnType<typeof createPlayerStore>;
  skipAfter: number;
  onClick?: () => void;
}

export const SkipAdButton = (props: Props) => {
  const { onClick, skipAfter, playerStore } = props;
  const duration = playerStore((state) => state.duration);
  const played = playerStore((state) => state.played);
  const elapsed = played * duration;
  const secondsLeft = Math.max(0, Math.ceil(skipAfter - elapsed));
  
  return (
    <SkipAd type="button" onClick={secondsLeft <= 0 ? onClick : () => {}}>
      {secondsLeft > 0 && skipAfter >= secondsLeft ? i18next.t('button.skip_ad_in', { count: secondsLeft }) : i18next.t('button.skip_ad')}
      {/* ▶▍ icon: right-pointing triangle + vertical bar */}
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <polygon points="0,0 0,12 7,6" />       {/* triangle */}
        <rect x="8" width="2" height="12" />     {/* bar */}
      </svg>
    </SkipAd>
  );
}
