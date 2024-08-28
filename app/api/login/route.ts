import { auth } from 'firebase-admin';
import { customInitApp } from '@/config/firebase_admin';
import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Value } from '@radix-ui/react-select';

customInitApp();

export async function POST(req: Request) {
  try {
    const authorization = headers().get('Authorization');
    // console.log(authorization)

    if (authorization?.startsWith('Bearer ')) {
      const idToken = authorization.split('Bearer ')[1];
      const decodedToken = await auth().verifyIdToken(idToken);

      //   console.log(decodedToken);

      if (decodedToken) {
        const expiresIn = 60 * 60 * 24 * 1 * 1000;
        const sessionCookie = await auth().createSessionCookie(idToken, {
          expiresIn,
        });
        // console.log('authorization', authorization);
        // console.log('Session Cookie:', sessionCookie);

        const options = {
          name: 'session',
          value: sessionCookie,
          maxAge: expiresIn / 1000,
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

    const decodedClaims = await auth().verifySessionCookie(session, true);

    if (!decodedClaims) {
      return NextResponse.json({ isLogged: false }, { status: 401 });
    }

    return NextResponse.json({ isLogged: true }, { status: 200 });
  } catch (error) {
    console.error('세션 검증 에러:', error);
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }
}
