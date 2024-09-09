interface ContentLayoutProps {
  children: React.ReactNode;
}

export function ContentLayout({ children }: ContentLayoutProps) {
  return <div className="container w-full px-4 pb-8 pt-8 sm:px-8">{children}</div>;
}
