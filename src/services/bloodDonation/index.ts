import { instance } from "../instance";

export const getAllBloodDonation = async (params: any): Promise<any> => {
  try {
    console.log("Fetching blood donations with status:", status);
    const response = await instance.get<any>("/blood-donation", {
      params: {
        status: params.status,
        facilityId: params.facilityId,
        limit: params.limit,
        page: params.page,
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};

export const getHealthCheck = async (id: string): Promise<any> => {
  try {
    const response = await instance.get<any>(
      `/health-check/registration/${id}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};

export const getBloodUnit = async (id: string, page = 1, limit = 10): Promise<any> => {
  try {
    const response = await instance.get<any>(`/blood-unit/donation/${id}`, {
      params: {
        page,
        limit
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};
