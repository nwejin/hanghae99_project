'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Calendar, ArrowUpDown, RefreshCw } from 'lucide-react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { PostSkeleton, FeedSkeleton } from '@/components/common';
import { PostLoading } from '../ui';
import PostThumbnail from './userPostCard';
import DetailPage from './detailPage';

export default function MainPage() {
  const PAGE_SIZE = 5;
  const INITIAL_FETCH_COUNT = 5;

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [ascending, setAscending] = useState(false);
  const [selectedPost, setSelectedPost] = useState<{ post: any; user: any } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['POST_KEY'] });
    setTimeout(() => setRefreshing(false), 500);
  }, [queryClient]);

  const fetchProjects = async ({ pageParam = 1 }: { pageParam?: number }) => {
    const pageSize = pageParam === 1 ? INITIAL_FETCH_COUNT : PAGE_SIZE;
    const res = await fetch(`/api/post?page=${pageParam}&pageSize=${pageSize}`);
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  };

  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ['POST_KEY'],
    queryFn: fetchProjects,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) return undefined;
      return lastPageParam + 1;
    },
    getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
      if (firstPageParam <= 1) return undefined;
      return firstPageParam - 1;
    },
  });

  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isFetchingNextPage || !loadMoreRef.current) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    observer.current = new IntersectionObserver(observerCallback, {
      rootMargin: '100px',
    });

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observer.current && loadMoreRef.current) {
        observer.current.unobserve(loadMoreRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 모든 게시물 평탄화 + 필터 + 날짜별 그룹핑
  const groupedPosts = useMemo(() => {
    if (!data?.pages) return [];

    const allPosts = data.pages.flatMap((page) => page.map((item: { post: any; user: any }) => item));

    // 날짜 필터링
    const filtered = allPosts.filter((item: { post: any }) => {
      const date = item.post.photoDate || item.post.created_at?.split('T')[0] || '';
      if (startDate && date < startDate) return false;
      if (endDate && date > endDate) return false;
      return true;
    });

    // 날짜별 그룹핑
    const groups: Record<string, { post: any; user: any }[]> = {};
    filtered.forEach((item: { post: any; user: any }) => {
      const date = item.post.photoDate || item.post.created_at?.split('T')[0] || '날짜 없음';
      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
    });

    // 날짜 정렬
    const sortedKeys = Object.keys(groups).sort((a, b) => (ascending ? a.localeCompare(b) : b.localeCompare(a)));

    return sortedKeys.map((date) => ({
      date,
      items: groups[date],
    }));
  }, [data, startDate, endDate, ascending]);

  if (status === 'pending') return <FeedSkeleton />;
  if (status === 'error') return <p>Error: {error.message}</p>;

  return (
    <>
      {/* 새로고침 버튼 + 필터 바 */}
      <div className="sticky top-0 z-10 border-b-2 border-paw-cream-dark bg-white px-4 py-2.5">
        <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto">
          <div className="flex flex-1 items-center gap-1.5">
            <Calendar size={14} className="flex-shrink-0 text-paw-sub" />
            <input
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full min-w-0 rounded-lg border border-paw-cream-dark bg-paw-cream-dark px-2 py-1.5 text-xs text-paw-brown focus:outline-none"
            />
            <span className="text-xs text-paw-sub">~</span>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full min-w-0 rounded-lg border border-paw-cream-dark bg-paw-cream-dark px-2 py-1.5 text-xs text-paw-brown"
            />
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-app flex flex-shrink-0 items-center justify-center rounded-lg bg-paw-main p-1.5 text-paw-cream transition-colors disabled:opacity-50">
            <RefreshCw size={12} className={refreshing ? 'animate-spin text-paw-cream' : 'text-paw-cream'} />
          </button>

          <button
            onClick={() => setAscending(!ascending)}
            className="btn-app flex flex-shrink-0 items-center gap-0.5 rounded-lg bg-paw-main px-2 py-1.5 text-[11px] text-paw-cream">
            <ArrowUpDown size={13} />
            {ascending ? '오래된순' : '최신순'}
          </button>
        </div>
      </div>

      {/* 날짜별 그룹 + 3열 그리드 */}
      <div className="px-1 py-2">
        {groupedPosts.map((group) => (
          <div key={group.date} className="mb-4">
            <div className="flex items-center gap-1.5 px-3 py-2">
              <Calendar size={13} className="text-paw-main" />
              <span className="text-xs font-semibold text-paw-brown">
                {group.date === '날짜 없음' ? group.date : group.date.replace(/-/g, '.')}
              </span>
              <span className="text-[10px] text-paw-sub">({group.items.length})</span>
            </div>
            <div className="grid grid-cols-3 gap-1 px-1">
              {group.items.map((item) => (
                <PostThumbnail
                  key={item.post.id}
                  post={item.post}
                  user={item.user}
                  onSelect={() => setSelectedPost(item)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div ref={loadMoreRef}>{isFetchingNextPage && <PostLoading />}</div>
      <div>{isFetching && !isFetchingNextPage ? <PostSkeleton /> : null}</div>

      {selectedPost && (
        <DetailPage modal={() => setSelectedPost(null)} post={selectedPost.post} user={selectedPost.user} />
      )}
    </>
  );
}
