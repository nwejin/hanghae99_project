'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Settings, PawPrint, ImageIcon, Loader2, Calendar, Images, LogOut } from 'lucide-react';
import { PostType, PetType, getProfile } from '@/lib/profile';
import { useCurrentUser } from '@/lib/useCurrentUser';
import { userLogOut } from '@/lib/login';
import { useRouter } from 'next/navigation';
import DetailPage from '@/components/features/main/sections/detailPage';

export function Container() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { nickname: nicknameParam } = useParams();
  const currentUser = useCurrentUser();
  const router = useRouter();

  const [userData, setUserData] = useState({
    profile_image: '',
    bio: '',
    nickname: '',
  });
  const [petData, setPetData] = useState<PetType[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [selectedPost, setSelectedPost] = useState<{ post: any; user: any } | null>(null);

  const isOwnProfile = currentUser.nickname === userData.nickname;

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProfile(String(nicknameParam));
        if (data) {
          setUserData(data.user);
          setPetData(data.pets || []);
          setPosts(data.posts || []);
        }
      } catch {
        setError('프로필을 불러올 수 없습니다');
      } finally {
        setLoading(false);
      }
    }
    if (nicknameParam) fetchData();
  }, [nicknameParam]);

  // 날짜별 그룹핑
  const groupedPosts = useMemo(() => {
    if (!posts.length) return [];

    const groups: Record<string, PostType[]> = {};
    posts.forEach((post) => {
      const date = post.photoDate || post.created_at?.split('T')[0] || '날짜 없음';
      if (!groups[date]) groups[date] = [];
      groups[date].push(post);
    });

    const sortedKeys = Object.keys(groups).sort((a, b) => b.localeCompare(a));
    return sortedKeys.map((date) => ({ date, items: groups[date] }));
  }, [posts]);

  const handleLogout = async () => {
    try {
      await userLogOut();
      sessionStorage.removeItem('user');
      router.push('/login');
    } catch {
      setError('로그아웃에 실패했습니다');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-paw-orange" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-paw-sub">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 py-6">
        {/* 프로필 헤더 */}
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-paw-border bg-paw-cream-dark">
            {userData.profile_image ? (
              <img src={userData.profile_image} alt={userData.nickname} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-paw-sub">
                {userData.nickname?.charAt(0)}
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <h1 className="text-lg font-bold text-paw-brown">{userData.nickname}</h1>
            {isOwnProfile && (
              <Link href={`/accounts/${currentUser.userId}`} className="text-paw-sub transition-colors hover:text-paw-orange">
                <Settings size={18} />
              </Link>
            )}
          </div>

          {userData.bio && (
            <p className="mt-1 text-center text-sm text-paw-sub">{userData.bio}</p>
          )}

          {/* 로그아웃 버튼 (본인 프로필에서만) */}
          {isOwnProfile && (
            <button
              onClick={handleLogout}
              className="mt-3 flex items-center gap-1 rounded-full border border-paw-border px-3 py-1.5 text-xs text-paw-sub transition-colors hover:text-red-400"
            >
              <LogOut size={12} />
              로그아웃
            </button>
          )}
        </div>

        {/* 반려동물 카드 */}
        {petData.length > 0 && (
          <div className="mt-5 flex flex-col gap-2">
            {petData.map((pet) => (
              <div key={pet.id} className="flex items-center gap-3 rounded-2xl border border-paw-border bg-white px-4 py-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-paw-cream-dark">
                  {pet.pet_image ? (
                    <img src={pet.pet_image} alt={pet.petName} className="h-full w-full object-cover" />
                  ) : (
                    <PawPrint size={20} className="text-paw-orange" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-paw-brown">{pet.petName}</p>
                  <p className="text-xs text-paw-sub">
                    {pet.petSpecies}
                    {pet.petSubSpecies && ` · ${pet.petSubSpecies}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 게시물 수 */}
        <div className="mt-5 flex items-center gap-1.5 text-sm text-paw-sub">
          <ImageIcon size={14} />
          <span>게시물 {posts.length}개</span>
        </div>

        <div className="my-3 h-px bg-paw-border" />

        {/* 게시물 날짜별 그룹핑 그리드 */}
        {posts.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-paw-inactive">아직 게시물이 없어요</p>
          </div>
        ) : (
          <div>
            {groupedPosts.map((group) => (
              <div key={group.date} className="mb-4">
                <div className="flex items-center gap-1.5 py-2">
                  <Calendar size={13} className="text-paw-orange" />
                  <span className="text-xs font-semibold text-paw-brown">
                    {group.date === '날짜 없음' ? group.date : group.date.replace(/-/g, '.')}
                  </span>
                  <span className="text-[10px] text-paw-sub">({group.items.length})</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {group.items.map((post, index) => (
                    <button
                      key={post.id || index}
                      className="relative aspect-square overflow-hidden rounded-md border border-gray-100"
                      onClick={() =>
                        setSelectedPost({
                          post: {
                            ...post,
                            tags: post.tags || [],
                            photoDate: post.photoDate || '',
                          },
                          user: {
                            id: '',
                            email: '',
                            nickname: userData.nickname,
                            profile_image: userData.profile_image,
                          },
                        })
                      }
                    >
                      {post.imgUrls?.[0] ? (
                        <Image
                          src={post.imgUrls[0]}
                          fill
                          alt={`게시글 ${index + 1}`}
                          className="object-cover transition-transform duration-200 hover:scale-105"
                          sizes="(max-width: 576px) 33vw, 192px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-paw-cream-dark text-xs text-paw-inactive">
                          이미지 없음
                        </div>
                      )}
                      {post.imgUrls?.length > 1 && (
                        <div className="absolute right-1.5 top-1.5 rounded bg-black/40 p-0.5">
                          <Images size={14} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPost && (
        <DetailPage
          modal={() => setSelectedPost(null)}
          post={selectedPost.post}
          user={selectedPost.user}
        />
      )}
    </>
  );
}
