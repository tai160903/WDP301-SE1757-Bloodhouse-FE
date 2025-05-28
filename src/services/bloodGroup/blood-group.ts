import { instance } from "../instance";

export interface BloodGroup {
  _id: string;
  name: string;
  note: string;
  characteristics: string[];
  populationRate: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BloodGroupResponse extends IResponse.Response {
  data: BloodGroup;
}

export type BloodGroupInput = Omit<BloodGroup, "_id" | "createdAt" | "updatedAt" | "__v">;

export const getBloodGroups = async (): Promise<BloodGroup[]> => {
  try {
    const { data } = await instance.get<IResponse.Response & { data: BloodGroup[] }>("/blood-group");
    return data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};

export const createBloodGroup = async (data: BloodGroupInput): Promise<BloodGroup> => {
  try {
    const response = await instance.post<BloodGroupResponse>("/blood-group", data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};

export const updateBloodGroup = async (id: string, data: BloodGroupInput): Promise<BloodGroup> => {
  try {
    const response = await instance.put<BloodGroupResponse>(`/blood-group/${id}`, data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};
