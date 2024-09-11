import { Button } from '@/components/common';
import { MoveRight, MoveLeft } from 'lucide-react';

type ButtonType = 'button' | 'submit' | 'reset';
interface SignUpBtnProps {
  text: string;
  type: ButtonType;
  onClick?: () => void;
}

export default function SignUpBtn({ text, onClick, type }: SignUpBtnProps) {
  return (
    <>
      <Button type={type} className="h-6 w-20" onClick={onClick}>
        {text}
      </Button>
    </>
  );
}
