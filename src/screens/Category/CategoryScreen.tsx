import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { appColors } from '../../constants/appColors';
import { getCategoryDetail } from '../../lib/redux/reducers/category.reducer';
import { getCategories } from '../../lib/redux/reducers/category.reducer';
import { RootState } from '../../lib/redux/rootReducer';
import { AppDispatch } from '../../lib/redux/store';
import { NavigationProp } from '../../navigators';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default function CategoryScreen() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();

  const {rootCategories ,subCategories, loading: detailLoading } = useSelector((state: RootState) => state.category);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleCategoryPress = (categoryId: string) => {
    setActiveCategory(categoryId);
    dispatch(getCategoryDetail(categoryId));
  };

  const handleProductCategory = (categoryId: string) => {
    navigation.navigate('ProductCategoryScreen', {categoryId: categoryId})
  }

  return (
    <View style={styles.container}>
      {/* Sidebar danh mục lớn */}
      <View style={styles.sidebar}>
        {rootCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryItem, activeCategory === category.id && styles.activeCategory]}
            onPress={() => handleCategoryPress(category.id)}>
            <Image 
                source={{ uri: category.image }} 
                style={styles.image} 
            />
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Danh mục con */}
      <View style={styles.content}>
        {detailLoading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : subCategories.length > 0 ? (
          <>
          <FlatList
            data={subCategories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.subCategoryItem}
                onPress={() => handleProductCategory(item.id)}
              >
                <Image source={{ uri: item.image }} style={styles.image} />
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            ListFooterComponent={
              <TouchableOpacity
                style={styles.seeAllButton}
                onPress={() => handleProductCategory(activeCategory!)}
              >
                <Icon name="dots-horizontal" size={22} color={'#007AFF'} />
                <Text style={styles.seeAllText}>Xem tất cả</Text>
              </TouchableOpacity>
            }
          />
    </>
        ) : (
          <>
            <Text style={styles.noCategoryText}>Chọn danh mục để xem chi tiết</Text>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => handleProductCategory(activeCategory!)}
            >
              <Icon name="dots-horizontal" size={22} color={'#007AFF'}/>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection: 'row',
    paddingTop: 40,
  },
  sidebar: {
    width: '30%', 
    backgroundColor: appColors.white,
  },
  content: {
    width: '70%', 
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryItem: {
    padding: 14, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ccc',
    flexDirection: 'column',
    alignItems: 'center',
  },
  activeCategory: {
    backgroundColor: '#2196F3',
  },
  categoryText: {
    color: '#000',
    textAlign: 'center',
  },
  subCategoryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
  },
  noCategoryText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  seeAllButton: {
    padding: 8,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    width: '100%',
    justifyContent:'center',
  },
  seeAllText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 16,
  },  
});
