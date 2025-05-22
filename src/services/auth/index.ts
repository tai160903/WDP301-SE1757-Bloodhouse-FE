import { instance } from "../instance";

// Định nghĩa kiểu dữ liệu trả về thành công
interface LoginResponse extends IResponse.Response {
  data: {
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
    user: {
      _id: string;
      email: string;
      full_name: string;
      avatar: string;
      role: string;
    };
  };
}

const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const { data } = await instance.post<LoginResponse>(
      "/auth/sign-in",
      { email, password },
      { withCredentials: true }
    );
    return data;  
  } catch (error: any) {
    throw new Error(error?.response?.message || "Login failed");
  }
};

// Hàm đăng ký
const register = async (
  data: Record<string, any>
): Promise<AxiosResponse<RegisterResponse> | RegisterErrorResponse> => {
  try {
    const response = await instance.post<RegisterResponse>("/api/auth/register", data);
    return response;
  } catch (error: any) {
    console.log("Register error", error);
    return {
      error: true,
      message: error.response?.data?.message || "Registration failed",
    };
  }
};

export { login, register };
