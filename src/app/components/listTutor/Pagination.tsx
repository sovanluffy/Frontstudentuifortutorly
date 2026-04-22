import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
      >
        <ChevronLeft size={16} />
        Prev
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 text-sm rounded-md border transition ${
              currentPage === page
                ? "bg-blue-600 text-white border-blue-600"
                : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
}