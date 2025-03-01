export interface Category {
  id: string;
  name: string;
  image: string;
  parent?: Category;
}

export interface CategoryResponse {
  code: number;
  result: Category[];
}