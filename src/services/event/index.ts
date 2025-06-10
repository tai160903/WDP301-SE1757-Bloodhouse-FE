import { instance } from "../instance";

export const createEvent = async (data: any): Promise<any> => {
  try {
    console.log("createEvent data", data);
    const response = await instance.post("/event", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("createEvent response", response.data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Error when creating event."
    );
  }
};
