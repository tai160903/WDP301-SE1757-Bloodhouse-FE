import { instance } from "../instance";

export const createFacility = async (data: any): Promise<any> => {
  try {
    const response = await instance.post("/facility", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi tạo cơ sở.");
  }
};

export const getAllFacilities = async (): Promise<any> => {
  try {
    const { data } = await instance.get("/facility");
    return data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Lỗi khi lấy danh sách cơ sở."
    );
  }
};

export const getFacilityById = async (id: any): Promise<any> => {
  try {
    const { data } = await instance.get(`/facility/${id}`);
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết cơ sở:", error);
  }
};

export const updateFacility = async (id: string, data: any): Promise<any> => {
  try {
    const response = await instance.put(`/facility/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Lỗi khi cập nhật cơ sở."
    );
  }
};
