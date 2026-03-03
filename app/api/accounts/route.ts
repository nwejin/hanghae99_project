import { createClient } from '@/config/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    const supabase = createClient();

    // 유저 정보 + 펫 정보를 한 번에 조회
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*, pets(*)')
      .eq('id', String(userId))
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { pets, ...user } = userData;

    return NextResponse.json(
      {
        user,
        pets: pets || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
