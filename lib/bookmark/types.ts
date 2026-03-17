export type BookmarkAuthType = {
  postId: string;
};

export type BookmarkStatusType = {
  isBookmarked: boolean;
};

export type BookmarkPostType = {
  post: {
    id: string;
    userId: string;
    contents: string;
    imgUrls: string[];
    tags: string[];
    created_at: string;
    photoDate: string;
  };
  user: {
    id: string;
    email: string;
    nickname: string;
    profile_image: string;
  };
};
