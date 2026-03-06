import { ReactNode } from 'react';

export default function PageShell({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="min-h-screen pb-20">
      {title && (
        <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border px-4 py-3">
          <h1 className="font-display text-lg font-bold text-foreground">{title}</h1>
        </header>
      )}
      <main className="px-4 py-4">{children}</main>
    </div>
  );
}
