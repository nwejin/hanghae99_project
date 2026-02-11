'use client';

import { useRef, useEffect } from 'react';
import { useModalStore } from '@/store/modalStore';
import ModalForm from '../sections/modalForm';
import gsap from 'gsap';

export function Container() {
  const { closeModal } = useModalStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { y: '100%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, []);

  const handleClose = () => {
    if (panelRef.current) {
      gsap.to(panelRef.current, {
        y: '100%',
        opacity: 0,
        duration: 0.3,
        ease: 'power3.in',
        onComplete: closeModal,
      });
    }
  };

  const handleSubmitClick = () => {
    formRef.current?.requestSubmit();
  };

  return (
    <div className="absolute inset-0 z-30 overflow-hidden">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div
        ref={panelRef}
        className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-white shadow-2xl dark:bg-zinc-950">
        <div className="flex items-center justify-center px-4 py-3">
          <span className="text-lg font-bold">New Post</span>
        </div>
        <ModalForm formRef={formRef} />

        <div className="flex items-center justify-center gap-10 pb-5">
          <button
            onClick={handleSubmitClick}
            className="text-md h-8 w-[180px] rounded-md bg-primary text-sm font-bold text-white">
            작성하기
          </button>

          <button onClick={handleClose} className="text-md h-8 w-[180px] rounded-md bg-red-500 font-bold text-white">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
