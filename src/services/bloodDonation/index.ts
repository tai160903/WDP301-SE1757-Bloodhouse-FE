import { instance } from "../instance";

export const getAllBloodDonation = async ( params: any): Promise<any> => {
  try {
    console.log("Fetching blood donations with status:", status);
    const response = await instance.get<any>(
      "/blood-donation",
      {
        params: {
          status: params.status,
          facilityId: params.facilityId,
          limit: params.limit,
          page: params.page,
        },
      }
    );
    console.log(response.data.data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};
