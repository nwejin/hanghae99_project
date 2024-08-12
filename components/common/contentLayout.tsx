interface ContentLayoutProps {
  children: React.ReactNode;
}

export function ContentLayout({ children }: ContentLayoutProps) {
  return (
    <div>
      <div className="container px-4 pb-8 pt-8 sm:px-8">{children} </div>
    </div>
  );
}
