import { instance } from "../instance";

interface LoginResponse extends IResponse.Response {
  data: {
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
    user: {
      _id: string;
      email: string;
      role: string;
    };
  };
}

interface RegisterResponse extends IResponse.Response {
  data: {
    user: {
      _id: string;
      fullName: string;
      email: string;
      role: string;
    };
  };
}

// Đổi tên interface để không trùng với hàm
interface ForgotPasswordResponse extends IResponse.Response<null> {}

const login = async (
  emailOrPhone: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const { data } = await instance.post<LoginResponse>(
      "/auth/sign-in",
      { emailOrPhone, password },
      { withCredentials: true }
    );
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Login failed");
  }
};

const register = async (
  data: Record<string, any>
): Promise<RegisterResponse> => {
  try {
    const { data: responseData } = await instance.post<RegisterResponse>(
      "/auth/sign-up",
      data
    );
    return responseData;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Registration failed");
  }
};

const forgotPassword = async (email: string): Promise<ForgotPasswordResponse> => {
  try {
    const { data } = await instance.post("/user/forgot-password", { email });
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Gửi yêu cầu thất bại");
  }
};

export { login, register, forgotPassword };
