import { instance } from "../instance";


export interface IResponse {
  success: boolean;
  message: string;
}

export interface Category {
  _id?: string;
  name: string;
  description?: string;
}

export interface Author {
  _id?: string;
  fullName: string;
  avatar?: string;
}

export interface Blog {
  _id: string;
  type: string;
  categoryId: Category;
  title: string;
  image: string;
  content: string;
  summary: string;
  authorId: Author;
  status: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
  tags: string[];
  featured?: boolean;
}

export interface userProfiles extends IResponse {
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
      coordinates: number[];
    };
    sex?: string;
    yob?: Date;
    bloodId?: {
      type: string;
    };
    avatar: string;
    isAvailable: boolean;
    isVerified: boolean;
    status: string;
  };
}

export interface BlogFormData {
  title: string;
  summary: string;
  content: string;
  tags: string[];
  categoryId: string; // Changed to string for FormData
  authorId: string; // Changed to string for FormData
  status: string;
  featured?: boolean;
  image?: string;
  type?: string;
}

export interface BlogResponse extends IResponse {
  data: Blog | Blog[];
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await instance.get<Category[]>("/content-category");
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi lấy danh mục.");
  }
};

export const getAuthors = async (): Promise<userProfiles> => {
  try {
    const { data } = await instance.get<userProfiles>("/user/me");
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};

export const getAll = async (): Promise<BlogResponse> => {
  try {
    const { data } = await instance.get<BlogResponse>("/content");
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi lấy danh sách blog.");
  }
};

export const getById = async (id: string): Promise<BlogResponse> => {
  try {
    const { data } = await instance.get<BlogResponse>(`/content/${id}`);
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi lấy chi tiết blog.");
  }
};

export const create = async (formData: FormData): Promise<BlogResponse> => {
  try {
    const response = await instance.post<BlogResponse>("/content", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.message);
  }
};

export const update = async (id: string, formData: FormData): Promise<BlogResponse> => {
  try {
    const response = await instance.put<BlogResponse>(`/content/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi cập nhật blog.");
  }
};

export const getBlogs = async (params: any): Promise<any> => {
  try {
    const { data } = await instance.get<any>(`/content`, { params });
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};


export const deleteBlog = async (id: string): Promise<BlogResponse> => {
  try {
    const response = await instance.delete<BlogResponse>(`/content/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi xóa blog.");
  }
};