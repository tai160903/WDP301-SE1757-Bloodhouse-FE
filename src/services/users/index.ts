import { instance } from "@/services/instance";

export interface userProfiles extends IResponse.Response  {
    data: {
        _id: string;
        fullName?: string;
        email: string;
        phone?: string;
        street?: string;
        city?: string;
        country?: string;
        location: {
            type: string;
            coordinates: number[]
        }
        sex?: string;
        yob?: Date;
        bloodId?: {
            type: string;
        }
        avatar: string;
        isAvailable: boolean;
        isVerified: boolean;
        status: string;
    }
}

const getUserProfile = async (): Promise<userProfiles> => {
    try{
        const {data} = await instance.get<userProfiles>("/user/me");
        return data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
    }
}

export { getUserProfile };