'use client';
import UserPost from '../_elements/userPost';
import { useEffect, useState, useRef } from 'react';
import { TotalPostType } from '@/lib/post';
// import { getPost } from '@/lib/post';

// import { useGetPost } from '@/lib/post';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Fragment } from 'react';

export default function MainPage() {
  // const [posts, setPosts] = useState<TotalPostType[]>([]);

  // useEffect(() => {
  //   const fetchPost = async () => {
  //     try {
  //       const postData = await getPost();
  //       setPosts(postData);
  //     } catch (error) {
  //       console.error('데이터 조회 실패', error);
  //     }
  //   };
  //   fetchPost();
  // }, []);

  // const { data: posts, error, isLoading } = useGetPost(); // useGetPost 훅을 사용하여 데이터 가져오기

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;

  const PAGE_SIZE = 5;
  const INITIAL_FETCH_COUNT = 5;

  // 데이터 요청 함수
  const fetchProjects = async ({ pageParam = 1 }: { pageParam?: number }) => {
    const pageSize = pageParam === 1 ? INITIAL_FETCH_COUNT : PAGE_SIZE;
    const res = await fetch(`/api/post?page=${pageParam}&pageSize=${pageSize}`);

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await res.json();
    return data;
  };

  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ['POST_KEY'],
    queryFn: fetchProjects,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    },
    // getNextPageParam: (lastPage, allPages) => {
    //   // 현재 페이지에서 더 많은 데이터가 있는지 확인
    //   // 현재 페이지 데이터가 페이지 크기와 같으면 다음 페이지가 있을 가능성이 높음
    //   return lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined;
    // },
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

  if (status === 'error') return <p>Error: {error.message}</p>;

  return (
    <>
      <div>
        {/* 데이터를 페이지 단위로 렌더링 */}
        {data?.pages &&
          data.pages.map((page, i) => (
            <Fragment key={i}>
              {page.map((item: { post: any; user: any }) => (
                <UserPost key={item.post.id} post={item.post} user={item.user} />
              ))}
            </Fragment>
          ))}
        {/* <div>
          <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
            {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load More' : 'Nothing more to load'}
          </button>
        </div> */}
        <div ref={loadMoreRef}>
          {isFetchingNextPage && <p>Loading more...</p>}
          {!hasNextPage && !isFetching && <p>Nothing more to load</p>}
        </div>

        <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
      </div>
    </>
  );

  // return (
  //   <>
  //     <div className="flex flex-col">
  //       {posts?.map((postData) => <UserPost key={postData.post.id} post={postData.post} user={postData.user} />)}
  //     </div>
  //   </>
  // );
}
