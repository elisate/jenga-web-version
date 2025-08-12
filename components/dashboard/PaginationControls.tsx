import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  isLoading,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalCount);
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= maxVisiblePages; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-between items-center p-6 border-t border-gray-100">
      <div className="text-sm text-gray-600">
        Showing {startItem} to {endItem} of {totalCount} valuations
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={currentPage === 1 || isLoading}
          onClick={() => onPageChange(1)}
          className="border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          First
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={currentPage === 1 || isLoading}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNum) => (
            <Button
              key={pageNum}
              size="sm"
              variant={currentPage === pageNum ? "default" : "outline"}
              disabled={isLoading}
              onClick={() => onPageChange(pageNum)}
              className={
                currentPage === pageNum
                  ? "bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              }
            >
              {pageNum}
            </Button>
          ))}
        </div>

        <Button
          size="sm"
          variant="outline"
          disabled={currentPage === totalPages || isLoading}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={currentPage === totalPages || isLoading}
          onClick={() => onPageChange(totalPages)}
          className="border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Last
        </Button>
      </div>
    </div>
  );
}
