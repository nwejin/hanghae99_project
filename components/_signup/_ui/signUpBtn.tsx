import { Button } from '@ui';

interface SignUpBtnProps {
  text: string;
  onClick?: () => void;
}
// w-full
export default function SignUpBtn({ text, onClick }: SignUpBtnProps) {
  return (
    <>
      <Button type="submit" className="ml-4 w-32" onClick={onClick}>
        {text}
      </Button>
    </>
  );
}
