export interface Product {
    id: string;
    name: string;
    quantity: number;
    benefits: string;
    ingredients: string;
    category: {
        id: string;
        name: string;
        image: string;
    };
    company: {
        id: string;
        name: string;
        image: string;
        origin: string;
    };
    prices: {
        id: string;
        unit: {
            id: string;
            name: string;
        };
        price: number;
    }[];
    image: string;
}

export interface ProductResponse {
    totalPages: number;
    totalElements: number;
    size: number;
    content: Product[];
}