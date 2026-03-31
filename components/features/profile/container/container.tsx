'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { BLUR_DATA_URL } from '@/shared/imageConstants';
import Link from 'next/link';
import { Settings, ImageIcon, Calendar, Images, LogOut, Bookmark } from 'lucide-react';
import { ProfileSkeleton } from '@/components/common';
import { PostType, getProfile } from '@/lib/profile';
import { getBookmarkPosts, BookmarkPostType } from '@/lib/bookmark';
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
  const [posts, setPosts] = useState<PostType[]>([]);
  const [selectedPost, setSelectedPost] = useState<{ post: any; user: any } | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'bookmarks'>('posts');
  const [bookmarkPosts, setBookmarkPosts] = useState<BookmarkPostType[]>([]);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const isOwnProfile = currentUser.nickname === userData.nickname;

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProfile(String(nicknameParam));
        if (data) {
          setUserData(data.user);
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

  // 북마크 탭 선택 시 데이터 로드
  useEffect(() => {
    if (activeTab === 'bookmarks' && isOwnProfile && currentUser.userId) {
      setBookmarkLoading(true);
      getBookmarkPosts(currentUser.userId)
        .then((data) => setBookmarkPosts(data))
        .finally(() => setBookmarkLoading(false));
    }
  }, [activeTab, isOwnProfile, currentUser.userId]);

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

  // 북마크 게시글은 북마크 순서대로 (그룹핑 없이)
  const bookmarkPostItems = useMemo(() => {
    return bookmarkPosts.map((item) => ({
      ...item.post,
      tags: item.post.tags || [],
      photoDate: item.post.photoDate || '',
    }));
  }, [bookmarkPosts]);

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
    return <ProfileSkeleton />;
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
              <Link
                href={`/accounts/${currentUser.userId}`}
                className="text-paw-sub transition-colors hover:text-paw-main">
                <Settings size={18} />
              </Link>
            )}
          </div>

          {userData.bio && <p className="mt-1 text-center text-sm text-paw-sub">{userData.bio}</p>}

          {/* 로그아웃 버튼 (본인 프로필에서만) */}
          {isOwnProfile && (
            <button
              onClick={handleLogout}
              className="btn-app mt-3 flex items-center gap-1 rounded-full border bg-red-500 px-3 py-1.5 text-xs text-paw-cream transition-colors">
              <LogOut size={12} />
              로그아웃
            </button>
          )}
        </div>

        {/* 탭 버튼 */}
        <div className="mt-5 flex items-center gap-4 border-b border-paw-border">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-1.5 border-b-2 px-1 pb-2 text-sm transition-colors ${
              activeTab === 'posts'
                ? 'border-paw-main font-semibold text-paw-brown'
                : 'border-transparent text-paw-sub hover:text-paw-brown'
            }`}>
            <ImageIcon size={14} />
            게시물 {posts.length}
          </button>
          {isOwnProfile && (
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`flex items-center gap-1.5 border-b-2 px-1 pb-2 text-sm transition-colors ${
                activeTab === 'bookmarks'
                  ? 'border-paw-main font-semibold text-paw-brown'
                  : 'border-transparent text-paw-sub hover:text-paw-brown'
              }`}>
              <Bookmark size={14} />
              북마크
            </button>
          )}
        </div>

        {/* 게시물 탭 */}
        {activeTab === 'posts' && (
          <>
            {posts.length === 0 ? (
              <div className="flex h-32 items-center justify-center">
                <p className="text-sm text-paw-inactive">아직 게시물이 없어요</p>
              </div>
            ) : (
              <div className="pt-2">
                {groupedPosts.map((group) => (
                  <div key={group.date} className="mb-4">
                    <div className="flex items-center gap-1.5 py-2">
                      <Calendar size={13} className="text-paw-main" />
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
                          }>
                          {post.imgUrls?.[0] ? (
                            <Image
                              src={post.imgUrls[0]}
                              fill
                              alt={`게시글 ${index + 1}`}
                              className="object-cover transition-transform duration-200 hover:scale-105"
                              sizes="(max-width: 576px) 33vw, 192px"
                              placeholder="blur"
                              blurDataURL={BLUR_DATA_URL}
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
          </>
        )}

        {/* 북마크 탭 */}
        {activeTab === 'bookmarks' && (
          <>
            {bookmarkLoading ? (
              <div className="flex h-32 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-paw-main border-t-transparent" />
              </div>
            ) : bookmarkPostItems.length === 0 ? (
              <div className="flex h-32 items-center justify-center">
                <p className="text-sm text-paw-inactive">북마크한 게시물이 없어요</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1 pt-3">
                {bookmarkPostItems.map((post, index) => {
                  const bmUser = bookmarkPosts[index]?.user;
                  return (
                    <button
                      key={post.id}
                      className="relative aspect-square overflow-hidden rounded-md border border-gray-100"
                      onClick={() =>
                        setSelectedPost({
                          post,
                          user: bmUser || {
                            id: '',
                            email: '',
                            nickname: '',
                            profile_image: '',
                          },
                        })
                      }>
                      {post.imgUrls?.[0] ? (
                        <Image
                          src={post.imgUrls[0]}
                          fill
                          alt={`북마크 ${index + 1}`}
                          className="object-cover transition-transform duration-200 hover:scale-105"
                          sizes="(max-width: 576px) 33vw, 192px"
                          placeholder="blur"
                          blurDataURL={BLUR_DATA_URL}
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
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {selectedPost && (
        <DetailPage modal={() => setSelectedPost(null)} post={selectedPost.post} user={selectedPost.user} />
      )}
    </>
  );
}
