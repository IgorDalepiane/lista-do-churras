import * as SecureStore from 'expo-secure-store';
import { INITIAL_WIZARD, parseSavedWizard, serializeWizard, type WizardState } from '../domain/wizard';

const KEY = 'wizard_progress';

// getItem throws on web and on keystore errors; both mean "no save".
export function loadProgress(): WizardState {
  try {
    return parseSavedWizard(SecureStore.getItem(KEY));
  } catch {
    return INITIAL_WIZARD;
  }
}

export function saveProgress(state: WizardState): void {
  SecureStore.setItemAsync(KEY, serializeWizard(state)).catch(() => {});
}
