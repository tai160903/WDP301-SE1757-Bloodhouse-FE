import { instance } from "../instance";

interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Author {
  _id: string;
  fullName: string;
  avatar: string;
}

interface Blog {
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
}

interface BlogResponse extends IResponse.Response {
  data: Blog[];
}

export const getAll = async (): Promise<BlogResponse> => {
  try {
    const { data } = await instance.get<BlogResponse>("/content");
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};

export const getById = async (id: string): Promise<BlogResponse> => {
  try {
    const { data } = await instance.get<BlogResponse>(`/content/${id}`);
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};

export const create = async (data: Blog): Promise<BlogResponse> => {
  try {
    const response = await instance.post<BlogResponse>("/content", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};

export const update = async (id: string, data: Blog): Promise<BlogResponse> => {
  try {
    const response = await instance.put<BlogResponse>(`/content/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
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


