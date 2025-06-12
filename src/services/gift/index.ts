import { instance } from "@/services/instance";

export interface GiftItem {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  unit: string;
  category: string;
  costPerUnit: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface GiftItemsResponse {
  data: {
    data: GiftItem[];
    metadata: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface GiftItemResponse {
  data: GiftItem;
}

export interface CreateGiftItemData {
  name: string;
  description?: string;
  image?: string;
  unit: string;
  category: string;
  costPerUnit: number;
}

export interface UpdateGiftItemData {
  name?: string;
  description?: string;
  image?: string;
  unit?: string;
  category?: string;
  costPerUnit?: number;
  isActive?: boolean;
}

export interface GetGiftItemsParams {
  category?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GiftStats {
  totalItems: number;
  totalCategories: number;
  mostPopularCategory: {
    category: string;
    count: number;
  };
  lowStockItems: number;
  categoryBreakdown: {
    [category: string]: number;
  };
}

export interface GiftStatsResponse {
  data: GiftStats;
}

// Get all gift items
const getGiftItems = async (params?: GetGiftItemsParams): Promise<GiftItemsResponse> => {
  try {
    const { data } = await instance.get<GiftItemsResponse>("/gift/admin/gift-items", { params });
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi lấy danh sách quà tặng.");
  }
};

// Get gift item by ID
const getGiftItemById = async (giftItemId: string): Promise<GiftItemResponse> => {
  try {
    const { data } = await instance.get<GiftItemResponse>(`/gift/admin/gift-items/${giftItemId}`);
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi lấy thông tin quà tặng.");
  }
};

// Create new gift item
const createGiftItem = async (giftItemData: CreateGiftItemData): Promise<GiftItemResponse> => {
  try {
    const { data } = await instance.post<GiftItemResponse>("/gift/admin/gift-items", giftItemData);
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi tạo quà tặng.");
  }
};

// Update gift item
const updateGiftItem = async (giftItemId: string, giftItemData: UpdateGiftItemData): Promise<GiftItemResponse> => {
  try {
    const { data } = await instance.patch<GiftItemResponse>(`/gift/admin/gift-items/${giftItemId}`, giftItemData);
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi cập nhật quà tặng.");
  }
};

// Delete gift item
const deleteGiftItem = async (giftItemId: string): Promise<any> => {
  try {
    const { data } = await instance.delete(`/gift/admin/gift-items/${giftItemId}`);
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi xóa quà tặng.");
  }
};

// Get gift statistics (for admin stats overview)
const getGiftStats = async (): Promise<GiftStatsResponse> => {
  try {
    const { data } = await instance.get<GiftStatsResponse>("/gift/admin/gift-items/stats");
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi lấy thống kê quà tặng.");
  }
};

export {
  getGiftItems,
  getGiftItemById,
  createGiftItem,
  updateGiftItem,
  deleteGiftItem,
  getGiftStats,
}; 