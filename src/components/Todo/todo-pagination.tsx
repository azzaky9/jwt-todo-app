"use client";

import { TPaginationInfo, TPaginationOption } from "~/types";

type PaginationProps = {
  updateOption: (page: number, limit: number) => void;
  option: TPaginationOption;
  paginationInfo: TPaginationInfo;
};

export default function TodoPagination({
  option,
  updateOption,
  paginationInfo
}: PaginationProps) {
  const renderPageButtons = () => {
    const totalPages = paginationInfo.pageSize;
    const currentPage = option.page;
    const delta = 1; // Change delta to 1 to show only 3 items in the middle
    const range = [];
    const rangeWithDots = [];

    if (totalPages === 1) {
      return (
        <button
          onClick={() => updateOption(1, option.limit)}
          className="px-3 py-1 rounded-md bg-white border border-1 border-blue-500"
        >
          1
        </button>
      );
    }

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    for (const i of range) {
      rangeWithDots.push(i);
    }

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.map((page, index) => (
      <button
        onClick={() =>
          typeof page === "number" && updateOption(page, option.limit)
        }
        key={index}
        className={`px-3 py-1 rounded-md bg-white border border-1 ${
          page === currentPage ? "border-blue-500" : ""
        }`}
        disabled={typeof page !== "number"}
      >
        {page}
      </button>
    ));
  };

  return <div className="flex gap-1">{renderPageButtons()}</div>;
}
