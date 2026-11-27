import { StyleSheet, Text, View } from 'react-native';
import type { ListaItem } from '../domain/types';
import { formatQty } from '../domain/format';
import { ItemIcon } from './icons';
import { C } from './theme';

export function ListaRow({ item }: { item: ListaItem }) {
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View style={styles.iconWrap}>
          <ItemIcon id={item.id} size={22} />
        </View>
        <Text style={styles.name}>{item.nome}</Text>
        <View style={styles.qtyPill}>
          <Text style={styles.qtyPillTxt}>{formatQty(item.quantidade, item.unidade)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { flex: 1, color: C.ink, fontWeight: '800', fontSize: 16 },
  qtyPill: {
    backgroundColor: C.accentSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  qtyPillTxt: { color: C.accent, fontWeight: '800', fontSize: 12 },
});
