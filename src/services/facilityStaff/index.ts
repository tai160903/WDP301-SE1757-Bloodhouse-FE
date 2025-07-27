interface Response extends IResponse.Response {
  data: any;
}
import { instance } from "../instance";

interface UserData {
  _id: string;
  fullName: string;
  email: string;
  avatar: string;
}

interface StaffData {
  _id: string;
  position: string;
  isDeleted: boolean;
  isDelete: boolean;
  userId: UserData;
}

interface TotalStaffResponse {
  data: {
    total: number;
  };
}

interface FacilityListResponse {
  data: FacilityData[];
}

interface FacilityData {
  _id: string;
  name: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  isActive: boolean;
}
interface StaffListResponse {
  data: StaffData[];
}

export const getTotalStaff = async (
  facilityId: string
): Promise<TotalStaffResponse> => {
  try {
    const { data } = await instance.get<TotalStaffResponse>(
      `/facility-staff/facility/${facilityId}`
    );
    return data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Error when calling API."
    );
  }
};

export const getAllStaffsNotAssignedToFacility = async (
  position: string
): Promise<StaffListResponse> => {
  try {
    const { data } = await instance.get<StaffListResponse>(
      `/facility-staff/not-assigned?position=${position}`
    );
    return data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Error when calling API."
    );
  }
};

export const getAllStaffs = async (params: any): Promise<any> => {
  try {
    const { data } = await instance.get<any>(`/facility-staff`, {
      params,
    });
    return data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Error when calling API."
    );
  }
};
export const getStaffById = async (id: string): Promise<any> => {
  try {
    const { data } = await instance.get<any>(`/facility-staff/${id}`);
    return data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Error when calling API."
    );
  }
};

export const createStaff = async (staffData: Partial<StaffData>): Promise<StaffData> => {
  try {
    const { data } = await instance.post<StaffData>("/facility-staff", staffData);
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Error when calling API.");
  }
};

export const updateStaff = async (staffData: Partial<StaffData>): Promise<StaffData> => {
  try {
    const { data } = await instance.put<StaffData>(`/facility-staff/${staffData._id}`, staffData);
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Error when calling API.");
  }
};

export const getFacilities = async (): Promise<any> => {
  try {
    const { data } = await instance.get<any>("/facility");
    return data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Error fetching facilities"
    );
  }
};