import { createClient } from '@/config/supabase/server';
import { NextResponse } from 'next/server';

// 댓글 좋아요 추가
export async function POST(req: Request) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const { commentId } = await req.json();
    if (!commentId) {
      return NextResponse.json({ message: '댓글 정보 없음' }, { status: 400 });
    }

    const { error } = await supabase.from('comment_likes').upsert(
      { user_id: user.id, comment_id: commentId },
      { onConflict: 'user_id,comment_id' }
    );

    if (error) throw error;

    return NextResponse.json({ message: '댓글 좋아요 추가 완료' });
  } catch (error) {
    console.error('댓글 좋아요 추가 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}

// 댓글 좋아요 취소
export async function DELETE(req: Request) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const { commentId } = await req.json();
    if (!commentId) {
      return NextResponse.json({ message: '댓글 정보 없음' }, { status: 400 });
    }

    const { error } = await supabase
      .from('comment_likes')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ message: '댓글 좋아요 취소 완료' });
  } catch (error) {
    console.error('댓글 좋아요 취소 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}

// 댓글 좋아요 조회 (commentId 기준)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get('commentId');
    const userId = searchParams.get('userId');

    if (!commentId) {
      return NextResponse.json({ message: '댓글 정보 없음' }, { status: 400 });
    }

    const supabase = createClient();

    // 좋아요 수
    const { count, error: countError } = await supabase
      .from('comment_likes')
      .select('*', { count: 'exact', head: true })
      .eq('comment_id', commentId);

    if (countError) throw countError;

    // 특정 유저의 좋아요 상태
    let isLiked = false;
    if (userId) {
      const { data } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', userId)
        .maybeSingle();

      isLiked = !!data;
    }

    return NextResponse.json({ likeCount: count || 0, isLiked });
  } catch (error) {
    console.error('댓글 좋아요 조회 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}
