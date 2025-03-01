export interface Unit {
  id: string;
  name: string;
}

export interface Price {
  id: string;
  unit: Unit;
  price: number;
}

export interface Company {
  id: string;
  name: string;
  image: string;
  origin: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  parent?: Category;
}

// Response type cho API categories
export interface CategoryResponse {
  code: number;
  result: Category[];
}

export interface Product {
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
export interface ProductResponse {
  code: number;
  result: Product[];
}

export interface TopCompany {
  id: string;
  name: string;
  image: string;
}

export interface TopCompanyResponse {
  code: number;
  result: TopCompany[];
}