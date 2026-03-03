import { createClient } from '@/config/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchTerm = url.searchParams.get('searchTerm');

    if (!searchTerm) {
      return NextResponse.json({ error: '검색어 필요' }, { status: 400 });
    }

    const supabase = createClient();

    // ILIKE로 부분 일치 검색 (기존 Unicode range 대체)
    const { data: usersData, error } = await supabase
      .from('users')
      .select('*')
      .ilike('nickname', `${searchTerm}%`);

    if (error) throw error;

    if (!usersData || usersData.length === 0) {
      return NextResponse.json({ error: '유저 정보가 없습니다.' }, { status: 404 });
    }

    return NextResponse.json(usersData, { status: 200 });
  } catch (error) {
    console.error('데이터 조회 오류:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
