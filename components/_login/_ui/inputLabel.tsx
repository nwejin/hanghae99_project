import { Label } from '@ui';

interface InputLabelProps {
  name: string;
  text: string;
}

export default function InputLabel({ name, text }: InputLabelProps) {
  return (
    <>
      <Label htmlFor={name}>{text}</Label>
    </>
  );
}
