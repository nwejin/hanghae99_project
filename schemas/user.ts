import { z } from 'zod';

export const userSchema = z.object({
  userId: z
    .string()
    .min(2, { message: '아이디는 2자리 이상으로 입력해주세요' })
    .max(10, { message: '아이디는 10자리 이하로 입력해주세요' }),
  email: z.string().email({ message: '유효한 형식으로 입력해주세요' }).min(1, { message: '이메일을 입력해주세요' }),
  password: z.string().min(8, '비밀번호는 8자리 이상이어야합니다'),
});
