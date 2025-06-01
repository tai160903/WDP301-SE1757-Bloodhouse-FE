import { instance } from "../instance";

export interface BloodComponent {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BloodComponentResponse extends IResponse.Response {
  data: BloodComponent;
}

export type BloodComponentInput = Omit<BloodComponent, "_id" | "createdAt" | "updatedAt" | "__v">;

export const getBloodComponents = async (): Promise<BloodComponent[]> => {
  try {
    const { data } = await instance.get<IResponse.Response & { data: BloodComponent[] }>("/blood-component");
    return data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};

export const createBloodComponent = async (data: BloodComponentInput): Promise<BloodComponent> => {
  try {
    const response = await instance.post<BloodComponentResponse>("/blood-component", data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};

export const updateBloodComponent = async (id: string, data: BloodComponentInput): Promise<BloodComponent> => {
  try {
    const response = await instance.put<BloodComponentResponse>(`/blood-component/${id}`, data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};
