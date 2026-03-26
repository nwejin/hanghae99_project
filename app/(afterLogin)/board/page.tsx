'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useCurrentUser } from '@/lib/useCurrentUser';
import { useToast } from '@/components/common/ui/use-toast';
import { Button } from '@/components/common';

interface BoardMessage {
  id: string;
  userId: string;
  content: string;
  created_at: string;
  user: { nickname: string; profileImage: string | null } | null;
}

function getRelativeTime(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`;
  return date.toLocaleDateString('ko-KR');
}

export default function BoardPage() {
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState<BoardMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const { userId, isLoggedIn, role } = useCurrentUser();
  const { toast } = useToast();

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/board');
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch {
      console.error('게시판 조회 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      toast({
        title: '로그인이 필요합니다.',
        action: (
          <Button>
            <Link href="/login">로그인</Link>
          </Button>
        ),
      });
      return;
    }

    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (res.ok) {
        setContent('');
        await fetchMessages();
      }
    } catch {
      toast({ title: '글 작성에 실패했습니다.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (boardId: string) => {
    try {
      const res = await fetch('/api/board', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardId, isAdmin: role === 'admin' }),
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== boardId));
        setDeleteTargetId(null);
      }
    } catch {
      toast({ title: '삭제에 실패했습니다.' });
    }
  };

  const canDelete = (msg: BoardMessage) => msg.userId === userId || role === 'admin';

  return (
    <div className="px-4 py-4">
      {/* 입력 영역 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSubmit();
          }}
          placeholder="메시지를 입력해주세요..."
          maxLength={200}
          className="flex-1 rounded-full border border-paw-border bg-white py-2.5 px-4 text-sm text-paw-brown placeholder:text-paw-inactive focus:outline-none focus:ring-2 focus:ring-paw-main"
        />
        <button
          onClick={handleSubmit}
          disabled={submitting || !content.trim()}
          className="btn-app whitespace-nowrap rounded-full bg-paw-main px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50">
          작성하기
        </button>
      </div>

      {/* 게시물 목록 */}
      <div className="mt-4 space-y-2">
        {loading && (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-paw-main" />
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex h-40 flex-col items-center justify-center text-paw-inactive">
            <p className="text-sm">아직 게시글이 없습니다</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            onClick={() => {
              if (canDelete(msg)) {
                setDeleteTargetId(deleteTargetId === msg.id ? null : msg.id);
              }
            }}
            className={`flex items-center gap-3 rounded-2xl border border-paw-border bg-white px-4 py-3 transition-colors ${
              canDelete(msg) ? 'cursor-pointer hover:bg-paw-cream-dark' : ''
            }`}>
            {/* 프로필 이미지 */}
            <Link
              href={`/user/${msg.user?.nickname || ''}`}
              onClick={(e) => e.stopPropagation()}
              className="flex-shrink-0">
              <div className="h-9 w-9 overflow-hidden rounded-full border border-paw-border bg-paw-cream-dark">
                {msg.user?.profileImage ? (
                  <img
                    src={msg.user.profileImage}
                    alt={msg.user.nickname}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-paw-sub">
                    {msg.user?.nickname?.charAt(0)}
                  </div>
                )}
              </div>
            </Link>

            {/* 닉네임 + 내용 */}
            <div className="min-w-0 flex-1">
              <Link
                href={`/user/${msg.user?.nickname || ''}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-semibold text-paw-brown hover:underline">
                {msg.user?.nickname}
              </Link>
              <p className="truncate text-sm text-paw-sub">{msg.content}</p>
            </div>

            {/* 시간 또는 삭제 버튼 */}
            <div className="flex-shrink-0">
              {deleteTargetId === msg.id ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(msg.id);
                  }}
                  className="btn-app rounded-full bg-paw-like px-3 py-1 text-xs font-medium text-white">
                  삭제
                </button>
              ) : (
                <span className="whitespace-nowrap text-xs text-paw-inactive">
                  {getRelativeTime(msg.created_at)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
