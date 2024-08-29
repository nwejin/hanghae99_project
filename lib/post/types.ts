import { number } from 'zod';

export type PostType = {
  id: string;
  userId: string;
  contents: string;
  imgUrls: string[];
  created_at: string;
  status: boolean;
};

export type UserType = {
  id: string;
  email: string;
  nickname: string;
  profile_image: string;
};

export type TotalPostType = {
  post: PostType;
  user: UserType;
};

export type PostFormData = {
  userId: string;
  contents: string;
  imgUrls: string[];
  created_at: string;
  status: boolean;
};

export type PostIdType = string;

export type PaginationType = {
  page: number;
  size: number;
};
