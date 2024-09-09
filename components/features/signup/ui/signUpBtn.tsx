import { Button } from '@/components/common';
import { types } from 'util';
import { string } from 'zod';

type ButtonType = 'button' | 'submit' | 'reset';
interface SignUpBtnProps {
  text: string;
  type: ButtonType;
  onClick?: () => void;
}
// w-full
export default function SignUpBtn({ text, onClick, type }: SignUpBtnProps) {
  return (
    <>
      <Button type={type} className="ml-4 w-32" onClick={onClick}>
        {text}
      </Button>
    </>
  );
}
