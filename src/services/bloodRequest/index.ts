import { instance } from '../instance';
interface BloodRequest {
    _id: string;
    name: string;
    bloodType: string;
    bloodComponent: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    isUrgent: boolean;
    street: string;
    city: string;
    lat: number;
    Ing: number;
    reason: string;
    medicalDetails : string;
    note: string;
    preferredDate : string;
    consent: boolean;
    facilityId: string;
    medicalDocuments :[]

}

export interface BloodRequestDetail {
  _id: string;
  bloodId: {
    type: string;
  };
  userId: {
    fullName: string;
    email: string;
    phone: string;
  };
  facilityId: {
    name: string;
    street: string;
    city: string;
  };
  staffId: {
    fullName: string;
    email: string;
    phone: string;
  };
  patientName: string;
  patientAge: string;
  bloodComponent: string;
  quantity: number;
  isUrgent: boolean;
  status: string;
  location: {
    type: string;
    coordinates: number[];
  };
  street: string;
  city: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  reason: string;
  medicalDetails: string;
  medicalDocumentUrl: string[];
  note: string;
  preferredDate: string; // ISO date string (e.g., "2025-06-12T03:34:34.038Z")
  consent: boolean;
  createdAt: string;
  updatedAt: string;
}


interface UpdateStatus {
    status: string
    facilityId: string
}

interface BloodRequestResponse extends IResponse.Response  {
    data: BloodRequest[]
}

interface BloodRequestDetailResponse extends IResponse.Response  {
    data: BloodRequestDetail
}

interface UpdatePayload {
  status: string;
  staffId: string;
}

export const getBloodRequests = async (
  facilityId: string,
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  sortOrder: "asc" | "desc" | "1" | "-1" = "-1"
): Promise<BloodRequest[]> => {
  try {
    const { data } = await instance.get<BloodRequestResponse>(
      `/blood-request/facility/${facilityId}`,
      {
        params: {
          page,
          limit,
          sortBy,
          sortOrder,
        },
      }
    );
    return data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};

export const getBloodRequestId = async (facilityId : any, id : any) : Promise<any> => {
  try {
    const { data } = await instance.get<any>(`/blood-request/facility/${facilityId}/${id}`);
    return data.data;
  } catch (error: any) {
    throw new Error(error?.response?.message || "Lỗi khi gọi API.");
  }
}

export const updateStatus = async (
  id: string,
  facilityId: string,
  payload: UpdatePayload
): Promise<UpdateStatus> => {
  try {
    const response = await instance.patch<UpdateStatus>(
      `/blood-request/facility/${facilityId}/${id}/status`,
      payload
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};

export const createBloodRequest = async (
  formValues: {
    groupId: string;
    quantity: number;
    address: string;
    reason: string;
    preferredDate: Date;
    componentId?: string;
    isUrgent?: boolean;
    latitude?: number;
    longitude?: number;
    note?: string;
  },
  medicalDocuments: File[] = []
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("groupId", formValues.groupId);
    formData.append("quantity", String(formValues.quantity));
    formData.append("address", formValues.address);
    formData.append("reason", formValues.reason);
    formData.append("preferredDate", formValues.preferredDate.toISOString());

    if (formValues.componentId)
      formData.append("componentId", formValues.componentId);
    if (formValues.isUrgent !== undefined)
      formData.append("isUrgent", String(formValues.isUrgent));
    if (formValues.latitude !== undefined)
      formData.append("latitude", String(formValues.latitude));
    if (formValues.longitude !== undefined)
      formData.append("longitude", String(formValues.longitude));
    if (formValues.note) formData.append("note", formValues.note);

    // Upload file y tế
    for (const file of medicalDocuments) {
      formData.append("medicalDocuments", file);
    }

    const response = await instance.post("/blood-request", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};

export const getBloodRequestHistory = async (): Promise<any> => {
  try {
    const response = await instance.get("/blood-request/user");
    return response;
  } catch (err) {
    console.log("Error:",err);
  }
}

export const getBloodRequestHistoryDetail = async (id: string): Promise<any> => {
  try {
    const response = await instance.get(`/blood-request/user/${id}`);
    return response;
  } catch (err) {
    console.log("Error:",err);
  }
}