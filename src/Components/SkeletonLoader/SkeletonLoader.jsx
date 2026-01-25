import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const CardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="bg-base-200 rounded-lg p-4 shadow-md">
            <Skeleton height={192} className="mb-4" />
            <Skeleton height={24} className="mb-2" />
            <Skeleton count={2} className="mb-3" />
            <div className="flex justify-between items-center">
              <Skeleton width={80} height={20} />
              <Skeleton width={100} height={36} />
            </div>
          </div>
        ))}
    </>
  );
};

export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            {Array(columns)
              .fill(0)
              .map((_, i) => (
                <th key={i}>
                  <Skeleton width={100} />
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {Array(rows)
            .fill(0)
            .map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array(columns)
                  .fill(0)
                  .map((_, colIndex) => (
                    <td key={colIndex}>
                      <Skeleton />
                    </td>
                  ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export const DetailsSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Skeleton height={400} className="mb-6" />
      <Skeleton height={40} className="mb-4" />
      <Skeleton count={3} className="mb-2" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Skeleton height={100} />
        <Skeleton height={100} />
      </div>
    </div>
  );
};

export default { CardSkeleton, TableSkeleton, DetailsSkeleton };
