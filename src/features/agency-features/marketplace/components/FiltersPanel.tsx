import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChevronDown, Filter, X } from "lucide-react";
import type { MarketplaceFilters } from "../types";
import type { MediaType } from "@/types/api";

interface FiltersPanelProps {
    filters: MarketplaceFilters;
    onFilterChange: (filters: MarketplaceFilters) => void;
    onReset: () => void;
}

const mediaTypes: MediaType[] = ["TV", "RADIO", "DIGITAL", "OOH", "TV_RADIO"];
const locations = ["Nationwide", "Greater Accra", "Kumasi", "Accra - Circle", "Accra - Airport Road", "Accra & Kumasi"];
const timeSlots = [
    "Morning Drive (06:00-10:00)",
    "Morning (06:00-09:00)",
    "Afternoon (14:00-17:00)",
    "Evening Drive (16:00-19:00)",
    "Prime Time (18:00-22:00)",
    "Late Night (22:00-01:00)",
    "Weekend (10:00-18:00)",
    "All Day"
];

export default function FiltersPanel({ filters, onFilterChange, onReset }: FiltersPanelProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const handleMediaTypeToggle = (type: MediaType) => {
        onFilterChange({
            ...filters,
            mediaType: filters.mediaType === type ? undefined : type
        });
    };

    const handleLocationChange = (location: string) => {
        onFilterChange({
            ...filters,
            location: location === "all" ? undefined : location
        });
    };

    const handleTimeOfDayChange = (timeOfDay: string) => {
        onFilterChange({
            ...filters,
            timeOfDay: timeOfDay === "all" ? undefined : timeOfDay
        });
    };

    const handlePriceChange = (type: 'min' | 'max', value: string) => {
        const numValue = value === '' ? undefined : parseFloat(value);
        onFilterChange({
            ...filters,
            [type === 'min' ? 'minCost' : 'maxCost']: numValue
        });
    };

    const activeFiltersCount = [
        filters.mediaType,
        filters.location,
        filters.timeOfDay,
        filters.minCost,
        filters.maxCost
    ].filter(Boolean).length;

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-linear-to-r from-primary/5 to-secondary/5">
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                    {activeFiltersCount > 0 && (
                        <Badge className="bg-primary text-white">
                            {activeFiltersCount}
                        </Badge>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {activeFiltersCount > 0 && (
                        <Button
                            size="sm"
                            onClick={onReset}
                            className="text-gray-600 hover:text-gray-900 bg-transparent hover:bg-gray-100 hover:border-gray-400 transition-colors duration-300"
                        >
                            <X className="w-4 h-4 mr-1" />
                            Clear All
                        </Button>
                    )}
                    <Button
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-gray-600 bg-transparent hover:bg-secondary hover:border-gray-400 transition-colors duration-300"
                    >
                        {isExpanded ? <ChevronDown/> : <ChevronDown className="rotate-180"/>}
                    </Button>
                </div>
            </div>

            {/* Filter Content */}
            {isExpanded && (
                <div className="p-4 space-y-6">
                    {/* Media Type Filter */}

                    {/* Location and Time Filter Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-gray-700">
                                Media Type
                            </label>
                            {/* <div className="flex flex-wrap gap-2">
                                {mediaTypes.map((type) => (
                                    <Badge
                                        key={type}
                                        onClick={() => handleMediaTypeToggle(type)}
                                        className={`cursor-pointer px-3 py-1.5 transition-all ${
                                            filters.mediaType === type
                                                ? 'bg-primary text-white hover:bg-primary/90'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {type.replace('_', ' ')}
                                    </Badge>
                                ))}
                            </div> */}
                            <Select
                                value={filters.mediaType || "all"}
                                onValueChange={handleMediaTypeToggle}
                            >
                                <SelectTrigger className="w-full border border-gray-200">
                                    <SelectValue placeholder="All Media Types" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-none shadow-lg">
                                    <SelectItem value="all">All Media Types</SelectItem>
                                    {mediaTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type.replace('_', ' ')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Location Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Location
                            </label>
                            <Select
                                value={filters.location || "all"}
                                onValueChange={handleLocationChange}
                            >
                                <SelectTrigger className="w-full border border-gray-200">
                                    <SelectValue placeholder="All Locations" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-none shadow-lg">
                                    <SelectItem value="all">All Locations</SelectItem>
                                    {locations.map((location) => (
                                        <SelectItem key={location} value={location}>
                                            {location}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Time of Day Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Time of Day
                            </label>
                            <Select
                                value={filters.timeOfDay || "all"}
                                onValueChange={handleTimeOfDayChange}
                            >
                                <SelectTrigger className="w-full border border-gray-200">
                                    <SelectValue placeholder="All Times" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-none shadow-lg">
                                    <SelectItem value="all">All Times</SelectItem>
                                    {timeSlots.map((slot) => (
                                        <SelectItem key={slot} value={slot}>
                                            {slot}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Price Range Filter */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-gray-700">
                                Price Range (₵)
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    {/* <label className="text-xs text-gray-500">Min Price</label> */}
                                    <Input
                                        type="number"
                                        placeholder="Min Price"
                                        value={filters.minCost || ''}
                                        onChange={(e) => handlePriceChange('min', e.target.value)}
                                        className="w-full border border-gray-200"
                                        min="0"
                                    />
                                </div>
                                <div className="space-y-1">
                                    {/* <label className="text-xs text-gray-500">Max Price</label> */}
                                    <Input
                                        type="number"
                                        placeholder="Max Price"
                                        value={filters.maxCost || ''}
                                        onChange={(e) => handlePriceChange('max', e.target.value)}
                                        className="w-full border border-gray-200"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}