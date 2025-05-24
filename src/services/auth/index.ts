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
    throw new Error(error?.response?.message || "Login failed");
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
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};


export { login, register };
