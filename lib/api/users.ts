import axios from "axios";

export type CurrentDbUser = {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
};

type GetCurrentDbUserResponse = {
  user: CurrentDbUser | null;
};

export async function getCurrentDbUserClient(): Promise<CurrentDbUser | null> {
  try {
    const response = await axios.get<GetCurrentDbUserResponse>("/api/me", {
      withCredentials: true,
    });
    return response.data.user ?? null;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw new Error("Failed to fetch current user");
  }
}
