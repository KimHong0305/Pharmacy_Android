import {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';

const App = ({navigation}) => {
  const [countdown, setCountdown] = useState(0.3);
  useEffect(() => {
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
  }, [countdown, navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo.jpg')}
        style={styles.logo}
        resizeMode="contain" // Để đảm bảo hình ảnh không bị biến dạng
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
    width: 100, // Kích thước logo
    height: 100, // Kích thước logo
    marginBottom: 20, // Khoảng cách giữa logo và chữ
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'blue',
  },
});

export default App;
