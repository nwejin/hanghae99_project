'use client';
import { TextInputProps } from '@type';
import { useFormContext } from 'react-hook-form';

export default function TextInput({ type, name, id, placeholder, text }: TextInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <div className="mb-1 flex items-center gap-2">
        <label htmlFor={name} className="text-xs font-semibold text-paw-sub">
          {text}
        </label>
        {errors[name] && <span className="text-xs text-red-500">{errors[name]?.message as string}</span>}
      </div>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        {...register(name)}
        className="w-full rounded-xl border border-paw-border bg-paw-cream-dark px-3 py-2.5 text-sm text-paw-brown placeholder:text-paw-inactive focus:outline-none focus:ring-1 focus:ring-paw-main"
      />
    </div>
  );
}
