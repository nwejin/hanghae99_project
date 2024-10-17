import { useModalStore } from '@/store/modalStore';
import ModalForm from '../sections/modalForm';
import { X } from 'lucide-react';

export function Container() {
  const { closeModal } = useModalStore();

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-70" onClick={closeModal} />
        <button onClick={closeModal} className="absolute right-10 top-10">
          <X color="#ffffff" strokeWidth={3} />
        </button>
        <ModalForm />
      </div>
    </>
  );
}
