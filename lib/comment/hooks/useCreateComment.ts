import { ApiError } from '@/shared/api-error';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { CommentDataType } from '@/lib/comment';
import { useToast } from '@/components/ui/use-toast';
import { addComment } from '@/lib/comment';
import { COMMENT_KEY } from '@/lib/comment';

export const useCreatePost = (options: UseMutationOptions<void, ApiError, CommentDataType> = {}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, ApiError, CommentDataType>({
    mutationFn: addComment,
    onSuccess: (data, variable, ctx) => {
      toast({
        title: '댓글 작성이 완료되었습니다.',
      });
      queryClient.invalidateQueries({ queryKey: [COMMENT_KEY] });
      //   console.log('Invalidating queries...');
      //   console.log('Post Query Data:', queryClient.getQueryData([POST_KEY]));
      options.onSuccess?.(data, variable, ctx);
    },
    onError: (error) => {
      toast({
        title: `작성중 오류가 발생했습니다. ${error.message} `,
      });
      console.error('Failed to Create Post', error);
    },
  });
};
