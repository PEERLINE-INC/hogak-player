import { createRef } from 'react';
import { createRoot } from 'react-dom/client';
import { HogakPlayer } from './components/HogakPlayer'

// umd
export function renderPlayer(containerId: string, props: any) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Could not find container with id="${containerId}"`);
    return;
  }
  const ref = createRef();
  const root = createRoot(container);
  root.render(<HogakPlayer {...props} ref={ref} />);

  return ref;
}


export { HogakPlayer } from './components/HogakPlayer';