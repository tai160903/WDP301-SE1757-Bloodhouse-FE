import axiosInstance from "@/utils/axiosInstance";
import { instance } from "../instance";

const getBloodDonationRegis = async (): Promise<any> => {
  try {
    const { data } = await instance.get<any & { data: any[] }>(
      "/blood-donation-registration/facility/all"
    );
    console.log(data.data.data);
    return data.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};

const createBloodDonationRegis = async (value: any): Promise<any> => {
  try {
    const { data } = await instance.post<any & { data: any[] }>(
      "/blood-donation-registration",
      value
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log("Have some error when call api:", err);
  }
};

export { getBloodDonationRegis, createBloodDonationRegis };
