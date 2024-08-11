'use client';

import { Input } from '@ui';
import { TextInputProps } from '@type';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { useFormContext } from 'react-hook-form';

export default function TextInput({ type, name, id, placeholder }: TextInputProps) {
  return (
    <>
      <Input type={type} id={id} placeholder={placeholder} />
    </>
  );
}
