'use client';

import { useState } from 'react';
import { Button, Card, Avatar } from '@/components/common';
import { cn } from '@/lib/utils';
import { useSidebarToggle } from '@/store/sidebarStore';
import { Drama, X, ChevronsRight } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/common';
import Link from 'next/link';

interface SearchBarProps {
  setIsSearchOpen: () => void;
}

export default function SearchBar({ setIsSearchOpen }: SearchBarProps) {
  const isSearchOpen = useSidebarToggle((state) => state.isSearchOpen);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]); // 검색 결과 상태
  const [error, setError] = useState<string | null>(null); // 오류 상태

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // 초기화
    try {
      const response = await fetch(`/api/search?searchTerm=${searchQuery}`);
      const data = await response.json();

      if (response.ok) {
        setSearchResults(data); // 검색 결과 설정
        console.log(searchResults);
      } else {
        setError(data.error); // 오류 메시지 설정
      }
    } catch (error) {
      console.error('검색 오류:', error);
      setError('검색 중 오류가 발생했습니다.');
    }
  };

  return (
    <div
      className={cn(
        'fixed left-[90px] top-0 z-40 h-screen bg-white shadow-lg transition-all duration-300 ease-in-out',
        isSearchOpen ? 'w-96' : 'w-0',
        'hidden lg:block' // PC에서만 보이도록 설정
      )}>
      <div className="flex items-center justify-between bg-white p-4">
        <p className="text-lg font-bold">검색</p>
        <Button variant="ghost" onClick={() => setIsSearchOpen()}>
          <X size={16} strokeWidth={3} color="#333" />
        </Button>
      </div>
      <form onSubmit={handleSearch} className="grid grid-cols-5 gap-2 bg-slate-50 p-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="col-span-4 rounded-md border p-2"
          placeholder="검색할 사용자를 입력해주세요"
        />
        <Button type="submit" variant="ghost" className="col-span-1">
          <span style={{ color: 'hsl(214, 100%, 46%)' }}>검색</span>
        </Button>
      </form>
      <ScrollArea className="h-full bg-white p-2">
        {searchResults.map((data, index) => (
          <Card.Card className="mb-3 p-2 shadow-none" key={index}>
            <Link href={`/user/${data.nickname}`} className="flex items-center justify-between">
              <Avatar.Avatar className="h-12 w-12 border">
                <Avatar.AvatarImage alt="img" src={data.profile_image} />
                <Avatar.AvatarFallback>{data.nickname}</Avatar.AvatarFallback>
              </Avatar.Avatar>
              <div className="w-full pl-4">
                <p className="font-bold">{data.nickname}</p>
              </div>
              <ChevronsRight />
            </Link>
          </Card.Card>
        ))}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
