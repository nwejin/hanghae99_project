// import { useQuery, UseQueryOptions, useInfiniteQuery, UseInfiniteQueryOptions } from '@tanstack/react-query';
// import { getPost, POST_KEY } from '@/lib/post';

// import { TotalPostType } from '@/lib/post';
// import { ApiError } from '@/shared/api-error';

// export const useGetPost = (options?: UseQueryOptions<TotalPostType[], ApiError>) => {
//   return useQuery<TotalPostType[], ApiError>({
//     queryKey: [POST_KEY],
//     queryFn: getPost,

//     ...options,
//   });
// };

// const PAGE_SIZE = 10;
// const pageParam = 1

// export const useGetPost = (options?: UseInfiniteQueryOptions<TotalPostType[], ApiError>) => {
//   return useInfiniteQuery({
//     queryKey: [POST_KEY],
//     queryFn: getPost,
//     initialPageParam: 0,
//     getNextPageParam: (lastPage, allPages, lastPageParam) => {
//       if (lastPage.length === 0) {
//         return undefined;
//       }
//       return lastPageParam + 1;
//     },
//     getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
//       if (firstPageParam <= 1) {
//         return undefined;
//       }
//       return firstPageParam - 1;
//     },
//   });
// };
