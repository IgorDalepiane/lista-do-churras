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

export function PaywallCard({ priceLabel, busy, onRemoveAds, onRestore, onPrivacy }: PayProps) {
  return (
    <View style={styles.card} accessibilityLabel={adsCopy.title}>
      <Text style={styles.kicker}>{adsCopy.kicker}</Text>
      <Text style={styles.title}>{adsCopy.title}</Text>
      <Text style={styles.body}>{adsCopy.body}</Text>
      <Pressable
        onPress={onRemoveAds}
        disabled={busy}
        style={[styles.buy, busy && styles.buyOff]}
        accessibilityRole="button"
        accessibilityLabel={adsCopy.buy(priceLabel)}
      >
        <Text style={styles.buyTxt}>{adsCopy.buy(priceLabel)}</Text>
      </Pressable>
      <View style={styles.meta}>
        <Pressable
          onPress={onRestore}
          disabled={busy}
          style={styles.metaBtn}
          accessibilityRole="button"
          hitSlop={12}
        >
          <Text style={styles.metaLink}>{adsCopy.restore}</Text>
        </Pressable>
        <Text style={styles.metaDot} accessibilityElementsHidden>
          ·
        </Text>
        <Pressable onPress={onPrivacy} style={styles.metaBtn} accessibilityRole="button" hitSlop={12}>
          <Text style={styles.metaLink}>{listaCopy.privacy}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: C.card,
    padding: 16,
    borderWidth: 1,
    borderColor: C.line,
  },
  kicker: {
    color: C.accent,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: { color: C.ink, fontWeight: '800', fontSize: 22, marginTop: 8, letterSpacing: -0.4 },
  body: { color: C.muted, marginTop: 8, lineHeight: 21, fontSize: 14 },
  buy: {
    marginTop: 16,
    backgroundColor: C.ink,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  buyOff: { backgroundColor: C.ctaOff },
  buyTxt: { color: C.card, fontWeight: '800', fontSize: 15 },
  meta: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  metaBtn: { justifyContent: 'center' },
  metaLink: { color: C.accent, fontWeight: '700', fontSize: 13 },
  metaDot: { color: C.muted, fontWeight: '700', fontSize: 13 },
});
