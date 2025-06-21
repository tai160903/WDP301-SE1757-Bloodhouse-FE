import { instance } from "../instance";

export const getAllBloodDonation = async (status): Promise<any> => {
  try {
    console.log("Fetching blood donations with status:", status);
    const response = await instance.get<any>(
      `/blood-donation?status=${status}`
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};
