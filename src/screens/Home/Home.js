import {Text, StyleSheet, View, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
function App() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 20, color: 'red'}}>Home Page</Text>
      <Button title="Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});

export default App;
