import { createClient } from '@/config/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const nickname = url.searchParams.get('nickname');

    if (!nickname) {
      return NextResponse.json({ error: '닉네임 필요' }, { status: 400 });
    }

    const supabase = createClient();

    // 유저 정보 조회
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('nickname', nickname)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: '유저 정보가 없습니다.' }, { status: 404 });
    }

    // 유저의 게시물 조회
    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userData.id)
      .order('created_at', { ascending: false });

    return NextResponse.json(
      {
        user: userData,
        posts: (postsData || []).map((post) => ({
          id: post.id,
          userId: post.user_id,
          contents: post.contents,
          imgUrls: post.img_urls,
          tags: post.tags || [],
          photoDate: post.photo_date || '',
          created_at: post.created_at,
          status: true,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('데이터 조회 오류:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
