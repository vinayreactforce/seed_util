/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { open } from '@op-engineering/op-sqlite';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { getMyKey } from './src/utils/keyUtils';
import { DB_KEYS } from './src/constants/dbConstants';
import Button from './src/ui/Button';
import AppText from './src/ui/AppText';
import CheckBox from './src/ui/Checkbox';
import Radio from './src/ui/Radio';
import Switch from './src/ui/Switch';
import ConfirmationDialog from './src/ui/ConfirmationDialog';
import CloseBtn from './src/ui/CloseBtn';
import ChipMessage from './src/ui/ChipMessage';
import SmartCollapsible from './src/ui/Collapsible';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const init = async () => {
    try {
      const myKey = await getMyKey();
      const db = await open({ name: DB_KEYS.DB_NAME, encryptionKey: myKey });

      // const db = open({name: 'mydbw',encryptionKey: 'myEncryptiownKdey'});
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  useEffect(() => {
    init();
  }, []);

  console.log(`The is jjjj`);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [isSelected, setIsSelected] = useState(false);

  const handleCheckboxPress = (value: boolean, data: any) => {
    setIsSelected(value);
  };

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 100 }} />
      <Button title="Click me" type="outline" onPress={() => setIsSelected(true)} />
        <CloseBtn  circular variant="primary" onPress={() => setIsSelected(false)} />
          <ChipMessage type="info" text="Success is the best revenge for being wronged by someone very long text here"  onClose={() => setIsSelected(false)} />
      <ConfirmationDialog
        
        message="Are you sure you want to confirm?"
        onConfirm={() => alert('Confirmed')}
        onCancel={() => setIsSelected(false)}
        isVisible={isSelected}
      />
      <SmartCollapsible title="Collapsible">
      <View style={{ height: 100, backgroundColor: 'pink' ,justifyContent:'flex-end'}} >
        <AppText text="Hello" type="body" />
        <AppText text="Hello" type="body" />
        <AppText text="Hello" type="body" />
      </View>
      </SmartCollapsible>
      <AppText text="Hello" type="body" />
      {/* <CheckBox isSelected={isSelected} onPress={handleCheckboxPress} label="Checkbox" /> */}
      {/* <Radio isSelected={isSelected} onPress={handleCheckboxPress} label="Radio" /> */}
      <Switch
        value={isSelected}
        data={{ label: 'Switch' }}
        onValueChange={handleCheckboxPress}
      />
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
