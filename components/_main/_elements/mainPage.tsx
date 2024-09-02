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
  const INITIAL_FETCH_COUNT = 5; // 초기 5페이지

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
    // cursur가 없을때 사용
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
  });

  //사용자가 특정 화면에 진입 확인
  const observer = useRef<IntersectionObserver | null>(null);

  // 무한 스크롤 트리거
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 추가 데이터를 가져오는 중이거나, loadMoreRef가 아직 설정되지 않았다면 아무 작업도 하지 않고 종료
    if (isFetchingNextPage || !loadMoreRef.current) return;

    // 대상 요소가 뷰포트에 진입하면 다음 페이지 데이터 호출
    const observerCallback: IntersectionObserverCallback = (entries) => {
      // 요소가 화면에 보이고, 다음 페이지가 존재하며, 현재 추가 데이터를 가져오는 중이 아니라면 fetchNextPage() 호출
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    // IntersectionObserver를 초기화하고, 특정 요소가 뷰포트와의 거리가 100px 이내로 들어오면 observerCallback 호출
    observer.current = new IntersectionObserver(observerCallback, {
      rootMargin: '100px', // 100px부터 감지
    });

    // loadMoreRef.current가 설정되었다면 해당 요소에 대해 IntersectionObserver 시작
    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }

    // 클린업 함수: 컴포넌트가 언마운트되거나, loadMoreRef.current가 변경될 때 이전 관찰을 중지
    return () => {
      if (observer.current && loadMoreRef.current) {
        observer.current.unobserve(loadMoreRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === 'error') return <p>Error: {error.message}</p>;

  // const userId = userStore((state) => state.userId);
  // console.log(userId);

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

        <div>{isFetching && !isFetchingNextPage ? '게시글을 조회중입니다.' : null}</div>
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
