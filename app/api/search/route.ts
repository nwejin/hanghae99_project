import { createClient } from '@/config/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchTerm = url.searchParams.get('searchTerm');
    const type = url.searchParams.get('type') || 'nickname';

    if (!searchTerm) {
      return NextResponse.json({ error: '검색어 필요' }, { status: 400 });
    }

    const supabase = createClient();

    // 태그 검색
    if (type === 'tag') {
      const { data: postsData, error } = await supabase
        .from('posts')
        .select('*, users!inner(id, email, nickname, profile_image)')
        .contains('tags', [searchTerm])
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!postsData || postsData.length === 0) {
        return NextResponse.json([], { status: 200 });
      }

      const results = postsData.map((post) => ({
        post: {
          id: post.id,
          userId: post.user_id,
          contents: post.contents,
          imgUrls: post.img_urls || [],
          tags: post.tags || [],
          photoDate: post.photo_date || '',
          created_at: post.created_at,
        },
        user: {
          id: (post.users as any).id,
          email: (post.users as any).email,
          nickname: (post.users as any).nickname,
          profile_image: (post.users as any).profile_image,
        },
      }));

      return NextResponse.json(results, { status: 200 });
    }

    // 닉네임 검색
    const { data: usersData, error } = await supabase
      .from('users')
      .select('*')
      .ilike('nickname', `%${searchTerm}%`);

    if (error) throw error;

    return NextResponse.json(usersData || [], { status: 200 });
  } catch (error) {
    console.error('데이터 조회 오류:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
