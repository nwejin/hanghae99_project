'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { ChevronLeft, Heart, MessageCircle, Calendar, Tag, Send, Trash2, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { ScrollArea, ScrollBar } from '@/components/common';
import { Separator } from '@/components/common';
import Link from 'next/link';
import Image from 'next/image';
import { useGetComment, useCreatePost } from '@/lib/comment';
import { useCurrentUser } from '@/lib/useCurrentUser';
import { addLike, deleteLike, getLike } from '@/lib/like';
import { addCommentLike, deleteCommentLike, getCommentLike } from '@/lib/commentLike';
import { createNotification } from '@/lib/notification';
import { timeCheck } from '@/shared/timeUtils';
import gsap from 'gsap';

import { type CarouselApi } from '@/components/common/ui/carousel';
import { Carousel } from '@/components/common';
import CarouselBtn from '../ui/post/carouselBtn';

import { PostType, UserType } from '@/lib/post';

interface detailProps {
  post: PostType;
  user: UserType;
  modal: () => void;
}

export default function DetailPage({ modal, post, user }: detailProps) {
  const [inputValue, setInputValue] = useState('');
  const { userId } = useCurrentUser();
  const [liked, setLiked] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const [fullscreenImg, setFullscreenImg] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const isOwnPost = userId === post.userId;

  // 댓글 좋아요 상태: { [commentId]: { liked: boolean, count: number } }
  const [commentLikes, setCommentLikes] = useState<Record<string, { liked: boolean; count: number }>>({});

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const { data: comments, refetch } = useGetComment(post.id);
  const createPost = useCreatePost();

  // 댓글 좋아요 초기 로드
  useEffect(() => {
    if (!comments || comments.length === 0) return;
    comments.forEach(async (comment) => {
      try {
        const res = await getCommentLike(comment.id, userId);
        setCommentLikes((prev) => ({
          ...prev,
          [comment.id]: { liked: res.isLiked, count: res.likeCount },
        }));
      } catch {
        // 무시
      }
    });
  }, [comments, userId]);

  const handleCommentLike = async (commentId: string, commentUserId: string) => {
    if (!userId) return;
    const current = commentLikes[commentId];
    const isLiked = current?.liked || false;
    const newLiked = !isLiked;

    // 낙관적 업데이트
    setCommentLikes((prev) => ({
      ...prev,
      [commentId]: {
        liked: newLiked,
        count: (current?.count || 0) + (newLiked ? 1 : -1),
      },
    }));

    try {
      if (newLiked) {
        await addCommentLike(commentId);
        createNotification({
          userId: commentUserId,
          type: 'comment_like',
          postId: post.id,
          commentId,
        });
      } else {
        await deleteCommentLike(commentId);
      }
    } catch {
      // 롤백
      setCommentLikes((prev) => ({
        ...prev,
        [commentId]: { liked: isLiked, count: current?.count || 0 },
      }));
    }
  };

  const handleCommentSubmit = async () => {
    if (inputValue.trim() === '') return;
    createPost.mutate(
      { postId: post.id, comment: inputValue },
      {
        onSuccess: () => {
          setInputValue('');
          refetch();
          // 댓글 알림
          createNotification({
            userId: post.userId,
            type: 'comment',
            postId: post.id,
          });
        },
      }
    );
  };

  useEffect(() => {
    if (userId) {
      getLike(post.id, userId).then((res) => setLiked(res.isLiked));
    }
  }, [post.id, userId]);

  const handleLike = async () => {
    if (!userId) return;
    const likeUpdate = !liked;
    setLiked(likeUpdate);
    try {
      if (likeUpdate) {
        await addLike({ postId: post.id });
        // 좋아요 알림
        createNotification({
          userId: post.userId,
          type: 'like',
          postId: post.id,
        });
      } else {
        await deleteLike({ postId: post.id });
      }
    } catch {
      setLiked(liked);
    }
  };

  // GSAP 열기 애니메이션
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    if (panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { y: '100%' },
        { y: '0%', duration: 0.4, ease: 'power3.out' }
      );
    }
    if (overlayRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // GSAP 닫기 애니메이션
  const handleClose = useCallback(() => {
    if (panelRef.current) {
      gsap.to(panelRef.current, {
        y: '100%',
        duration: 0.3,
        ease: 'power3.in',
      });
    }
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: modal,
      });
    }
  }, [modal]);

  const handleDelete = async () => {
    if (!confirm('이 게시물을 삭제하시겠습니까?')) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/post', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id }),
      });
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ['POST_KEY'] });
        modal();
      }
    } catch (error) {
      console.error('삭제 오류:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <div ref={overlayRef} className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div
        ref={panelRef}
        className="relative z-10 flex h-full w-full max-w-xl flex-col overflow-hidden bg-white"
      >
        {/* 상단 바 */}
        <div className="flex items-center justify-between border-b border-paw-border px-4 py-3">
          <button onClick={handleClose} className="text-paw-brown">
            <ChevronLeft size={24} />
          </button>
          <span className="text-sm font-semibold text-paw-brown">게시물</span>
          {isOwnPost ? (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-paw-sub transition-colors hover:text-red-400 disabled:opacity-50"
            >
              <Trash2 size={18} />
            </button>
          ) : (
            <div className="w-6" />
          )}
        </div>

        {/* 스크롤 가능한 콘텐츠 */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* 유저 정보 */}
          <div className="flex items-center gap-2.5 px-4 py-3">
            <Link href={`/user/${user.nickname}`} onClick={handleClose} className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-paw-border">
              {user.profile_image ? (
                <img src={user.profile_image} alt={user.nickname} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-paw-cream-dark text-xs font-semibold text-paw-sub">
                  {user.nickname?.charAt(0)}
                </div>
              )}
            </Link>
            <div className="flex flex-1 items-center justify-between">
              <Link href={`/user/${user.nickname}`} onClick={handleClose} className="text-sm font-semibold text-paw-brown">
                {user.nickname}
              </Link>
              <span className="text-xs text-paw-sub">{timeCheck(post.created_at)}</span>
            </div>
          </div>

          {/* 이미지 캐러셀 */}
          {post.imgUrls.length > 0 && (
            <div className="relative">
              <Carousel.Carousel setApi={setApi}>
                <Carousel.CarouselContent>
                  {post.imgUrls.map((img, index) => (
                    <Carousel.CarouselItem key={index}>
                      <div
                        className="relative aspect-square w-full cursor-pointer"
                        onClick={() => setFullscreenImg(img)}
                      >
                        <Image
                          src={img}
                          fill
                          alt={`사진 ${index + 1}`}
                          className="object-cover"
                          sizes="(max-width: 576px) 100vw, 576px"
                        />
                      </div>
                    </Carousel.CarouselItem>
                  ))}
                </Carousel.CarouselContent>
                {post.imgUrls.length > 1 && <CarouselBtn />}
              </Carousel.Carousel>
              {post.imgUrls.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-2.5 py-0.5 text-[11px] text-white">
                  {current} / {count}
                </div>
              )}
            </div>
          )}

          {/* 좋아요/댓글 버튼 */}
          <div className="flex items-center gap-3 px-4 py-2">
            <button onClick={handleLike} className="transition-transform active:scale-125">
              <Heart
                size={24}
                className={liked ? 'fill-paw-like text-paw-like' : 'text-paw-brown'}
                strokeWidth={liked ? 0 : 1.8}
              />
            </button>
            <MessageCircle size={24} className="text-paw-brown" strokeWidth={1.8} />
          </div>

          {/* 본문 */}
          <div className="px-4 pb-2">
            <p className="text-sm leading-relaxed text-paw-brown">{post.contents}</p>
          </div>

          {/* 날짜 + 태그 */}
          <div className="flex flex-wrap items-center gap-2 px-4 pb-3">
            {post.photoDate && (
              <span className="flex items-center gap-1 text-xs text-paw-sub">
                <Calendar size={12} />
                {post.photoDate}
              </span>
            )}
            {post.tags?.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-0.5 rounded-full bg-paw-tag px-2.5 py-0.5 text-xs font-medium text-paw-main">
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>

          <Separator className="bg-paw-border" />

          {/* 댓글 목록 */}
          <div className="px-4 py-3">
            <p className="mb-3 text-xs font-semibold text-paw-sub">댓글</p>
            {comments?.length === 0 && (
              <p className="py-4 text-center text-xs text-paw-inactive">아직 댓글이 없어요</p>
            )}
            {comments?.map((comment) => {
              const cl = commentLikes[comment.id];
              return (
                <div key={comment.id} className="mb-3">
                  <div className="flex items-start gap-2">
                    <div className="h-7 w-7 flex-shrink-0 overflow-hidden rounded-full border border-paw-border">
                      {comment.user.profileImage ? (
                        <img src={comment.user.profileImage} alt={comment.user.nickname} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-paw-cream-dark text-[10px] font-semibold text-paw-sub">
                          {comment.user.nickname?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-paw-brown">{comment.user.nickname}</span>
                        <span className="text-[10px] text-paw-inactive">{timeCheck(comment.created_at)}</span>
                      </div>
                      <p className="mt-0.5 text-sm text-paw-brown">{comment.comment}</p>
                    </div>
                    <button
                      onClick={() => handleCommentLike(comment.id, comment.userId)}
                      className="flex flex-shrink-0 flex-col items-center gap-0.5 self-center"
                    >
                      <Heart
                        size={14}
                        strokeWidth={1.5}
                        className={
                          cl?.liked
                            ? 'fill-paw-like text-paw-like'
                            : 'text-paw-inactive transition-colors hover:text-paw-like'
                        }
                      />
                      {(cl?.count ?? 0) > 0 && (
                        <span className="text-[9px] text-paw-inactive">{cl?.count}</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 댓글 입력 (하단 고정) */}
        <div className="flex flex-shrink-0 items-center gap-2 border-t border-paw-border bg-white px-4 py-3">
          <input
            type="text"
            placeholder="댓글을 입력하세요..."
            className="flex-1 rounded-full border border-paw-border bg-paw-cream-dark px-4 py-2 text-sm text-paw-brown placeholder:text-paw-inactive focus:outline-none focus:ring-1 focus:ring-paw-main"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                handleCommentSubmit();
              }
            }}
          />
          {inputValue && (
            <button
              onClick={handleCommentSubmit}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-paw-main text-white transition-transform active:scale-95">
              <Send size={16} />
            </button>
          )}
        </div>
      </div>

      {/* 이미지 풀스크린 뷰어 */}
      {fullscreenImg && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
          onClick={() => setFullscreenImg(null)}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white transition-opacity hover:bg-black/70"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenImg(null);
            }}
          >
            <X size={24} />
          </button>
          <img
            src={fullscreenImg}
            alt="전체화면"
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
