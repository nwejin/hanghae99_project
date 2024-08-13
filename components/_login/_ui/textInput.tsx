import { Input } from '@ui';
import { TextInputProps } from '@type';
import { useFormContext } from 'react-hook-form';

export default function TextInput({ type, name, id, placeholder }: TextInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <Input type={type} id={id} placeholder={placeholder} {...register(name)} />
      {errors[name] && <p className="text-red-500">{errors[name]?.message as string}</p>}
    </>
  );
}
