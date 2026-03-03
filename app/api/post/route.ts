import { NextResponse } from 'next/server';
import { createClient } from '@/config/supabase/server';

// 게시글 데이터 불러오기
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '5', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);

    const supabase = createClient();

    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize - 1;

    // JOIN으로 유저 정보를 한 번에 가져오기 (N+1 문제 해결)
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*, users(id, email, nickname, profile_image)')
      .order('created_at', { ascending: false })
      .range(startIndex, endIndex);

    if (error) throw error;

    const totalPostData = (posts || []).map((post) => ({
      post: {
        id: post.id,
        userId: post.user_id,
        contents: post.contents,
        imgUrls: post.img_urls,
        tags: post.tags,
        created_at: post.created_at,
        photoDate: post.photo_date,
      },
      user: {
        id: post.users.id,
        email: post.users.email,
        nickname: post.users.nickname,
        profile_image: post.users.profile_image,
      },
    }));

    return NextResponse.json(totalPostData);
  } catch (error) {
    console.error('게시글 조회 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}

// 게시글 데이터 추가
export async function POST(req: Request) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const data = await req.json();

    const { data: postData, error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        contents: data.contents || '',
        img_urls: data.imgUrls,
        tags: data.tags,
        photo_date: data.photoDate || null,
      })
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({ message: '게시글 작성 완료!, id:' + postData.id });
  } catch (error) {
    console.error('게시글 추가 에러', error);
    return NextResponse.error();
  }
}

// 게시글 삭제
export async function DELETE(req: Request) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const { postId } = await req.json();

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;

    return NextResponse.json({ message: '게시글 삭제 완료!' }, { status: 200 });
  } catch (error) {
    console.error('게시글 삭제 에러', error);
    return NextResponse.error();
  }
}

// 게시글 수정
export async function PUT(req: Request) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const { postId, contents } = await req.json();

    const { error } = await supabase
      .from('posts')
      .update({ contents })
      .eq('id', postId);

    if (error) throw error;

    return NextResponse.json({ message: '게시글 수정 완료!' }, { status: 200 });
  } catch (error) {
    console.error('게시글 수정 에러', error);
    return NextResponse.error();
  }
}
