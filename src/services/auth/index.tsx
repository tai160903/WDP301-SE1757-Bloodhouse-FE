import { instance } from "../instance";

interface LoginResponse {
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
}

interface LoginErrorResponse {
  error: true;
  message: string;
}

const login = async (
  emailOrPhone: string,
  password: string
): Promise<LoginResponse | LoginErrorResponse> => {
  try {
    const { data } = await instance.post<LoginResponse>(
      "/auth/sign-in",

      { emailOrPhone, password },
      { withCredentials: true }
    );
    return data;
  } catch (error: any) {
    console.error("Login error:", error?.response?.data || error.message);
    return {
      error: true,
      message: error?.response?.data?.message || "Login failed",
    };
  }
};

// Hàm register
const register = async (
  data: Record<string, any>
): Promise<AxiosResponse<RegisterResponse> | RegisterErrorResponse> => {
  try {
    const response = await instance.post<RegisterResponse>(
      "/api/auth/sign-up",
      data
    );
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
