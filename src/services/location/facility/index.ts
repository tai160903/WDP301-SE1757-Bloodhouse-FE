// interface Facility {

// }
// interface FacilityResponse extends IResponse.Response  {
//     data: any
// }
// export const getFacilities = () => {
//   res.send('getFacilities');
// };

interface Facility {
  _id: string;
  name: string;
  address: string;
  contactPhone: string;
  isActive: boolean;
  schedules: {
    day: string;
    openTime: string;
    closeTime: string;
  }[];
}

interface FacilityResponse extends IResponse.Response {
  data: Facility[];
}
import { instance } from "../../instance";
export const getFacilities = async (): Promise<FacilityResponse> => {
  try {
    const { data } = await instance.get<FacilityResponse>("/facility");
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};
