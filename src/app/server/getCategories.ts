"use server"
// import axios from "axios";
import domin from "../utils/Domin";

export interface ICategory {
  title: string;
  description: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
interface IReturnDate {
  success: boolean;
  categories: ICategory[];
  count: number;
}

export default async function getCategories(): Promise<IReturnDate> {
  const response = await fetch(`${domin}/api/category`);
  return await response.json();
}
