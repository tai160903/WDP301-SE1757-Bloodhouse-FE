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

// ===== GIFT PACKAGES API (Manager) =====
export interface GiftPackageItem {
  giftItemId: string | GiftItem;
  quantity: number;
}

export interface GiftPackage {
  _id: string;
  name: string;
  description?: string;
  facilityId: {
    _id: string;
    name: string;
    code: string;
  };
  items: GiftPackageItem[];
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateGiftPackageData {
  name: string;
  description?: string;
  items: { giftItemId: string; quantity: number }[];
  quantity: number;
  image?: string;
}

export interface UpdateGiftPackageData {
  name?: string;
  description?: string;
  items?: { giftItemId: string; quantity: number }[];
  quantity?: number;
  image?: string;
}

export interface GiftPackagesResponse {
  data: {
    data: GiftPackage[];
    metadata: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface GiftPackageResponse {
  data: GiftPackage;
}

// ===== GIFT INVENTORY API (Manager) =====
export interface GiftInventory {
  _id: string;
  facilityId: {
    _id: string;
    name: string;
    code: string;
  };
  giftItemId: GiftItem;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  costPerUnit: number;
  minStockLevel: number;
  lastStockDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddGiftToInventoryData {
  giftItemId: string;
  quantity: number;
  costPerUnit: number;
  minStockLevel?: number;
}

export interface UpdateGiftInventoryData {
  quantity?: number;
  costPerUnit?: number;
  minStockLevel?: number;
}

export interface GiftInventoryResponse {
  data: {
    data: GiftInventory[];
    metadata: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

// ===== GIFT BUDGET API (Manager) =====
export interface GiftBudget {
  _id: string;
  facilityId: {
    _id: string;
    name: string;
    code: string;
  };
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ManageBudgetData {
  budget: number;
  startDate: string;
  endDate: string;
}

export interface GiftBudgetResponse {
  data: GiftBudget;
}

// ===== GIFT DISTRIBUTION API (Manager) =====
export interface GiftDistribution {
  _id: string;
  facilityId: {
    _id: string;
    name: string;
    code: string;
  };
  giftItemId?: GiftItem;
  packageId?: GiftPackage;
  userId: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  donationId: {
    _id: string;
    donationDate: string;
    quantity: number;
  };
  quantity: number;
  costPerUnit: number;
  distributedBy: {
    _id: string;
    userId: {
      _id: string;
      fullName: string;
    };
    position: string;
  };
  distributedAt: string;
  notes?: string;
}

export interface DistributionSummary {
  totalDistributions: number;
  totalQuantity: number;
  totalCost: number;
}

export interface DistributionReportResponse {
  data: {
    data: GiftDistribution[];
    summary: DistributionSummary;
    metadata: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface GetDistributionReportParams {
  startDate?: string;
  endDate?: string;
  packageId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ===== GIFT LOG API (Manager) =====
export interface GiftLog {
  _id: string;
  facilityId: {
    _id: string;
    name: string;
    code: string;
  };
  giftItemId?: {
    _id: string;
    name: string;
    unit: string;
  };
  packageId?: {
    _id: string;
    name: string;
  };
  action: string;
  userId: {
    _id: string;
    userId: {
      _id: string;
      fullName: string;
    };
    position: string;
  };
  donationId?: {
    _id: string;
    donationDate: string;
  };
  details: any;
  timestamp: string;
}

export interface GiftLogsResponse {
  data: {
    data: GiftLog[];
    metadata: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface GetGiftLogsParams {
  action?: string;
  giftItemId?: string;
  userId?: string;
  packageId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// ===== SHARED GIFT ITEMS FUNCTIONS (Manager & Nurse) =====
const getSharedGiftItems = async (params?: GetGiftItemsParams): Promise<GiftItemsResponse> => {
  try {
    const { data } = await instance.get<GiftItemsResponse>("/gift/shared/gift-items", { params });
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi lấy danh sách quà tặng.");
  }
};

const getSharedGiftItemById = async (giftItemId: string): Promise<GiftItemResponse> => {
  try {
    const { data } = await instance.get<GiftItemResponse>(`/gift/shared/gift-items/${giftItemId}`);
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi lấy thông tin quà tặng.");
  }
};

// ===== GIFT ITEMS FUNCTIONS (Admin) =====
const getGiftItems = async (params?: GetGiftItemsParams): Promise<GiftItemsResponse> => {
  try {
    const { data } = await instance.get<GiftItemsResponse>("/gift/admin/gift-items", { params });
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi lấy danh sách quà tặng.");
  }
};

const getGiftItemById = async (giftItemId: string): Promise<GiftItemResponse> => {
  try {
    const { data } = await instance.get<GiftItemResponse>(`/gift/admin/gift-items/${giftItemId}`);
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi lấy thông tin quà tặng.");
  }
};

const createGiftItem = async (giftItemData: CreateGiftItemData): Promise<GiftItemResponse> => {
  try {
    const { data } = await instance.post<GiftItemResponse>("/gift/admin/gift-items", giftItemData);
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi tạo quà tặng.");
  }
};

const updateGiftItem = async (giftItemId: string, giftItemData: UpdateGiftItemData): Promise<GiftItemResponse> => {
  try {
    const { data } = await instance.patch<GiftItemResponse>(`/gift/admin/gift-items/${giftItemId}`, giftItemData);
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi cập nhật quà tặng.");
  }
};

const deleteGiftItem = async (giftItemId: string): Promise<any> => {
  try {
    const { data } = await instance.delete(`/gift/admin/gift-items/${giftItemId}`);
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi xóa quà tặng.");
  }
};

const getGiftStats = async (): Promise<GiftStatsResponse> => {
  try {
    const { data } = await instance.get<GiftStatsResponse>("/gift/admin/gift-items/stats");
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi lấy thống kê quà tặng.");
  }
};

// Helper function to compute availableQuantity for packages
const computePackageAvailableQuantity = (pkg: any): GiftPackage => {
  return {
    ...pkg,
    availableQuantity: (pkg.quantity || 0) - (pkg.reservedQuantity || 0)
  };
};

// ===== GIFT PACKAGES FUNCTIONS (Manager) =====
const getGiftPackages = async (params?: { page?: number; limit?: number; search?: string }): Promise<GiftPackagesResponse> => {
  try {
    const { data } = await instance.get<GiftPackagesResponse>('/gift/gift-packages', { params });
    
    // Compute availableQuantity for each package
    const packagesWithAvailableQuantity = data.data.data.map(computePackageAvailableQuantity);
    
    return {
      data: {
        ...data.data,
        data: packagesWithAvailableQuantity
      }
    };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi lấy danh sách gói quà.");
  }
};

const getGiftPackageById = async (packageId: string): Promise<GiftPackageResponse> => {
  try {
    const { data } = await instance.get<GiftPackageResponse>(`/gift/gift-packages/${packageId}`);
    
    // Compute availableQuantity for the package
    const packageWithAvailableQuantity = computePackageAvailableQuantity(data.data);
    
    return {
      data: packageWithAvailableQuantity
    };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi lấy thông tin gói quà.");
  }
};

const createGiftPackage = async (packageData: CreateGiftPackageData): Promise<GiftPackageResponse> => {
  try {
    const { data } = await instance.post<GiftPackageResponse>("/gift/gift-packages", packageData);
    
    // Compute availableQuantity for the created package
    const packageWithAvailableQuantity = computePackageAvailableQuantity(data.data);
    
    return {
      data: packageWithAvailableQuantity
    };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi tạo gói quà.");
  }
};

const updateGiftPackage = async (packageId: string, packageData: UpdateGiftPackageData): Promise<GiftPackageResponse> => {
  try {
    const { data } = await instance.patch<GiftPackageResponse>(`/gift/gift-packages/${packageId}`, packageData);
    
    // Compute availableQuantity for the updated package
    const packageWithAvailableQuantity = computePackageAvailableQuantity(data.data);
    
    return {
      data: packageWithAvailableQuantity
    };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi cập nhật gói quà.");
  }
};

const deleteGiftPackage = async (packageId: string): Promise<any> => {
  try {
    const { data } = await instance.delete(`/gift/gift-packages/${packageId}`);
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi xóa gói quà.");
  }
};

// ===== GIFT INVENTORY FUNCTIONS (Manager) =====
const getGiftInventory = async (params?: { page?: number; limit?: number; search?: string; category?: string; lowStock?: boolean }): Promise<GiftInventoryResponse> => {
  try {
    const { data } = await instance.get<GiftInventoryResponse>("/gift/inventory", { params });
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi lấy danh sách kho.");
  }
};

const addGiftToInventory = async (inventoryData: AddGiftToInventoryData): Promise<any> => {
  try {
    const { data } = await instance.post("/gift/inventory", inventoryData);
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi thêm vào kho.");
  }
};

const updateGiftInventory = async (inventoryId: string, inventoryData: UpdateGiftInventoryData): Promise<any> => {
  try {
    const { data } = await instance.patch(`/gift/inventory/${inventoryId}`, inventoryData);
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi cập nhật kho.");
  }
};

const deleteGiftInventory = async (inventoryId: string): Promise<any> => {
  try {
    const { data } = await instance.delete(`/gift/inventory/${inventoryId}`);
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi xóa khỏi kho.");
  }
};

// ===== GIFT BUDGET FUNCTIONS (Manager) =====
const getBudget = async (): Promise<GiftBudgetResponse> => {
  try {
    const { data } = await instance.get<GiftBudgetResponse>("/gift/budget");
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi lấy thông tin ngân sách.");
  }
};

const manageBudget = async (budgetData: ManageBudgetData): Promise<GiftBudgetResponse> => {
  try {
    const { data } = await instance.post<GiftBudgetResponse>("/gift/budget", budgetData);
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi cập nhật ngân sách.");
  }
};

// ===== GIFT DISTRIBUTION FUNCTIONS (Manager) =====
const getDistributionReport = async (params?: GetDistributionReportParams): Promise<DistributionReportResponse> => {
  try {
    const { data } = await instance.get<DistributionReportResponse>("/gift/distributions/report", { params });
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi lấy báo cáo phân phối.");
  }
};

// ===== GIFT LOG FUNCTIONS (Manager) =====
const getGiftLogs = async (params?: GetGiftLogsParams): Promise<GiftLogsResponse> => {
  try {
    const { data } = await instance.get<GiftLogsResponse>("/gift/logs", { params });
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi lấy lịch sử hoạt động.");
  }
};

export {
  // Shared Gift Items (Manager & Nurse)
  getSharedGiftItems,
  getSharedGiftItemById,
  // Gift Items (Admin)
  getGiftItems,
  getGiftItemById,
  createGiftItem,
  updateGiftItem,
  deleteGiftItem,
  getGiftStats,
  // Gift Packages (Manager)
  getGiftPackages,
  getGiftPackageById,
  createGiftPackage,
  updateGiftPackage,
  deleteGiftPackage,
  // Gift Inventory (Manager)
  getGiftInventory,
  addGiftToInventory,
  updateGiftInventory,
  deleteGiftInventory,
  // Gift Budget (Manager)
  getBudget,
  manageBudget,
  // Gift Distribution (Manager)
  getDistributionReport,
  // Gift Log API (Manager)
  getGiftLogs,
}; 