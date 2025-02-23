// screens/HomeScreen.tsx
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import TabBar from '../../components/TabBar';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Home Page</Text>
      <TabBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
