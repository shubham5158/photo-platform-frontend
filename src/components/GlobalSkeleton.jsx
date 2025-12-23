import React from "react";

const Skeleton = ({ className }) => (
  <div className={`skeleton rounded ${className}`} />
);

const GlobalSkeleton = () => {
  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="hidden md:block w-64 bg-slate-900 p-4 space-y-4">
        <Skeleton className="h-6 w-32 bg-slate-700" />
        <Skeleton className="h-4 w-40 bg-slate-700" />

        <div className="mt-8 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full bg-slate-700" />
          ))}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </main>
    </div>
  );
};

export default GlobalSkeleton;
