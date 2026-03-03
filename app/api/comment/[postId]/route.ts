import { createClient } from '@/config/supabase/server';
import { NextResponse } from 'next/server';
import { CommentDataType } from '@/lib/comment';

export async function GET(req: Request, { params }: { params: { postId: string } }) {
  try {
    const { postId } = params;

    if (!postId) {
      return NextResponse.json({ message: 'postId가 필요합니다.' }, { status: 400 });
    }

    const supabase = createClient();

    // 댓글 + 유저 정보 JOIN
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*, users(nickname, profile_image)')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const commentsWithUserData = (comments || []).map((comment) => ({
      id: comment.id,
      userId: comment.user_id,
      postId: comment.post_id,
      comment: comment.comment,
      created_at: comment.created_at,
      user: comment.users
        ? {
            profileImage: comment.users.profile_image,
            nickname: comment.users.nickname,
          }
        : null,
    }));

    return NextResponse.json(commentsWithUserData, { status: 200 });
  } catch (error) {
    console.error('댓글 조회 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { postId: string } }) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const data: CommentDataType = await req.json();

    const { error } = await supabase.from('comments').insert({
      user_id: user.id,
      post_id: data.postId,
      comment: data.comment,
    });

    if (error) throw error;

    return NextResponse.json({ message: '댓글 추가 완료' }, { status: 200 });
  } catch (error) {
    console.error('댓글 추가 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}
