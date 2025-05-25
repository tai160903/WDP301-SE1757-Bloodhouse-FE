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
    console.log(data)
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
  }
};

