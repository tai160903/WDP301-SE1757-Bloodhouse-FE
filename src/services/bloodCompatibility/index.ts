import { instance } from "../instance";

export interface BloodCompability {
  _id: string;
  bloodCompability: string;
  componentId: string;
  canDonateTo:[],
  canReceiveFrom:[],
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BloodCompabilityResponse extends IResponse.Response {
  data: BloodCompability[];
}


export const getBloodCompabilities = async (
  bloodGroupId: string,
  componentId: string
): Promise<BloodCompability[]> => {
  try {
    const { data } = await instance.get<BloodCompabilityResponse>(
      `/blood-compatibility`,
      {
        params: {
          bloodGroupId,
          componentId,
        },
      }
    );
    return data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};


export const getBloodGroups = async ()  => {
  try {
    const { data } = await instance.get<any>(`blood-group`);
    return data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};

export const getBloodComponents = async ()  => {
  try {
    const { data } = await instance.get<any>(`blood-component`);
    return data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};