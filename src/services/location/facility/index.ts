import { instance } from "../../instance";

export interface Facility {
  _id: string;
  name: string;
  code?: string;
  address: string;
  contactPhone: string;
  contactEmail?: string;
  isActive: boolean;
  location?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  managerId?: string;
  doctorIds?: string[];
  nurseIds?: string[];
  imageUrl?: string;
  schedules: {
    day: string;
    openTime: string;
    closeTime: string;
  }[];
}

interface FacilityListResponse {
  data: {
    result: Facility[];
    total: number;
  };
}

interface SingleFacilityResponse {
  data: Facility;
}

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

export const getFacilityById = async (
  id: string
): Promise<SingleFacilityResponse> => {
  try {
    const { data } = await instance.get<SingleFacilityResponse>(
      `/facility/${id}`
    );
    return data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Error fetching facility details"
    );
  }
};

export const createFacility = async (
  formData: FormData
): Promise<SingleFacilityResponse> => {
  try {
    const { data } = await instance.post<SingleFacilityResponse>(
      "/facility",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Error creating facility"
    );
  }
};

export const updateFacility = async (
  id: string,
  formData: FormData
): Promise<SingleFacilityResponse> => {
  try {
    const { data } = await instance.put<SingleFacilityResponse>(
      `/facility/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Error updating facility"
    );
  }
};

export const deleteFacility = async (id: string): Promise<void> => {
  try {
    console.log(`Deleting facility with ID: ${id}`);
    await instance.put(`/facility/delete/${id}`);
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Error deleting facility"
    );
  }
};
