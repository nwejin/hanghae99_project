import { NextResponse } from 'next/server';
import { firestore } from '@/config/firebase';
import { collection, getDocs, query, orderBy, where, doc, getDoc, addDoc } from 'firebase/firestore';
import { PostType, UserType, TotalPostType, PostFormData } from '@/lib/post';

// 게시글 데이터 불러오기
export async function GET() {
  try {
    const fbCollection = collection(firestore, 'posts');
    // 공개, 최신순 데이터 조회
    const q = query(fbCollection, where('status', '==', false), orderBy('created_at', 'desc'));

    const getPost = await getDocs(q);

    const totalPostData: TotalPostType[] = [];

    // 유저 uid로 유저 정보 가져오기
    for (const postDoc of getPost.docs) {
      const postData = postDoc.data() as PostType;
      const userRef = doc(firestore, 'users', postData.userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as UserType;
        totalPostData.push({ post: { ...postData, id: postDoc.id }, user: userData });
      }
    }

    return NextResponse.json(totalPostData);
  } catch (error) {
    console.error('게시글 조회 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}

// 게시글 데이터 저장하기
export async function POST(req: Request) {
  try {
    const data: PostFormData = await req.json();

    const docRef = await addDoc(collection(firestore, 'posts'), data);

    return NextResponse.json({ message: '게시글 작성 완료!, id:' + docRef.id });
  } catch (error) {
    console.error('게시글 추가 에러', error);
    return NextResponse.error();
  }
}
