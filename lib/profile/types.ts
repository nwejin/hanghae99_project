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
  bio: string;
  email: string;
  nickname: string;
  profile_image: string;
};

export type PetType = {
  id: string;
  petName: string;
  petSpecies: string;
  petSubSpecies: string;
  pet_image: string;
};

export type TotalProfileType = {
  pets: PetType[];
  user: UserType;
  posts: PostType[];
};
