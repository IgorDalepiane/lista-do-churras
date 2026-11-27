import * as SecureStore from 'expo-secure-store';
import { INITIAL_WIZARD, parseSavedWizard, serializeWizard, type WizardState } from '../domain/wizard';

const KEY = 'wizard_progress';

// Synchronous so the first frame is already the restored wizard and no async restore can
// overwrite a tap. getItem throws on web and on keystore errors; both mean "no save".
export function loadProgress(): WizardState {
  try {
    return parseSavedWizard(SecureStore.getItem(KEY));
  } catch {
    return INITIAL_WIZARD;
  }
}

let queued: string | null = null;
let writing = false;

// One write in flight and the newest snapshot queued, because concurrent setItemAsync calls
// do not promise to land in call order.
export function saveProgress(state: WizardState): void {
  queued = serializeWizard(state);
  if (writing) return;
  writing = true;
  void (async () => {
    while (queued !== null) {
      const value = queued;
      queued = null;
      try {
        await SecureStore.setItemAsync(KEY, value);
      } catch {}
    }
    writing = false;
  })();
}
