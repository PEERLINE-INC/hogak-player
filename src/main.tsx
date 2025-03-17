import { createRoot } from 'react-dom/client';
import { HogakPlayer } from './components/HogakPlayer'

// umd
export function renderPlayer(containerId: string, props: any) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Could not find container with id="${containerId}"`);
    return;
  }
  const root = createRoot(container);
  root.render(<HogakPlayer {...props} />);
}


export { HogakPlayer } from './components/HogakPlayer';