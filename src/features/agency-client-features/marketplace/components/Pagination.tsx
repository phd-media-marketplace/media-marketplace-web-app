import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems?: number;
    itemsPerPage?: number;
}

export default function Pagination({ 
    currentPage, 
    totalPages, 
    onPageChange,
    totalItems,
    itemsPerPage 
}: PaginationProps) {
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const showPages = 5; // Number of page buttons to show
        
        if (totalPages <= showPages) {
            // Show all pages if total is less than showPages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);
            
            if (currentPage > 3) {
                pages.push('...');
            }
            
            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            if (currentPage < totalPages - 2) {
                pages.push('...');
            }
            
            // Always show last page
            pages.push(totalPages);
        }
        
        return pages;
    };

    const startItem = totalItems && itemsPerPage 
        ? (currentPage - 1) * itemsPerPage + 1 
        : null;
    const endItem = totalItems && itemsPerPage 
        ? Math.min(currentPage * itemsPerPage, totalItems) 
        : null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-md border border-gray-200">
            {/* Items info */}
            <div className="text-sm text-gray-600">
                {totalItems && startItem && endItem ? (
                    <span>
                        Showing <span className="font-medium text-gray-900">{startItem}</span> to{' '}
                        <span className="font-medium text-gray-900">{endItem}</span> of{' '}
                        <span className="font-medium text-gray-900">{totalItems}</span> packages
                    </span>
                ) : (
                    <span>
                        Page <span className="font-medium text-gray-900">{currentPage}</span> of{' '}
                        <span className="font-medium text-gray-900">{totalPages}</span>
                    </span>
                )}
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-1">
                {/* First page */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="hidden sm:flex border-gray-200"
                >
                    <ChevronsLeft className="w-4 h-4" />
                </Button>

                {/* Previous page */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-gray-200"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1">Previous</span>
                </Button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => {
                        if (page === '...') {
                            return (
                                <span 
                                    key={`ellipsis-${index}`}
                                    className="px-2 text-gray-400"
                                >
                                    ...
                                </span>
                            );
                        }
                        
                        return (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange(page as number)}
                                className={currentPage === page 
                                    ? "bg-primary text-white hover:bg-primary/90" 
                                    : "hover:bg-gray-100 border-gray-200"
                                }
                            >
                                {page}
                            </Button>
                        );
                    })}
                </div>

                {/* Next page */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-gray-200"
                >
                    <span className="hidden sm:inline mr-1">Next</span>
                    <ChevronRight className="w-4 h-4" />
                </Button>

                {/* Last page */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="hidden sm:flex border-gray-200"
                >
                    <ChevronsRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
