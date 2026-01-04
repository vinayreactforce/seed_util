/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import {  StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { open, } from '@op-engineering/op-sqlite';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { getMyKey } from './src/utils/keyUtils';
import { DB_KEYS } from './src/constants/dbConstants';
import Button from './src/ui/Button';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const init = async () => {
    try {
      const myKey = await getMyKey();
      const db= await open({name: DB_KEYS.DB_NAME,encryptionKey: myKey});
      alert(JSON.stringify(db));
      // const db = open({name: 'mydbw',encryptionKey: 'myEncryptiownKdey'});
      
  
  
    } catch (error) {
      console.log(error);
      alert(error);
    }
    
  }
  useEffect(()=>{
    init();
  },[])

  console.log(`The is jjjj`)

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={{marginTop: 100}} />
      <Button  title="Click me" onPress={() => alert('Button pressed')} />
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
