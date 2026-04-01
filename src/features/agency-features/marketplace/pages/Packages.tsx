import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import PackageCard from "../components/PackageCard";
import FiltersPanel from "../components/FiltersPanel";
import Pagination from "../components/Pagination";
import { dummyMediaPackages } from "../dummy-data";
import type { MarketplaceFilters } from "../types";
// import type { MediaPackage } from "../types";

const ITEMS_PER_PAGE = 9;

export default function Packages() {
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<MarketplaceFilters>({
        page: 1,
        limit: ITEMS_PER_PAGE
    });

    // Filter packages based on active filters
    const filteredPackages = useMemo(() => {
        return dummyMediaPackages.filter((pkg) => {
            // Media type filter
            if (filters.mediaType && pkg.mediaType !== filters.mediaType) {
                return false;
            }

            // Location filter
            if (filters.location && pkg.location !== filters.location) {
                return false;
            }

            // Price range filter (using finalPrice from new structure)
            const finalCost = pkg.finalPrice;
                
            if (filters.minCost && finalCost < filters.minCost) {
                return false;
            }
            
            if (filters.maxCost && finalCost > filters.maxCost) {
                return false;
            }

            return true;
        });
    }, [filters]);

    // Paginate filtered packages
    const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE);
    const paginatedPackages = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredPackages.slice(startIndex, endIndex);
    }, [filteredPackages, currentPage]);

    const handleFilterChange = (newFilters: MarketplaceFilters) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleResetFilters = () => {
        setFilters({
            page: 1,
            limit: ITEMS_PER_PAGE
        });
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-primary tracking-tight">
                    Media Marketplace
                </h2>
                <p className="text-gray-600">
                    Discover and purchase affordable media packages across Ghana's media landscape.
                </p>
            </div>

            {/* Filters Panel */}
            <FiltersPanel 
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
            />

            {/* Results count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    {filteredPackages.length === dummyMediaPackages.length ? (
                        <>Showing all <span className="font-semibold text-gray-900">{filteredPackages.length}</span> packages</>
                    ) : (
                        <>Found <span className="font-semibold text-gray-900">{filteredPackages.length}</span> packages</>
                    )}
                </p>
            </div>

            {/* Package Cards Grid */}
            {paginatedPackages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedPackages.map((pkg, index) => (
                        <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <PackageCard mediaPackage={pkg} />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="text-center space-y-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                            <svg 
                                className="w-12 h-12 text-gray-400" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No packages found
                            </h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Try adjusting your filters to see more results
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {filteredPackages.length > ITEMS_PER_PAGE && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={filteredPackages.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                />
            )}
        </div>
    );
}
