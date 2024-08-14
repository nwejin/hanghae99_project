import { z } from 'zod';

// 비밀번호 형태
// const patterns = [
//     '1234', 'abcd', 'qwerty', '1111', '0000'
// ]

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
    userId: z
      .string()
      .min(2, { message: '아이디는 2자리 이상으로 입력해주세요' })
      .max(10, { message: '아이디는 10자리 이하로 입력해주세요' }),
    email: z.string().email({ message: '유효한 형식으로 입력해주세요' }).min(1, { message: '이메일을 입력해주세요' }),
    password: z
      .string()
      .min(8, { message: '비밀번호는 8자리 이상이어야합니다' })
      .refine(verifyPassword, { message: '대문자, 소문자, 숫자, 특수문자 중 3종류 이상을 포함해야 합니다' }),
    password_verify: z.string().min(8, { message: '동일한 비밀번호를 입력해주세요' }),
  })
  .refine((data) => data.password === data.password_verify, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['password_verify'],
  });

const defaultImg = '/dog.png';

export const midSchema = z.object({
  // mid
  // profile_image: z.string().optional(),
  name: z.string().min(1, { message: '이름을 입력해주세요' }),
  bio: z.string().max(30, { message: '자기소개는 30자 이하로 입력해주세요' }).optional(),
});

export const endSchema = z.object({
  //end
  // pet_image: z.string().optional(),
  petName: z.string().min(1, { message: '반려동물 이름을 입력해주세요' }),
  petSpecies: z.string().min(1, { message: '반려동물의 종을 입력해주세요' }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: '유효한 이메일 주소를 입력해 주세요' }),
  password: z.string().min(8, { message: '비밀번호는 8자 이상입니다.' }),
});
