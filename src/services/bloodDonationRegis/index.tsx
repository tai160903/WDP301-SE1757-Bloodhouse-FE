import { instance } from "../instance";

const getBloodDonationRegis = async (params: any): Promise<any> => {
  try {
    const { data } = await instance.get<any & { data: any[] }>(
      "/blood-donation-registration/facility/all",
      {
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          status: params.status,
          search: params.search,
          startDate: params.startDate,
          endDate: params.endDate,
          bloodGroupId: params.bloodGroupId,
          staffId: params.staffId,
          includeStats: params.includeStats ?? false,
        },
      }
    );
    return data.data;
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

export const updateBloodDonationRegis = async (
  id: string,
  payload: any
): Promise<any> => {
  try {
    const { data } = await instance.put<any>(
      `/blood-donation-registration/${id}`,
      payload
    );
    return data;
  } catch (err) {
    console.log("Have some error when call api:", err);
    throw err;
  }
};

export const bloodDonationRegisDetail = async (id): Promise<any> => {
  try {
    const { data } = await instance.get<any & { data: any[] }>(
      `/blood-donation-registration/${id}`
    );
    return data.data;
  } catch (err) {
    console.log("Have some error when call api:", err);
  }
};

const bloodDonationRegisHistory = async (): Promise<any> => {
  try {
    const { data } = await instance.get<any & { data: any[] }>(
      "/blood-donation-registration/user"
    );
    return data;
  } catch (err) {
    console.log("Have some error when call api:", err);
  }
};

const getBloodDonationDetail = async (id: string): Promise<any> => {
  try {
    const { data } = await instance.get<any & { data: any[] }>(
      `/blood-donation-registration/${id}`
    );
    return data;
  } catch (err) {
    console.log("Have some error when call api:", err);
  }
};

export {
  getBloodDonationRegis,
  createBloodDonationRegis,
  bloodDonationRegisHistory,
  getBloodDonationDetail,
};
