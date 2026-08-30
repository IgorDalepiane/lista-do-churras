import { Image, Text, type ImageSourcePropType } from 'react-native';

const ITEMS: Record<string, ImageSourcePropType> = {
  picanha: require('../../assets/items/picanha.png'),
  alcatra: require('../../assets/items/alcatra.png'),
  maminha: require('../../assets/items/maminha.png'),
  fraldinha: require('../../assets/items/fraldinha.png'),
  contrafile: require('../../assets/items/contrafile.png'),
  costela: require('../../assets/items/costela.png'),
  cupim: require('../../assets/items/cupim.png'),
  linguica: require('../../assets/items/linguica.png'),
  frango: require('../../assets/items/frango.png'),
  coracao: require('../../assets/items/coracao.png'),
  farofa: require('../../assets/items/farofa.png'),
  vinagrete: require('../../assets/items/vinagrete.png'),
  pao: require('../../assets/items/pao.png'),
  gelo: require('../../assets/items/gelo.png'),
  copo: require('../../assets/items/copo.png'),
  prato: require('../../assets/items/prato.png'),
  carvao: require('../../assets/items/carvao.png'),
  cerveja: require('../../assets/items/cerveja.png'),
  refrigerante: require('../../assets/items/refrigerante.png'),
  agua: require('../../assets/items/agua.png'),
};

export function ItemIcon({ id, size = 28 }: { id: string; size?: number }) {
  const src = ITEMS[id] ?? ITEMS.picanha;
  return <Image source={src} style={{ width: size, height: size }} accessibilityIgnoresInvertColors />;
}

const PEOPLE_EMOJI = { h: '👨', m: '👩', c: '🧒' } as const;

export function PeopleIcon({ kind, size = 28 }: { kind: 'h' | 'm' | 'c'; size?: number }) {
  return <Text style={{ fontSize: size, lineHeight: size + 6 }}>{PEOPLE_EMOJI[kind]}</Text>;
}
