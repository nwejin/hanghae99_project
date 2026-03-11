'use client';

import { useState } from 'react';
import { Search, Tag, User, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { TotalPostType } from '@/lib/post';
import UserPostCard from '@/components/features/main/sections/userPostCard';

type SearchType = 'nickname' | 'tag';

interface UserResult {
  id: string;
  nickname: string;
  profile_image: string;
  bio: string;
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('tag');
  const [userResults, setUserResults] = useState<UserResult[]>([]);
  const [postResults, setPostResults] = useState<TotalPostType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`/api/search?searchTerm=${encodeURIComponent(searchTerm.trim())}&type=${searchType}`);
      const data = await res.json();

      if (searchType === 'nickname') {
        setUserResults(Array.isArray(data) ? data : []);
        setPostResults([]);
      } else {
        setPostResults(Array.isArray(data) ? data : []);
        setUserResults([]);
      }
    } catch {
      setUserResults([]);
      setPostResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-4">
      {/* 검색 입력 */}
      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-paw-inactive" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSearch();
          }}
          placeholder={searchType === 'tag' ? '태그로 검색...' : '닉네임으로 검색...'}
          className="w-full rounded-full border border-paw-border bg-white py-2.5 pl-10 pr-4 text-sm text-paw-brown placeholder:text-paw-inactive focus:outline-none focus:ring-2 focus:ring-paw-orange"
        />
      </div>

      {/* 탭 전환 */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => { setSearchType('tag'); setSearched(false); setUserResults([]); setPostResults([]); }}
          className={`flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
            searchType === 'tag'
              ? 'bg-paw-orange text-white'
              : 'border border-paw-border bg-white text-paw-sub'
          }`}>
          <Tag size={12} />
          태그
        </button>
        <button
          onClick={() => { setSearchType('nickname'); setSearched(false); setUserResults([]); setPostResults([]); }}
          className={`flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
            searchType === 'nickname'
              ? 'bg-paw-orange text-white'
              : 'border border-paw-border bg-white text-paw-sub'
          }`}>
          <User size={12} />
          닉네임
        </button>
      </div>

      {/* 결과 */}
      <div className="mt-4">
        {loading && (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-paw-orange" />
          </div>
        )}

        {!loading && !searched && (
          <div className="flex h-40 flex-col items-center justify-center text-paw-inactive">
            <Search size={32} strokeWidth={1.2} />
            <p className="mt-2 text-sm">검색어를 입력해주세요</p>
          </div>
        )}

        {!loading && searched && searchType === 'nickname' && userResults.length === 0 && (
          <p className="py-8 text-center text-sm text-paw-inactive">검색 결과가 없습니다</p>
        )}

        {!loading && searched && searchType === 'tag' && postResults.length === 0 && (
          <p className="py-8 text-center text-sm text-paw-inactive">검색 결과가 없습니다</p>
        )}

        {/* 닉네임 검색 결과 */}
        {searchType === 'nickname' && userResults.length > 0 && (
          <div className="space-y-2">
            {userResults.map((user) => (
              <Link
                key={user.id}
                href={`/user/${user.nickname}`}
                className="flex items-center gap-3 rounded-2xl border border-paw-border bg-white px-4 py-3 transition-colors hover:bg-paw-cream-dark">
                <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-full border border-paw-border bg-paw-cream-dark">
                  {user.profile_image ? (
                    <img src={user.profile_image} alt={user.nickname} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-paw-sub">
                      {user.nickname?.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-paw-brown">{user.nickname}</p>
                  {user.bio && <p className="text-xs text-paw-sub">{user.bio}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 태그 검색 결과 */}
        {searchType === 'tag' && postResults.length > 0 && (
          <div className="flex flex-col gap-4">
            {postResults.map((item) => (
              <UserPostCard key={item.post.id} post={item.post} user={item.user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
