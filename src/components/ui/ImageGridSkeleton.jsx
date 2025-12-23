import React from "react";
import Skeleton from "./Skeleton.jsx";

const ImageGridSkeleton = ({ count = 8 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className="w-full h-40"
          rounded="rounded-lg"
        />
      ))}
    </>
  );
};

export default ImageGridSkeleton;
