import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { privacy } from './copy';
import { C } from './theme';

export function PrivacyPolicy({ onBack }: { onBack?: () => void }) {
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      {onBack ? (
        <Pressable onPress={onBack} style={styles.back} accessibilityRole="button" accessibilityLabel="Voltar">
          <Text style={styles.backTxt}>‹ Voltar</Text>
        </Pressable>
      ) : null}
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{privacy.title}</Text>
        <Text style={styles.body}>{privacy.intro}</Text>
        {privacy.sections.map((s) => (
          <View key={s.heading} style={styles.block}>
            <Text style={styles.heading}>{s.heading}</Text>
            <Text style={styles.body}>{s.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  back: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  backTxt: { color: C.accent, fontWeight: '700', fontSize: 16 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  title: { color: C.ink, fontSize: 30, fontWeight: '800', letterSpacing: -0.7, marginTop: 8 },
  heading: { color: C.ink, fontWeight: '800', fontSize: 16, marginBottom: 8 },
  body: { color: C.muted, fontSize: 16, lineHeight: 24 },
  block: { marginTop: 22 },
});
