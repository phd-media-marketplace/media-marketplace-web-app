import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ElementType } from "react";
import { formatCurrency } from "@/utils/formatters";
import { Calendar, Eye, Coins, Pencil, Trash2 } from "lucide-react";

export interface StatItem {
  icon: ElementType<{ className?: string }>;
  label: string;
  value: string | number;
  bgColor?: string;
  textColor?: string;
  iconColor?: string;
}

export interface ListCardProps {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  isActive: boolean;
  mediaIcon: ElementType<{ className?: string }>;
  stats: StatItem[];
  
  // Pricing section (optional, for packages)
  totalPrice?: number;
  finalPrice?: number;
  discount?: number;
  
  // Timestamp
  updatedAt: string;
  
  // Actions
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  
  // Optional
  className?: string;
  showPricingSection?: boolean;
}

export default function ListCard({
  id,
  title,
  subtitle,
  description,
  isActive,
  mediaIcon: MediaIcon,
  stats,
  totalPrice,
  finalPrice,
  discount,
  updatedAt,
  onView,
  onEdit,
  onDelete,
  className = "",
  showPricingSection = false,
}: ListCardProps) {
  return (
    <Card
      key={id}
      className={`bg-gray-50 lg:py-4 shadow-sm hover:shadow-xl transition-shadow duration-200 border border-gray-100 ${className}`}
    >
      {/* Header */}
      <CardHeader className="pb-3 bg-linear-to-r from-primary/5 to-secondary/5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <MediaIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {title}
              </CardTitle>
              {subtitle && (
                <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          <Badge
            variant={isActive ? "default" : "secondary"}
            className={`shrink-0 px-2 py-1 text-xs ${
              isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-4 lg:px-4">
        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-1">{description}</p>
        )}

        {/* Statistics Grid */}
        <div className={`grid gap-3 ${stats.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
          {stats.map((stat, index) => {
            const bgColor = stat.bgColor || "bg-blue-100";
            const textColor = stat.textColor || "text-blue-700";
            const StatIcon = stat.icon;

            return (
              <div
                key={`${id}-stat-${index}`}
                className={`${bgColor} p-3 rounded-lg`}
              >
                <div className={`flex items-center gap-2 ${textColor} mb-1`}>
                  <StatIcon className="w-4 h-4" />
                  <span className="text-xs font-medium">{stat.label}</span>
                </div>
                <p className={`text-2xl font-bold ${textColor.replace("text-", "").replace("700", "900")}`}>
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Pricing Section (Optional) */}
        {showPricingSection && (totalPrice !== undefined || finalPrice !== undefined) && (
          <div className="bg-purple-100 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2 ">
                <div className="flex items-center gap-2 text-primary">
                    <Coins className="w-4 h-4" />
                    <span className="text-xs font-medium">Price</span>
                </div>
                {discount && discount > 0 && (
                  <p className="text-xs text-green-600 font-medium">
                    Save {discount}%
                  </p>
                )}

            </div>
            <div className="space-y-1 ">
              {discount && discount > 0 && totalPrice !== undefined && (
                <p className="text-sm text-gray-500 line-through">
                  {formatCurrency(totalPrice)}
                </p>
              )}
              {finalPrice !== undefined && (
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(finalPrice)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-primary/20">
          <Calendar className="w-3 h-3" />
          <span>{updatedAt}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          {onView && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 hover:bg-secondary text-primary border-secondary"
              onClick={onView}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
          )}

          {onEdit && (
            <Button
              variant="default"
              size="sm"
              className="flex-1 text-white bg-primary hover:bg-primary/90"
              onClick={onEdit}
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </Button>
          )}

          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
