interface stepProps {
  step: number;
}

export default function ProgressBar({ step }: stepProps) {
  const stepValue = step * 50;
  return (
    <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-paw-cream-dark">
      <div
        className="h-full rounded-full bg-paw-main transition-all duration-300"
        style={{ width: `${stepValue}%` }}
      />
    </div>
  );
}
