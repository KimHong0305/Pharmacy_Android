export interface Company {
  id: string;
  name: string;
  image: string;
  origin: string;
}

export interface CompanyResponse {
  code: number;
  result: Company[];
}