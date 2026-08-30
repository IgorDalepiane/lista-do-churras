import { NativeBanner } from './NativeBanner';
import type { PayProps } from './Fallback';

export function AdSlot(props: PayProps) {
  if (props.adsRemoved) return null;
  return <NativeBanner {...props} />;
}
