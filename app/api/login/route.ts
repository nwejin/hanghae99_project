// import { auth } from 'firebase-admin';
import { auth } from '@/config/firebase_admin';
import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/config/firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
  deleteDoc,
  limit,
} from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const authorization = headers().get('Authorization');
    // console.log(authorization);

    if (authorization?.startsWith('Bearer ')) {
      const idToken = authorization.split('Bearer ')[1];
      const decodedToken = await auth.verifyIdToken(idToken);

      //   console.log(decodedToken);

      if (decodedToken) {
        const expiresIn = 60 * 60 * 24 * 1 * 1000;
        const sessionCookie = await auth.createSessionCookie(idToken, {
          expiresIn,
        });
        // console.log('authorization', authorization);
        // console.log('Session Cookie:', sessionCookie);

        const options = {
          path: '/',
          name: 'session',
          value: sessionCookie,
          // maxAge: expiresIn / 1000,
          httpOnly: true,
          secure: true,
        };

        const response = NextResponse.json({ isLogged: true }, { status: 200 });

        response.cookies.set(options);
        return response;
      }
    }
    return NextResponse.json({ isLogged: false }, { status: 401 });
  } catch (error) {
    console.error('로그인 처리 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = cookies().get('session')?.value || '';

    if (!session) {
      return NextResponse.json({ isLogged: false }, { status: 401 });
    }

    const decodedClaims = await auth.verifySessionCookie(session, true);

    if (!decodedClaims) {
      return NextResponse.json({ isLogged: false }, { status: 401 });
    }

    const userDocRef = doc(firestore, 'users', decodedClaims.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return NextResponse.json({ isLogged: false, message: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();

    // 유저의 pet 정보 가져오기 (서브컬렉션)
    const petsRef = collection(userDocRef, 'pets');
    const petsSnapshot = await getDocs(petsRef);
    const pets = petsSnapshot.docs.map((doc) => doc.data());

    const responseUser = {
      isLogged: true,
      userId: decodedClaims.uid,
      email: userData?.email || null,
      nickName: userData?.nickname || null,
      profileImg: userData?.profile_image || null,
      petInfo: pets.length > 0 ? pets[0] : null,
    };

    return NextResponse.json(responseUser, { status: 200 });
  } catch (error) {
    console.error('세션 검증 에러:', error);
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }
}
