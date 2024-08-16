import { useModalStore } from '@/store/modalStore';
import ModalForm from '../_elements/modalForm';

export default function ModalTemplates() {
  const { closeModal } = useModalStore();
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-70" onClick={closeModal} />
        <button onClick={closeModal} className="absolute">
          닫기
        </button>
        <ModalForm />
      </div>
    </>
  );
}
