'use client';

import { useFormContext } from 'react-hook-form';
import { useState } from 'react';
import { X } from 'lucide-react';

export default function Contents() {
  const { setValue } = useFormContext();
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || tags.includes(trimmed)) return;

    const updated = [...tags, trimmed];
    setTags(updated);
    setValue('tags', updated);
    setInputValue('');
  };

  const removeTag = (index: number) => {
    const updated = tags.filter((_, i) => i !== index);
    setTags(updated);
    setValue('tags', updated);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.includes(' ')) {
      const trimmed = value.replace(/\s/g, '');
      if (trimmed) addTag(trimmed);
    } else {
      setInputValue(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    }
    if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="w-full">
      {tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {tags.map((tag, index) => (
            <span
              key={index}
              onClick={() => removeTag(index)}
              className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-paw-main/10 px-2.5 py-1 text-xs font-semibold text-paw-main transition-colors hover:bg-paw-main/20"
            >
              #{tag}
              <X size={12} />
            </span>
          ))}
        </div>
      )}
      <input
        placeholder="태그 입력 후 스페이스 (선택, 10자 이내)"
        value={inputValue}
        maxLength={10}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full rounded-xl border border-paw-border bg-paw-cream-dark px-3 py-2.5 text-sm text-paw-brown placeholder:text-paw-inactive focus:outline-none focus:ring-1 focus:ring-paw-main"
      />
    </div>
  );
}
