import { Switch } from '@/components/common';

interface SwitchBtnProps {
  isPrivate: boolean;
  onToggle: (value: boolean) => void;
}

export default function SwitchBtn({ isPrivate, onToggle }: SwitchBtnProps) {
  return (
    <div className="mt-3 flex items-center">
      <Switch onClick={() => onToggle(!isPrivate)} />
      <p className="ml-3 font-semibold">{isPrivate ? '비공개' : '공개'}</p>
    </div>
  );
}
