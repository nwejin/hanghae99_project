// import { collection, doc, getDocs } from 'firebase/firestore';
// import { firestore } from '@/config/firebase';

// // Firestore에서 모든 사용자 닉네임을 가져오는 함수 (미들웨어 사용)
// export async function getAllUser(): Promise<string[]> {
//   try {
//     const allusers = await getDocs(collection(firestore, 'users'));
//     const nicknames: string[] = [];

//     allusers.forEach((doc) => {
//       const data = doc.data();
//       if (data.nickname) {
//         nicknames.push(data.nickname);
//       }
//     });
//     // console.log(nicknames);
//     return nicknames;
//   } catch (error) {
//     console.error('Firestore에서 전체 사용자를 불러오는 중 오류 발생:', error);
//     return [];
//   }
// }
