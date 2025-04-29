import { Category } from "./category.schema";
import { Company } from "./company.schema";
import { Price } from "./price.schema";

export interface HomeProduct {
  id: string;
  name: string;
  prices: Price[];
  image: string;
}

// Response type cho API products (best sellers, new products, etc)
export interface HomeResponse {
  code: number;
  result: {
    categories: Category[],
    newProducts: HomeProduct[],
    topProducts: HomeProduct[],
    topCompanies: Company[]
  }
}
