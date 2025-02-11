import {Text, StyleSheet, View, Button, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
function App() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text>Home Page</Text>
      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.footerButtonText}>Trang chủ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerButtonText}>Danh mục</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerButtonText}>Tư vấn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerButtonText}>Đơn hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton} onPress={() => navigation.navigate('UserInfo')}>
          <Text style={styles.footerButtonText}>Tài khoản</Text>
        </TouchableOpacity>
      </View>
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    position: 'absolute',
    bottom: 0,
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 16,
    color: '#6200EE',
  }
});

export default App;
