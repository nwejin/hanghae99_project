import { z } from 'zod';

// 비밀번호 복잡성 체크
const verifyPassword = (password: string) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // 최소 8자리 이상이고, 4가지 중 3가지 이상의 문자 조합
  return password.length >= 8 && [hasUpperCase, hasLowerCase, hasDigit, hasSpecialChar].filter(Boolean).length >= 3;
};

export const userSchema = z
  .object({
    // start
    user_id: z
      .string()
      .min(4, { message: '아이디는 4자리 이상이어야 합니다' })
      .max(20, { message: '아이디는 20자리 이하로 입력해주세요' })
      .regex(/^[a-zA-Z0-9]+$/, { message: '아이디는 영어와 숫자만 입력 가능합니다' }),
    user_pw: z
      .string()
      .min(8, { message: '비밀번호는 8자리 이상이어야합니다' })
      .refine(verifyPassword, { message: '대문자, 소문자, 숫자, 특수문자 중 3종류 이상을 포함해야 합니다' }),
    password_verify: z.string().min(8, { message: '동일한 비밀번호를 입력해주세요' }),
  })
  .refine((data) => data.user_pw === data.password_verify, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['password_verify'],
  });


export const midSchema = z.object({
  // mid
  nickname: z
    .string()
    .min(2, { message: '닉네임은 2자리 이상으로 입력해주세요' })
    .max(10, { message: '닉네임은 10자리 이하로 입력해주세요' }),
});

export const loginSchema = z.object({
  user_id: z.string().min(4, { message: '아이디를 입력해주세요' }),
  user_password: z.string().min(8, { message: '비밀번호는 8자 이상입니다.' }),
});
