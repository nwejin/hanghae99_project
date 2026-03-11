type ButtonType = 'button' | 'submit' | 'reset';
interface SignUpBtnProps {
  text: string;
  type: ButtonType;
  onClick?: () => void;
}

export default function SignUpBtn({ text, onClick, type }: SignUpBtnProps) {
  const isBack = text === '이전';
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ${
        isBack
          ? 'border border-paw-border text-paw-sub hover:text-paw-brown'
          : 'bg-paw-orange text-white hover:bg-paw-orange/90'
      }`}
    >
      {text}
    </button>
  );
}
