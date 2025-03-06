import { Category } from './category.schema';
import { Company } from './company.schema';
import { Price } from './price.schema';

export interface ProductDetailItem {
  id: string;
  name: string;
  quantity: number;
  benefits: string;
  ingredients: string;
  constraindication: string;
  object_use: string;
  instruction: string;
  preserve: string;
  note: string;
  doctor_advice: boolean;
  dateCreation: string;
  dateExpiration: string;
  company: Company;
  category: Category;
  price: Price;
  images: string[];
}

export interface ProductDetailResponse {
  code: number;
  result: ProductDetailItem[];
} 

export interface Product {
  id: string;
  name: string;
  quantity: number;
  benefits: string;
  ingredients: string;
  category: Category;
  company: Company;
  prices: Price[];
  image: string;
}

export interface ProductResponse {
  code: number,
  result: {
    totalPages: number,
    totalElements: number,
    size: number,
    content: Product[]
  }
}