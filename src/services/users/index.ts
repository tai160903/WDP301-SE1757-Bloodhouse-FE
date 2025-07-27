import { instance } from "@/services/instance";

export interface userProfiles extends IResponse.Response {
  data: {
    _id: string;
    fullName?: string;
    email: string;
    phone?: string;
    street?: string;
    city?: string;
    country?: string;
    location?: {
      type: string;
      coordinates: number[];
    };
    sex?: string;
    yob?: Date;
    bloodId?: {
      name: string;
    };
    avatar?: string;
    isAvailable?: boolean;
    isVerified?: boolean;
    status?: string;
  };
}

const getUserProfile = async (): Promise<userProfiles> => {
  try {
    const { data } = await instance.get<userProfiles>("/user/me");
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};

const getUsers = async (params: any): Promise<any> => {
  try {
    const { data } = await instance.get<any>("/user", { params });
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};





const resetPassword = async (token: any, newPassword : any): Promise<any> => {
  try {
    const { data } = await instance.post<any>("/user/reset-password", { token, newPassword });
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};

export { getUserProfile, getUsers, resetPassword };
