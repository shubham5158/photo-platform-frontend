import Skeleton from "./Skeleton.jsx";

const DownloadListSkeleton = ({ count = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} className="h-4 w-56" />
    ))}
  </div>
);

export default DownloadListSkeleton;
