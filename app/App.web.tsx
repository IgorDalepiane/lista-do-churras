import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PrivacyPolicy } from './src/ui/PrivacyPolicy';

export default function App() {
  return (
    <SafeAreaProvider>
      <PrivacyPolicy />
    </SafeAreaProvider>
  );
}
