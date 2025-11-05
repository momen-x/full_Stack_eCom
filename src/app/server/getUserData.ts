// app/server/getUserData.ts
import axios from "axios";
import domin from "../utils/Domin";

export interface IUser {
  email: string;
  emailVerified: null | boolean;
  image: string;
  isAdmin: boolean;
  name: string;
  _id: string;
}

export interface ReturnData {
  count: number;
  success: boolean;
  users: IUser[];
}

// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// let cachedAdminEmails: string[] = [];
// let lastFetch = 0;

// export const getListOfAdminEmail = async (
//   forceRefresh = false
// ): Promise<string[]> => {
//   const now = Date.now();

//   // Return cache if valid
//   if (
//     !forceRefresh &&
//     cachedAdminEmails.length > 0 &&
//     now - lastFetch < CACHE_DURATION
//   ) {
//     return cachedAdminEmails;
//   }

//   try {
//     const response = await axios.get<ReturnData>(`${domin}/api/users`);

//     cachedAdminEmails = response.data.users
//       .filter((user) => user.isAdmin)
//       .map((user) => user.email);

//     lastFetch = now;

//     return cachedAdminEmails;
//   } catch (error) {
//     console.error("Failed to fetch admin emails:", error);
//     // Return cached data if fetch fails
//     return cachedAdminEmails;
//   }
// };

export const getUserData = async (): Promise<IUser[]> => {
  try {
    const response = await axios.get<ReturnData>(`${domin}/api/users`);
    const users = response.data.users;
    return users;
  } catch (error) {
    console.error(error);

    return [];
  }
};
