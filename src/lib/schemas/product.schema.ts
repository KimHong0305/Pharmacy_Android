import { Category, Company, Unit } from './home.schema';

export interface ProductPrice {
  id: string;
  unit: Unit;
  price: number;
}

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
  price: ProductPrice;
  images: string[];
}

export interface ProductDetailResponse {
  code: number;
  result: ProductDetailItem[];
} 