import { firestore } from '@/config/firebase';
import { collection, getDocs, query, orderBy, where, doc, getDoc } from 'firebase/firestore';

export interface Post {
  id: string;
  userId: string;
  contents: string;
  imgUrls: string[];
  created_at: string;
  likes: string[];
  comments: string[];
  status: boolean;
}

export interface User {
  id: string;
  email: string;
  nickname: string;
  profile_image: string;
  petName: string;
  pet_image: string;
}

export interface PostData {
  post: Post;
  user: User;
}

export async function getAllPost() {
  try {
    const postcollection = collection(firestore, 'posts');

    // 공개 상태에, 최근 데이터 순으로 가져오기
    const q = query(postcollection, where('status', '==', false), orderBy('created_at', 'desc'));

    const getPost = await getDocs(q);

    const posts: PostData[] = [];

    for (const postDoc of getPost.docs) {
      const postData = postDoc.data() as Post;
      const userRef = doc(firestore, 'users', postData.userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        posts.push({ post: { ...postData, id: postDoc.id }, user: userData });
      }
    }

    console.log(posts);
    return posts;
  } catch (error) {
    console.log('게시글 조회 에러', error);
    return [];
  }
}
