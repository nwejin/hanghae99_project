import { createClient } from '@/config/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();

    // board 목록 조회
    const { data: boards, error } = await supabase
      .from('board')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // user_id 목록으로 유저 정보 일괄 조회
    const userIds = [...new Set((boards || []).map((b) => b.user_id))];
    const { data: users } = await supabase
      .from('users')
      .select('id, nickname, profile_image')
      .in('id', userIds);

    const userMap = new Map((users || []).map((u) => [u.id, u]));

    const boardList = (boards || []).map((board) => {
      const user = userMap.get(board.user_id);
      return {
        id: board.id,
        userId: board.user_id,
        content: board.content,
        created_at: board.created_at,
        user: user
          ? { nickname: user.nickname, profileImage: user.profile_image }
          : null,
      };
    });

    return NextResponse.json(boardList, { status: 200 });
  } catch (error) {
    console.error('게시판 조회 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const { content } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ message: '내용을 입력해주세요.' }, { status: 400 });
    }

    const { error } = await supabase.from('board').insert({
      user_id: user.id,
      content: content.trim(),
    });

    if (error) throw error;

    return NextResponse.json({ message: '게시판 글 추가 완료' }, { status: 200 });
  } catch (error) {
    console.error('게시판 글 추가 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const { boardId, isAdmin } = await req.json();

    if (!boardId) {
      return NextResponse.json({ message: 'boardId가 필요합니다.' }, { status: 400 });
    }

    // admin은 모든 글 삭제 가능, 일반 사용자는 본인 글만
    let query = supabase.from('board').delete().eq('id', boardId);

    if (!isAdmin) {
      query = query.eq('user_id', user.id);
    }

    const { error } = await query;

    if (error) throw error;

    return NextResponse.json({ message: '게시판 글 삭제 완료' }, { status: 200 });
  } catch (error) {
    console.error('게시판 글 삭제 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}
