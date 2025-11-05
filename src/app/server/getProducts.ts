import axios from "axios";
import domin from "../utils/Domin";

export interface IProperties {
  key: string;
  value: string;
}

export interface Iproducts {
  name: string;
  _id: string;
  description: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  properties: IProperties[];
  image?: string;
}

interface IData {
  products: Iproducts[];
  count: number;
  status: number;
}

export default async function getProductsFromDB() {
  const response = await axios.get<IData>(`${domin}/api/products`);

  return response.data;
}
