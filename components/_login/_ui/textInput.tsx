import { Input } from '@ui';
import { Label } from '@ui';
import { TextInputProps } from '@type';
import { useFormContext } from 'react-hook-form';

export default function TextInput({ type, name, id, placeholder, text }: TextInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <div className="flex items-center">
        <Label className="mr-2 text-base font-semibold" htmlFor={name}>
          {text}
        </Label>
        {errors[name] && <span className="text-sm text-red-500">{errors[name]?.message as string}</span>}
      </div>
      <Input type={type} id={id} placeholder={placeholder} {...register(name)} />
    </>
  );
}
