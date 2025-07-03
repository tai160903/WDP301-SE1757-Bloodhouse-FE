import { instance } from "@/services/instance";

export const matchBloodService = {
  getMatchBlood: async (bloodGroupId: string , componentId: string) => {
    try {
      const response = await instance.get(`/blood-compatibility/${bloodGroupId}/${componentId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching match blood:", error);
      throw error;
    }
  },
};
