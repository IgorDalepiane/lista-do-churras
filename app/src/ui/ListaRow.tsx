import { StyleSheet, Text, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { ListaItem } from '../domain/types';
import {
  formatMoney,
  formatQty,
  formatUnitPrice,
  parseBrNumber,
  unitPriceHint,
  unitPriceLabel,
} from '../domain/format';
import { ItemIcon } from './icons';
import { enterAppear, useReduceMotion } from './motion';
import { C } from './theme';

export function ListaRow({
  item,
  value,
  onChange,
}: {
  item: ListaItem;
  value: string;
  onChange: (t: string) => void;
}) {
  const reduce = useReduceMotion();
  const preco = parseBrNumber(value);
  const linha = preco != null ? item.quantidade * preco : null;
  const unitLabel = unitPriceLabel(item.unidade);

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
      <Text style={styles.hint}>Preço {unitPriceHint(item)}</Text>
      <View style={styles.field}>
        <TextInput
          style={styles.input}
          placeholder="0,00"
          placeholderTextColor={C.muted}
          keyboardType="decimal-pad"
          value={value}
          onChangeText={onChange}
          accessibilityLabel={`${item.nome}, ${unitLabel}`}
        />
        <View style={styles.unitChip}>
          <Text style={styles.unitChipTxt}>{unitLabel}</Text>
        </View>
      </View>
      {linha != null && preco != null ? (
        <Animated.Text entering={reduce ? undefined : enterAppear} style={styles.lineTotal}>
          {formatQty(item.quantidade, item.unidade)} × {formatUnitPrice(preco, item.unidade)} ={' '}
          {formatMoney(linha)}
        </Animated.Text>
      ) : null}
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
  hint: { color: C.muted, fontSize: 13, marginTop: 10, marginBottom: 8 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.bg,
    borderRadius: 14,
    paddingLeft: 12,
    borderWidth: 1,
    borderColor: C.line,
  },
  input: {
    flex: 1,
    height: 48,
    color: C.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  unitChip: {
    backgroundColor: C.ink,
    height: 48,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 13,
    borderBottomRightRadius: 13,
  },
  unitChipTxt: { color: C.card, fontWeight: '800', fontSize: 14 },
  lineTotal: { color: C.ok, fontWeight: '700', marginTop: 8, fontSize: 13 },
});
