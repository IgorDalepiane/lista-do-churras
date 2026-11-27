import { StyleSheet, Text, View } from 'react-native';
import type { ListaItem } from '../domain/types';
import { formatQty } from '../domain/format';
import { listaCopy } from './copy';
import { ItemIcon } from './icons';
import { C } from './theme';

export function ListaRow({ item }: { item: ListaItem }) {
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View style={styles.iconWrap}>
          <ItemIcon id={item.id} size={22} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.nome}</Text>
          <Text style={styles.buy}>
            {listaCopy.buy} <Text style={styles.qty}>{formatQty(item.quantidade, item.unidade)}</Text>
          </Text>
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
  name: { color: C.ink, fontWeight: '800', fontSize: 16 },
  buy: { color: C.muted, fontSize: 15, marginTop: 2 },
  qty: { color: C.ink, fontWeight: '800' },
});
