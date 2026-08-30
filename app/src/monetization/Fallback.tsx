import { Pressable, StyleSheet, Text, View } from 'react-native';
import { adsCopy, listaCopy } from '../ui/copy';
import { C } from '../ui/theme';

export const SLOT_MIN = 100;
export const LOAD_MS = 8000;

export type PayProps = {
  adsRemoved: boolean;
  priceLabel: string;
  busy: boolean;
  onRemoveAds: () => void;
  onRestore: () => void;
  onPrivacy: () => void;
};

export function Fallback({ priceLabel, busy, onRemoveAds, onRestore, onPrivacy }: PayProps) {
  return (
    <View style={styles.slot} accessibilityLabel="Espaço de anúncio">
      <Text style={styles.failTitle}>{adsCopy.failTitle}</Text>
      <Text style={styles.failBody}>{adsCopy.failBody}</Text>
      <Pressable onPress={onRemoveAds} disabled={busy} style={styles.buy} accessibilityRole="button">
        <Text style={styles.buyTxt}>{adsCopy.remove(priceLabel)}</Text>
      </Pressable>
      <Pressable onPress={onRestore} disabled={busy} style={styles.linkBtn} accessibilityRole="button">
        <Text style={styles.link}>{adsCopy.restore}</Text>
      </Pressable>
      <Pressable onPress={onPrivacy} style={styles.linkBtn} accessibilityRole="button">
        <Text style={styles.link}>{listaCopy.privacy}</Text>
      </Pressable>
    </View>
  );
}

export function QuietPayLinks({ priceLabel, busy, onRemoveAds, onRestore, onPrivacy }: PayProps) {
  return (
    <View style={styles.quiet}>
      <Pressable onPress={onRemoveAds} disabled={busy} accessibilityRole="button">
        <Text style={styles.link}>{adsCopy.remove(priceLabel)}</Text>
      </Pressable>
      <Pressable onPress={onRestore} disabled={busy} accessibilityRole="button">
        <Text style={styles.link}>{adsCopy.restore}</Text>
      </Pressable>
      <Pressable onPress={onPrivacy} accessibilityRole="button">
        <Text style={styles.link}>{listaCopy.privacy}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    minHeight: SLOT_MIN,
    borderRadius: 16,
    backgroundColor: C.card,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: C.line,
  },
  failTitle: { color: C.ink, fontWeight: '800', fontSize: 16 },
  failBody: { color: C.muted, marginTop: 6, lineHeight: 20, fontSize: 14 },
  buy: {
    marginTop: 14,
    backgroundColor: C.ink,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buyTxt: { color: C.card, fontWeight: '800', fontSize: 15 },
  linkBtn: { paddingTop: 10 },
  link: { color: C.accent, fontWeight: '700', textAlign: 'center', fontSize: 13 },
  quiet: { marginTop: 10, gap: 8, alignItems: 'center' },
});
