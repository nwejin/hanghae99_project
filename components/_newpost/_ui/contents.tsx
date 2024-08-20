import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from 'react-hook-form';

export default function Contents() {
  const { register } = useFormContext();
  return (
    <>
      <Textarea
        placeholder="내용을 입력하세요"
        rows={5}
        className="h-3/5 w-full resize-none"
        {...register('contents', { required: '내용을 입력하세요' })}
      />
    </>
  );
}
