import { TotalProfileType } from './types';
export async function getProfile(nicknameParam: string): Promise<TotalProfileType> {
  try {
    const response = await fetch(`/api/profile?nickname=${nicknameParam}`);
    if (!response.ok) {
      throw new Error('fetch 오류');
    }
    const data: TotalProfileType = await response.json();

    return data;
  } catch (error) {
    console.log('프로필 정보 fetch 오류', error);
    throw error;
  }
}
