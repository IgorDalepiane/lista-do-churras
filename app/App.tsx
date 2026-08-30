import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MonetizationProvider } from './src/monetization/MonetizationProvider';
import { Wizard } from './src/ui/Wizard';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <MonetizationProvider>
        <Wizard />
      </MonetizationProvider>
    </SafeAreaProvider>
  );
}
