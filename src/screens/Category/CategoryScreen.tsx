import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import { appColors } from '../../constants/appColors';
import { Image } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../navigators';

const categories = [
  {
    name: 'Thuốc',
    image: require('../../assets/images/category/thuoc.png'),
    subCategories: [
      {
        name: 'Thuốc kê đơn',
        image: require('../../assets/images/category/thuoc.png'),
      },
      {
        name: 'Thuốc không kê đơn',
        image: require('../../assets/images/category/thuoc.png'),
      },
    ],
  },
  {
    name: 'Thực phẩm chức năng',
    image: require('../../assets/images/category/thucphamchucnang.jpg'),
    subCategories: [
      {
        name: 'Dành cho mắt',
        image: require('../../assets/images/category/thucphamchucnang.jpg'),
      },
      {
        name: 'Dành cho máu',
        image: require('../../assets/images/category/thucphamchucnang.jpg'),
      },
    ],
  },
  {
    name: 'Chăm sóc cá nhân',
    image: require('../../assets/images/category/chamsoccanhan.jpg'),
    subCategories: [
      {
        name: 'Dầu gội',
        image: require('../../assets/images/category/chamsoccanhan.jpg'),
      },
      {
        name: 'Mỹ phẩm',
        image: require('../../assets/images/category/chamsoccanhan.jpg'),
      },
    ],
  },
  {
    name: 'Mẹ và Bé',
    image: require('../../assets/images/category/mevabe.jpg'),
    subCategories: [
      {
        name: 'Sửa cho bé',
        image: require('../../assets/images/category/mevabe.jpg'),
      },
      {
        name: 'Tả bỉm',
        image: require('../../assets/images/category/mevabe.jpg'),
      },
    ],
  },
  {
    name: 'Chăm sóc sắc đẹp',
    image: require('../../assets/images/category/chamsocsacdep.jpg'),
    subCategories: [
      {
        name: 'Mỹ phẩm',
        image: require('../../assets/images/category/chamsocsacdep.jpg'),
      },
      {
        name: 'Kem dưỡng',
        image: require('../../assets/images/category/chamsocsacdep.jpg'),
      },
    ],
  },
  {
    name: 'Thiết bị y tế',
    image: require('../../assets/images/category/thietbiyte.jpg'),
    subCategories: [
      {
        name: 'Nhiệt kế',
        image: require('../../assets/images/category/thietbiyte.jpg'),
      },
      {
        name: 'Máy đo huyết áp',
        image: require('../../assets/images/category/thietbiyte.jpg'),
      },
    ],
  },
];

export default function CategoryScreen() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryItem,
              activeCategory === index && styles.activeCategory,
            ]}
            onPress={() => setActiveCategory(index)}>
            <Image source={category.image} style={styles.image} />
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {activeCategory !== null && (
          <FlatList
            data={categories[activeCategory].subCategories}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity style={styles.subCategoryItem}>
                <Image source={item.image} style={styles.image} />
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection: 'row'
  },
  sidebar: {
    width: '30%', 
    backgroundColor: appColors.white,
  },
  content: {
    width: '60%', 
    padding: 10
  },
  categoryItem: {
    padding: 14, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ccc',
    flexDirection: 'column',
    alignItems: 'center'
  },
  activeCategory: {
    backgroundColor: '#2196F3'
  },
  categoryText: {
    color: '#000',
    textAlign: 'center'
  },
  subCategoryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center'
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 20
  }
});
