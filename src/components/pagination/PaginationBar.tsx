"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationBar({
  page, totalPages, total, limit, onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between pt-[16px] flex-wrap gap-[12px]" style={{ fontFamily: "Poppins, sans-serif" }}>
      <span className="text-[12px]" style={{ color: "#888" }}>
        Showing {from}–{to} of {total}
      </span>
      <div className="flex items-center gap-[4px]">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="flex items-center justify-center w-[32px] h-[32px] rounded-lg border-none cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: page <= 1 ? "#F0F0F0" : "#35319B", color: page <= 1 ? "#AAA" : "white" }}
        >
          <ChevronLeft size={15} />
        </button>

        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
          let pageNum: number;
          if (totalPages <= 7) {
            pageNum = i + 1;
          } else if (page <= 4) {
            pageNum = i + 1;
          } else if (page >= totalPages - 3) {
            pageNum = totalPages - 6 + i;
          } else {
            pageNum = page - 3 + i;
          }
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className="flex items-center justify-center min-w-[32px] h-[32px] px-[6px] rounded-lg border-none cursor-pointer text-[13px] font-medium transition-all"
              style={{
                background: pageNum === page ? "#35319B" : "transparent",
                color: pageNum === page ? "white" : "#888",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex items-center justify-center w-[32px] h-[32px] rounded-lg border-none cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: page >= totalPages ? "#F0F0F0" : "#35319B", color: page >= totalPages ? "#AAA" : "white" }}
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
