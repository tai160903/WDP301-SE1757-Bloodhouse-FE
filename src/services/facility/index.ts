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
