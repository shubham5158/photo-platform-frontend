import React from "react";
import Skeleton from "./Skeleton.jsx";

const OrderTableSkeleton = ({ rows = 6 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-slate-100">
          <td className="px-3 py-2">
            <Skeleton className="h-3 w-24" />
          </td>
          <td className="px-3 py-2">
            <Skeleton className="h-4 w-32" />
          </td>
          <td className="px-3 py-2">
            <Skeleton className="h-4 w-36" />
          </td>
          <td className="px-3 py-2">
            <Skeleton className="h-4 w-10" />
          </td>
          <td className="px-3 py-2">
            <Skeleton className="h-4 w-16" />
          </td>
          <td className="px-3 py-2">
            <Skeleton className="h-5 w-20 rounded-full" />
          </td>
        </tr>
      ))}
    </>
  );
};

export default OrderTableSkeleton;
