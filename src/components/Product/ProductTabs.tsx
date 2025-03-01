import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import TextComponent from '../TextComponent';
import {appColors} from '../../constants/appColors';
import { Company, Category } from '../../lib/schemas/home.schema';

// Hàm format text
const formatText = (text: string) => {
  // Bước 1: Loại bỏ tất cả \\n
  const removedBackslash = text.replace(/\\n/g, '');
  
  // Bước 2: Tách các câu bằng dấu chấm và thêm dấu + ở đầu mỗi câu
  const sentences = removedBackslash.split('.');
  
  // Bước 3: Lọc bỏ các câu rỗng và format lại
  return sentences
    .filter(sentence => sentence.trim() !== '')
    .map(sentence => `+ ${sentence.trim()}`)
    .join('\n\n');
};

interface BenefitsTabProps {
  benefits: string;
}

interface IngredientsTabProps {
  ingredients: string;
}

interface ContraindicationsTabProps {
  contraindication: string;
}

interface UsageTabProps {
  objectUse: string;
}

interface InstructionsTabProps {
  instruction: string;
}

interface StorageTabProps {
  preserve: string;
}

interface NotesTabProps {
  note: string;
}

interface CompanyTabProps {
  company: Company;
}

interface CategoryTabProps {
  category: Category;
}

export const BenefitsTab: React.FC<BenefitsTabProps> = ({ benefits }) => (
  <View style={styles.tabContent}>
    <TextComponent text={formatText(benefits)} />
  </View>
);

export const IngredientsTab: React.FC<IngredientsTabProps> = ({ ingredients }) => (
  <View style={styles.tabContent}>
    <TextComponent text={formatText(ingredients)} />
  </View>
);

export const ContraindicationsTab: React.FC<ContraindicationsTabProps> = ({ contraindication }) => (
  <View style={styles.tabContent}>
    <TextComponent text={formatText(contraindication)} />
  </View>
);

export const UsageTab: React.FC<UsageTabProps> = ({ objectUse }) => (
  <ScrollView contentContainerStyle={styles.container}>
    <TextComponent 
      text="Đối tượng sử dụng:" 
      size={16}
      styles={styles.sectionTitle}
    />
    <View style={styles.contentList}>
      <TextComponent text={formatText(objectUse)} />
    </View>
  </ScrollView>
);

export const InstructionsTab: React.FC<InstructionsTabProps> = ({ instruction }) => (
  <ScrollView contentContainerStyle={styles.container}>
    <TextComponent 
      text="Hướng dẫn sử dụng:" 
      size={16}
      styles={styles.sectionTitle}
    />
    <View style={styles.contentList}>
      <TextComponent text={formatText(instruction)} />
    </View>
  </ScrollView>
);

export const StorageTab: React.FC<StorageTabProps> = ({ preserve }) => (
  <ScrollView contentContainerStyle={styles.container}>
    <TextComponent 
      text="Bảo quản:" 
      size={16}
      styles={styles.sectionTitle}
    />
    <View style={styles.contentList}>
      <TextComponent text={formatText(preserve)} />
    </View>
  </ScrollView>
);

export const NotesTab: React.FC<NotesTabProps> = ({ note }) => (
  <ScrollView contentContainerStyle={styles.container}>
    <TextComponent 
      text="Lưu ý:" 
      size={16}
      styles={styles.sectionTitle}
    />
    <View style={styles.contentList}>
      <TextComponent text={formatText(note)} />
    </View>
  </ScrollView>
);

export const CompanyTab: React.FC<CompanyTabProps> = ({ company }) => (
  <ScrollView contentContainerStyle={styles.container}>
    <TextComponent 
      text="Thông tin công ty:" 
      size={16}
      styles={styles.sectionTitle}
    />
    <View style={styles.contentList}>
      <TextComponent text={company.name} />
      <TextComponent text={company.origin} />
    </View>
  </ScrollView>
);

export const CategoryTab: React.FC<CategoryTabProps> = ({ category }) => (
  <ScrollView contentContainerStyle={styles.container}>
    <TextComponent 
      text="Danh mục:" 
      size={16}
      styles={styles.sectionTitle}
    />
    <View style={styles.contentList}>
      <TextComponent text={category.name} />
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    padding: 15,
    height: 150
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: appColors.blue,
  },
  contentList: {
    gap: 8,
    paddingLeft: 10,
  },
  tabContent: {
    padding: 15,
  },
}); 