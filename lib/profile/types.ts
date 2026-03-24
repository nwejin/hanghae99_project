export type PostType = {
  id: string;
  userId: string;
  contents: string;
  imgUrls: string[];
  tags: string[];
  photoDate: string;
  created_at: string;
  status: boolean;
};

export type UserType = {
  id: string;
  bio: string;
  email: string;
  nickname: string;
  profile_image: string;
};

export type TotalProfileType = {
  user: UserType;
  posts: PostType[];
};
