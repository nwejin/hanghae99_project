import { ApiError } from '@/shared/api-error';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { DeleteCommentType } from '@/lib/comment';
import { useToast } from '@/components/common';
import { deleteComment } from '@/lib/comment';
import { COMMENT_KEY } from '@/lib/comment';

export const useDeleteComment = (options: UseMutationOptions<void, ApiError, DeleteCommentType> = {}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, ApiError, DeleteCommentType>({
    mutationFn: deleteComment,
    onSuccess: (data, variable, ctx) => {
      toast({
        title: '댓글이 삭제되었습니다.',
      });
      queryClient.invalidateQueries({ queryKey: [COMMENT_KEY] });
      options.onSuccess?.(data, variable, ctx);
    },
    onError: (error) => {
      toast({
        title: `삭제중 오류가 발생했습니다. ${error.message} `,
      });
      console.error('Failed to Delete Comment', error);
    },
  });
};
