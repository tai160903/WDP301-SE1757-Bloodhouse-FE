interface TotalStaff {
  total: number;
}

interface TotalStaffResponse extends IResponse.Response {
  data: TotalStaff;
}
import { instance } from "../instance";
export const getTotalStaff = async (
  facilityId: string
): Promise<TotalStaffResponse> => {
  try {
    const { data } = await instance.get<TotalStaffResponse>(
      `/facility-staff/facility/${facilityId}`
    );
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};
