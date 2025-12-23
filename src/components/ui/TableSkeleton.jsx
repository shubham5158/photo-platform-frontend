import React from "react";
import Skeleton from "./Skeleton.jsx";

const TableSkeleton = ({ rows = 6 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b">
          <td className="px-3 py-3">
            <Skeleton className="h-4 w-36" />
          </td>
          <td className="px-3 py-3">
            <Skeleton className="h-4 w-28" />
          </td>
          <td className="px-3 py-3">
            <Skeleton className="h-4 w-24" />
          </td>
          <td className="px-3 py-3">
            <Skeleton className="h-4 w-20" />
          </td>
          <td className="px-3 py-3 flex gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </td>
        </tr>
      ))}
    </>
  );
};

export default TableSkeleton;
