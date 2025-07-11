import { instance } from "../instance";

export const createFacility = async (data: any): Promise<any> => {
  try {
    console.log("createFacility data", data);
    const response = await instance.post("/facility", data);
    console.log("createFacility response", response.data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Error when creating facility."
    );
  }
};

export const getAllFacilities = async (): Promise<any> => {
  try {
    const { data } = await instance.get("/facility");
    return data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Error when fetching facilities."
    );
  }
};

export const getFacilityById = async (id: any): Promise<any> => {
  try{
    const {data} = await instance.get(`/facility/${id}`);
    return data
  } catch (error){
    console.error("Error in getFacilityById:", error);
  }
}