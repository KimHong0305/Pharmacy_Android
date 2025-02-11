import {Text, StyleSheet, View} from 'react-native';
function App() {
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 20, color: 'red'}}>Home Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F7FF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});

export default App;
