import {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

const App = ({navigation}) => {
  const [countdown, setCountdown] = useState(0.3);
  const isFocused = useIsFocused(); // Kiểm tra xem màn hình này có đang được hiển thị không

  useEffect(() => {
    if (!isFocused) return; // Nếu màn hình không được hiển thị, không làm gì cả

    const timeout = setTimeout(() => {
      navigation.navigate('Home');
    }, countdown * 10000);

    const interval = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1);
    }, 10000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [countdown, navigation, isFocused]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.text}>Pharmacy</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'blue',
  },
});

export default App;
