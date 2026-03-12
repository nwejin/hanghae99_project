import { createClient } from '@/config/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// 좋아요
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

    const { error } = await supabase.from('likes').upsert(
      {
        user_id: userId,
        post_id: postId,
      },
      { onConflict: 'post_id,user_id' }
    );

    if (error) throw error;

    return NextResponse.json({ message: '좋아요 추가 완료' });
  } catch (error) {
    console.error('좋아요 추가 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}

// 좋아요 취소
export async function DELETE(req: Request) {
  try {
    const { postId, userId } = await req.json();

    if (!postId) {
      return NextResponse.json({ message: '게시글 정보 없음' }, { status: 400 });
    } else if (!userId) {
      return NextResponse.json({ message: '유저 정보 없음' }, { status: 400 });
    }

    const supabase = createClient();

    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) throw error;

    return NextResponse.json({ message: '좋아요 취소 완료' });
  } catch (error) {
    console.error('좋아요 취소 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}

// 좋아요 확인
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');
    const userId = searchParams.get('userId');

    if (!postId) {
      return NextResponse.json({ message: '게시글 정보 없음' }, { status: 400 });
    }

    const supabase = createClient();

    // 특정 유저의 좋아요 상태 확인
    if (userId) {
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      return NextResponse.json({ isLiked: !!data });
    } else {
      // 좋아요 수 + 최근 유저
      const { count, error: countError } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      if (countError) throw countError;

      // 최근 좋아요 유저
      const { data: recentLike } = await supabase
        .from('likes')
        .select('user_id')
        .eq('post_id', postId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      return NextResponse.json({
        likeCount: count || 0,
        recentUser: recentLike?.user_id || null,
      });
    }
  } catch (error) {
    console.error('좋아요 확인/데이터 가져오기 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}
