'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChunggoonPanel({ isOpen, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (isOpen) {
      gsap.fromTo(panel, { y: '-100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 0.45, ease: 'back.out(1.4)' });
    } else {
      gsap.to(panel, { y: '-100%', opacity: 0, duration: 0.3, ease: 'power2.in' });
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && <div className="absolute inset-0 z-10 bg-black/20" onClick={onClose} />}
      <div
        ref={panelRef}
        className="absolute left-0 right-0 top-0 z-20 rounded-b-3xl bg-paw-cream-dark p-5 shadow-lg"
        style={{ transform: 'translateY(-100%)' }}>
        <div className="scrollbar-hide max-h-[70dvh] overflow-y-auto">
          <div className="flex items-start gap-4">
            <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-paw-cream">
              <Image src="/image/chung.png" alt="청군이" fill className="object-cover" />
            </div>
            <div className="flex flex-col gap-1">
              <p style={{ fontFamily: 'RomanticGumi' }} className="text-2xl text-paw-brown">
                청군이 🐾
              </p>
              <p style={{ fontFamily: 'RomanticGumi' }} className="text-sm leading-relaxed text-paw-sub">
                에헴. 나는 14살 청군이 할아버지다 🐾
                <br />
                <br />
                내가 좋아하는 건 잠, 밥, 산책이다.
                <br />
                하루 일과는 잠밥산책이지. 이게 내 견생이야.
                <br />
                <br />
                너무 많이 먹어서 전성기 때는
                <br />
                26kg까지 쪘었다… 놀리지 말거라 😋
                <br />
                <br />
                요즘엔 힘이 좀 빠져서
                <br />
                산책하고 나면 하루 종일 잠만 잔다 💤
                <br />
                <br />
                그래도 우리 집 보안은
                <br />
                14년째 내가 든든히 지키고 있지 💪
                <br />
                <br />
                복슬복슬 귀여워 보인다고 무시하지 말거라.
                <br />난 이빨이 날카로운 사냥개다 😏
              </p>
            </div>
          </div>
        </div>
        {/* 이전 버전 문구
        안녕하개요! 🐾
        13살 할아버지 강아지 청군이에요

        간식을 너~무 좋아하다 보니
        어느새 20kg 듬직이가 되어버린
        아메리칸 코카스파니엘이랍니다 😋

        요즘은 체력 충전이 최우선이라
        하루 종일 꿀잠 모드 중이에요 💤

        그래도 우리 집 경비는
        제가 책임지고 있다개요! 💪

        복슬복슬하다고 막 만지면 곤란해요…
        생각보다 이빨이 꽤 날카로울지도 몰라요 😏
      */}
      </div>
    </>
  );
}
