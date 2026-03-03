import { createClient } from '@/config/supabase/client';

export interface Like {
  userId: string;
  postId: string;
  created_at: string;
}

// 좋아요
export async function addLike(postId: string, userId: string | null) {
  if (!userId) return;

  const supabase = createClient();
  await supabase.from('likes').upsert(
    { user_id: userId, post_id: postId },
    { onConflict: 'post_id,user_id' }
  );
}

// 취소
export async function removeLike(postId: string, userId: string | null) {
  if (!userId) return;

  const supabase = createClient();
  await supabase
    .from('likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', userId);
}

// 로그인 유저 좋아요 확인
export async function isLiked(postId: string, userId: string | null): Promise<boolean> {
  if (!userId) return false;

  const supabase = createClient();
  const { data } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle();

  return !!data;
}

// 좋아요 데이터 가져오기
interface LikeData {
  recentUser: string | null;
  likeCount: number;
}

export async function fetchLikeData(postId: string): Promise<LikeData> {
  const supabase = createClient();

  // 좋아요 수
  const { count } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);

  // 최근 좋아요 유저
  const { data: recentLike } = await supabase
    .from('likes')
    .select('user_id')
    .eq('post_id', postId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    recentUser: recentLike?.user_id || null,
    likeCount: count || 0,
  };
}
