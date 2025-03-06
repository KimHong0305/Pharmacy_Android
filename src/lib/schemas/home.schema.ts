import { Category } from "./category.schema";
import { Company } from "./company.schema";
import { Price } from "./price.schema";

export interface HomeProduct {
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
  prices: Price[];
  image: string;
  totalSold: number;
}

// Response type cho API products (best sellers, new products, etc)
export interface HomeProductResponse {
  code: number;
  result: HomeProduct[];
}
