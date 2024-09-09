import { Progress } from '@/components/common';

interface stepProps {
  step: number;
}

export default function ProgressBar({ step }: stepProps) {
  const stepValue = step * 33.3;
  return (
    <>
      <Progress value={stepValue} className="mb-2 h-2" />
    </>
  );
}
