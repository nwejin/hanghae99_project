import { useModalStore } from '@/store/modalStore';

export default function ModalTemplates() {
  const { closeModal } = useModalStore();
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 rounded-lg bg-white p-8 shadow-lg">
          <button onClick={closeModal}> 닫기 </button>
          <p>모달입니다</p>
        </div>
      </div>
    </>
  );
}
