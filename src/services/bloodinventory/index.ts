interface BloodInventory {
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
  };
  groupId: {
    _id: string;
    name: string;
  };
  totalQuantity: number;
  createdAt: string;
  updatedAt: string;
}

interface BloodInventoryResponse extends IResponse.Response {
  data: BloodInventory[];
}

import { instance } from "../instance";
export const getBloodInventory = async (): Promise<BloodInventoryResponse> => {
  try {
    const { data } = await instance.get<BloodInventoryResponse>(
      "/blood-inventory"
    );
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};
