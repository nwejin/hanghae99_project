import { Button } from '@ui';

interface SignUpBtnProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
}
// w-full
export default function SignUpBtn({ text, onClick, disabled }: SignUpBtnProps) {
  return (
    <>
      <Button type="submit" className="ml-4 w-32" onClick={onClick} disabled={disabled}>
        {text}
      </Button>
    </>
  );
}
