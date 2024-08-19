import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/config/firebase';

// Firestore에서 사용자 닉네임을 가져오는 함수
export async function getUserNickname(uid: string): Promise<string | null> {
  try {
    const userDoc = doc(firestore, 'users', uid);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
      return docSnap.data().nickname || null;
    } else {
      console.error('사용자 문서가 존재하지 않습니다.');
      return null;
    }
  } catch (error) {
    console.error('Firestore에서 사용자 닉네임을 가져오는 중 오류 발생:', error);
    return null;
  }
}
