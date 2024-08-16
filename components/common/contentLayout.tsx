interface ContentLayoutProps {
  children: React.ReactNode;
}

export function ContentLayout({ children }: ContentLayoutProps) {
  return (
    <div>
      <div className="container w-full bg-slate-950 px-4 pb-8 pt-8 sm:px-8">{children} </div>
    </div>
  );
}
