export type PostType = {
  id: string;
  userId: string;
  contents: string;
  tags: string[];
  imgUrls: string[];
  created_at: string;
  photoDate: string;
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
  tags: string[];
  imgUrls: string[];
  created_at: string;
  photoDate: string;
};

export type PostIdType = string;

export type PaginationType = {
  page: number;
  size: number;
};

export type EditType = {
  id: string;
  contents: string;
};
