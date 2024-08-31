import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getComment, COMMENT_KEY } from '@/lib/comment';
import { CommentType } from '@/lib/comment';
import { ApiError } from '@/shared/api-error';

export const useGetComment = (postId: string, options?: UseQueryOptions<CommentType[], ApiError>) => {
  return useQuery<CommentType[], ApiError>({
    queryKey: [COMMENT_KEY],
    queryFn: () => getComment(postId),
    ...options,
  });
};
