import React from "react";
import Skeleton from "./Skeleton.jsx";

const ClientLandingSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}
      <header className="px-6 py-4 border-b border-slate-800 flex justify-between">
        <Skeleton className="h-6 w-48" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </header>

      {/* HERO */}
      <section className="h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-4 w-full max-w-xl px-6">
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-full mx-auto" />
          <Skeleton className="h-5 w-5/6 mx-auto" />
          <Skeleton className="h-12 w-full mt-6 rounded-lg" />
        </div>
      </section>

      {/* PORTFOLIO GRID */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <Skeleton className="h-8 w-48 mx-auto mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ClientLandingSkeleton;
