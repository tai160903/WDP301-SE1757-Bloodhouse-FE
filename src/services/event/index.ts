import axiosInstance from "@/utils/axiosInstance";

export const createEvent = async (data: any): Promise<any> => {
  try {
    console.log("createEvent data", data);
    const response = await axiosInstance.post("/event", data, {
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

export const getAllEventsByFacilityId = async (
  facilityId: string
): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/event/facility/${facilityId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Error when getting events."
    );
  }
};


export const getAllEvents = async (
): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/event`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Error when getting events."
    );
  }
};

export const getEventById = async (
  eventId: string
): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/event/${eventId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Error when getting events."
    );
  }
};