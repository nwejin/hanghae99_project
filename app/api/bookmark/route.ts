import { createClient } from '@/config/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// 북마크 추가
export async function POST(req: Request) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const { postId } = await req.json();
    const userId = user.id;

    if (!postId) {
      return NextResponse.json({ message: '게시글 정보 없음' }, { status: 400 });
    }

    const { error } = await supabase.from('bookmarks').upsert(
      {
        user_id: userId,
        post_id: postId,
      },
      { onConflict: 'post_id,user_id' }
    );

    if (error) throw error;

    return NextResponse.json({ message: '북마크 추가 완료' });
  } catch (error) {
    console.error('북마크 추가 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}

// 북마크 취소
export async function DELETE(req: Request) {
  try {
    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json({ message: '게시글 정보 없음' }, { status: 400 });
    }

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ message: '북마크 취소 완료' });
  } catch (error) {
    console.error('북마크 취소 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}

// 북마크 확인 / 북마크 목록 조회
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');
    const userId = searchParams.get('userId');

    const supabase = createClient();

    // 특정 게시글의 북마크 여부 확인
    if (postId && userId) {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      return NextResponse.json({ isBookmarked: !!data });
    }

    // 유저의 북마크 게시글 목록 조회
    if (userId) {
      const { data: bookmarks, error: bmError } = await supabase
        .from('bookmarks')
        .select('post_id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (bmError) throw bmError;

      if (!bookmarks || bookmarks.length === 0) {
        return NextResponse.json({ posts: [] });
      }

      const postIds = bookmarks.map((b) => b.post_id);

      const { data: posts, error: postError } = await supabase
        .from('posts')
        .select('*, users(id, email, nickname, profile_image)')
        .in('id', postIds);

      if (postError) throw postError;

      // 북마크 순서 유지 (최신 북마크 순)
      const postMap = new Map((posts || []).map((p) => [p.id, p]));
      const orderedPosts = postIds
        .map((id) => postMap.get(id))
        .filter(Boolean)
        .map((post: any) => ({
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

      return NextResponse.json({ posts: orderedPosts });
    }

    return NextResponse.json({ message: '필수 정보 없음' }, { status: 400 });
  } catch (error) {
    console.error('북마크 확인 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}
