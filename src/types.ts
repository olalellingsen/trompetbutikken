export interface Product {
  id?: string;
  prod_id: string;
  brand: string;
  model: string;
  category: string;
  type: string;
  price: string;
  stock: string;
  imageUrl: string[];
  description: string;
  artists: string[];
}

export interface News {
  id?: string;
  number: number;
  title: string;
  content: string;
  imageUrl: string;
}
