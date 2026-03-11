import { createClient } from '@/config/supabase/server';
import { NextResponse } from 'next/server';

// 알림 생성
export async function POST(req: Request) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const { userId, type, postId, commentId } = await req.json();

    // 자기 자신에게는 알림 보내지 않음
    if (userId === user.id) {
      return NextResponse.json({ message: '본인 알림 스킵' });
    }

    const { error } = await supabase.from('notifications').insert({
      user_id: userId,
      actor_id: user.id,
      type,
      post_id: postId || null,
      comment_id: commentId || null,
    });

    if (error) throw error;

    return NextResponse.json({ message: '알림 생성 완료' });
  } catch (error) {
    console.error('알림 생성 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}

// 내 알림 조회
export async function GET() {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    // 알림 목록 조회
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) throw error;

    // actor_id들로 유저 정보 일괄 조회
    const actorIds = Array.from(new Set((notifications || []).map((n) => n.actor_id)));
    let actorMap: Record<string, { nickname: string; profile_image: string | null }> = {};

    if (actorIds.length > 0) {
      const { data: actors } = await supabase
        .from('users')
        .select('id, nickname, profile_image')
        .in('id', actorIds);

      if (actors) {
        actorMap = Object.fromEntries(
          actors.map((a) => [a.id, { nickname: a.nickname, profile_image: a.profile_image }])
        );
      }
    }

    // 알림에 actor 정보 합치기
    const notificationsWithActor = (notifications || []).map((n) => ({
      ...n,
      actor: actorMap[n.actor_id] || { nickname: '알 수 없음', profile_image: null },
    }));

    // 읽지 않은 알림 수
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    return NextResponse.json({
      notifications: notificationsWithActor,
      unreadCount: count || 0,
    });
  } catch (error) {
    console.error('알림 조회 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}

// 알림 읽음 처리
export async function PATCH() {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) throw error;

    return NextResponse.json({ message: '알림 읽음 처리 완료' });
  } catch (error) {
    console.error('알림 읽음 처리 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}
