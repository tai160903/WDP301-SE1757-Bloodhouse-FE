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

interface BloodInventoryResponse extends IResponse.Response {
  data: BloodInventory[];
}

interface BloodInventoryDetailResponse extends IResponse.Response {
  data: BloodInventoryDetail;
}

import { instance } from "../instance";
export const getBloodInventory = async (): Promise<BloodInventoryResponse> => {
  try {
    const { data } = await instance.get<BloodInventoryResponse>(
      "/blood-inventory"
    );
    console.log(data)
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};

export const getBloodInventoryDetail = async (id : string): Promise<BloodInventoryDetailResponse> => {
  try{
    const {data} = await instance.get<BloodInventoryDetailResponse>(`/blood-inventory/${id}`);
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
}