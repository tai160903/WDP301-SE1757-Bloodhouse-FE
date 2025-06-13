import { instance } from "../instance";

const getBloodDonationRegis = async (): Promise<any> => {
  try {
    const { data } = await instance.get<any & { data: any[] }>(
      "/blood-donation-registration"
    );
    console.log(data.data.data);
    return data.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};

export { getBloodDonationRegis };
