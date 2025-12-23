import Skeleton from "./Skeleton.jsx";

const ClientImageGridSkeleton = ({ count = 12 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-40 w-full rounded-lg"
        />
      ))}
    </>
  );
};

export default ClientImageGridSkeleton;
