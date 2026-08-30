import * as SecureStore from 'expo-secure-store';

const KEY = 'ads_removed';

export async function loadAdsRemoved(): Promise<boolean> {
  try {
    const v = await SecureStore.getItemAsync(KEY);
    return v === '1';
  } catch {
    return false;
  }
}

export async function saveAdsRemoved(value: boolean): Promise<void> {
  try {
    if (value) await SecureStore.setItemAsync(KEY, '1');
    else await SecureStore.deleteItemAsync(KEY);
  } catch {
    /* keep local session even if persist fails */
  }
}
