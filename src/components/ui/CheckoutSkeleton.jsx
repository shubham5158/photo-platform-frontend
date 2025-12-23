import Skeleton from "./Skeleton.jsx";

const CheckoutSkeleton = () => {
  return (
    <div className="bg-slate-900/80 border border-slate-700 p-6 rounded-xl max-w-lg w-full space-y-4">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-40" />

      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-5 w-28" />
      </div>

      <Skeleton className="h-10 w-full mt-4" />
    </div>
  );
};

export default CheckoutSkeleton;
