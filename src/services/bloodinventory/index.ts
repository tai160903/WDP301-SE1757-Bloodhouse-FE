export interface BloodInventory {
  _id: string;
  facilityId: {
    _id: string;
    name: string;
    address: string;
    code: string;
  };
  componentId: {
    _id: string;
    name: string;
    description?: string;
  };
  groupId: {
    _id: string;
    name: string;
  };
  totalQuantity: number;
  createdAt: string;
  updatedAt: string;
}

interface BloodInventoryDetail extends BloodInventory {
  unitStats: [
    {
      _id: string;
      count: number;
      totalQuantity: number;
    }
  ];
  expiringUnits : [
    {
      barcode: string;
      quantity: number;
      expiresAt: string;
    }
  ]
}

export interface BloodInventoryResponse extends IResponse.Response {
  data: BloodInventory[];
}

interface BloodInventoryDetailResponse extends IResponse.Response {
  data: BloodInventoryDetail;
}

import { instance } from "../instance";
export const getBloodInventory = async (): Promise<any> => {
  try {
    const { data } = await instance.get<any & { data: any[] }>(
      "/blood-inventory"
    );
    return data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};

export const createBloodInventory = async (values: any): Promise<any> => {
  try{
    const { data } = await instance.post<any & { data: any[] }>(`/blood-inventory`, values);
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
}

export const getBloodInventoryDetail = async (id : string): Promise<any> => {
  try{
    const {data} = await instance.get<any>(`/blood-inventory/detail/${id}`);
    return data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
}