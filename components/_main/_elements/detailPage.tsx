import { X } from 'lucide-react';
import { Card } from '@ui';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Heart, Send, MessageCircle } from 'lucide-react';

import { useState } from 'react';

interface modalProps {
  modal: () => void;
}

export default function DetailPage({ modal }: modalProps) {
  const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);

  const [inputValue, setInputValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-70" onClick={modal} />
        <button onClick={modal} className="absolute right-10 top-10">
          <X color="#ffffff" strokeWidth={3} />
        </button>
        <Card.Card className="relative z-10 flex h-[44rem] w-[70rem] items-center justify-center rounded-lg bg-white p-0 shadow-md">
          <Card.CardContent className="flex h-full w-full pb-6 pt-6">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/hanghae99-project-0807.appspot.com/o/images%2F1724215301226_e608213f-0bd3-44e0-b8e8-8943c3459b21?alt=media&token=404e3f34-4707-47e4-9831-2ca726bd103e"
              width={650}
              height={650}
              alt="Pet Image"
              className="aspect-square object-cover"
            />
            <div className="h-full w-full">
              <Card.Card className="rounded-none p-3">
                <Card.CardContent className="p-0">사용자 프로필</Card.CardContent>
              </Card.Card>
              <ScrollArea className="rounded-None h-3/5 w-full border">
                <div className="p-4">
                  <h4 className="mb-4 text-sm font-medium leading-none">게시글 내용</h4>
                  <div className="text-sm">게시글</div>
                  <Separator className="my-3" />
                  {tags.map((tag, index) => (
                    <>
                      <div key={index} className="text-sm">
                        {tag}
                      </div>
                      <Separator className="my-3" />
                    </>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex w-full items-center">
                <Button variant="ghost" size="icon">
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Like</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <MessageCircle className="h-4 w-4" />
                  <span className="sr-only">Comment</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
              </div>
              <div className="relative">
                <Textarea
                  placeholder="댓글을 입력하세요..."
                  className="h-full rounded-none"
                  value={inputValue}
                  onChange={handleChange}
                />
                {inputValue && <Button className="absolute bottom-4 right-2">등록</Button>}
              </div>
            </div>
          </Card.CardContent>
        </Card.Card>
      </div>
    </>
  );
}
