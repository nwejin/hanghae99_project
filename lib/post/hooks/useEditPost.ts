import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { editPost } from '@/lib/post';
import { EditType } from '@/lib/post';
import { ApiError } from '@/shared/api-error';
import { POST_KEY } from '@/lib/post';
import { useToast } from '@/components/common/ui/use-toast';

export const useEditPost = (options: UseMutationOptions<void, ApiError, EditType> = {}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, ApiError, EditType>({
    mutationFn: editPost,
    onSuccess: (data, variable, ctx) => {
      toast({
        title: '게시글 수정이 완료되었습니다.',
      });
      queryClient.invalidateQueries({ queryKey: [POST_KEY] });
      options.onSuccess?.(data, variable, ctx);
    },
    onError: (error) => {
      toast({
        title: '수정 중 오류가 발생했습니다. 다시 한번 시도해주세요!',
      });
      console.error(error);
    },
  });
};
