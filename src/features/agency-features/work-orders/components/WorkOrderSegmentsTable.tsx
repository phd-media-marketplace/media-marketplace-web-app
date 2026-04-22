import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WorkOrderSegment } from "../types";
import { formatCurrency } from "@/utils/formatters";
import { DataTable } from "@/components/universal/DataTable";
import { useMemo } from "react";
import type { UniversalDataTableColumn } from "@/components/universal/DataTable";

interface WorkOrderSegmentsTableProps {
  segments: WorkOrderSegment[];
}

/**
 * WorkOrderSegmentsTable Component
 * Displays work order segments in a detailed table using UniversalDataTable
 */
export function WorkOrderSegmentsTable({ segments }: WorkOrderSegmentsTableProps) {
  const columns = useMemo<UniversalDataTableColumn<WorkOrderSegment>[]>(() => {
    return [
      {
        id: "segmentName",
        header: "Segment Name",
        cell: (segment: WorkOrderSegment) => (
          <div>
            <div className="font-medium">{segment.segmentName}</div>
            {segment.programName && (
              <div className="text-xs text-gray-500">{segment.programName}</div>
            )}
          </div>
        ),
        widthPx: 140,
        minWidthPx: 140,
        widthClassName: "w-36",
        minWidthClassName: "min-w-36",
      },
      {
        id: "segmentClass",
        header: "Segment",
        cell: (segment: WorkOrderSegment) => (
          <Badge variant="outline">{segment.segmentClass}</Badge>
        ),
        widthPx: 80,
        minWidthPx: 80,
        widthClassName: "w-20",
        minWidthClassName: "min-w-20",
      },
      {
        id: "adType",
        header: "Ad Type",
        cell: (segment: WorkOrderSegment) => (
          <div className="text-sm">
            {segment.adType.replace(/_/g, ' ')}
            {segment.adForm && (
              <div className="text-xs text-gray-500">{segment.adForm}</div>
            )}
          </div>
        ),
        widthPx: 140,
        minWidthPx: 140,
        widthClassName: "w-36",
        minWidthClassName: "min-w-36",
      },
      {
        id: "days",
        header: "Days",
        cell: (segment: WorkOrderSegment) => (
          <div className="flex flex-wrap gap-1">
            {segment.days.slice(0, 3).map(day => (
              <Badge key={day} variant="outline" className="text-xs">
                {day.slice(0, 3)}
              </Badge>
            ))}
            {segment.days.length > 3 && (
              <Badge variant="outline" className="text-xs">+{segment.days.length - 3}</Badge>
            )}
          </div>
        ),
        widthPx: 200,
        minWidthPx: 200,
        widthClassName: "w-48",
        minWidthClassName: "min-w-48",
      },
      {
        id: "timeSlot",
        header: "Time Slot",
        cell: (segment: WorkOrderSegment) => segment.timeSlot,
        widthPx: 150,
        minWidthPx: 150,
        widthClassName: "w-40",
        minWidthClassName: "min-w-40",
      },
      {
        id: "totalSpots",
        header: "Spots",
        cell: (segment: WorkOrderSegment) => segment.totalSpots,
        align: "center",
        headerAlign: "center",
        widthPx: 80,
        minWidthPx: 80,
        widthClassName: "w-20",
        minWidthClassName: "min-w-20",
        cellClassName: "font-medium",
      },
      {
        id: "unitRate",
        header: "Unit Rate",
        cell: (segment: WorkOrderSegment) => formatCurrency(segment.unitRate),
        align: "right",
        headerAlign: "right",
        widthPx: 110,
        minWidthPx: 110,
        widthClassName: "w-28",
        minWidthClassName: "min-w-28",
      },
      {
        id: "totalAmount",
        header: "Total Amount",
        cell: (segment: WorkOrderSegment) => formatCurrency(segment.totalAmount),
        align: "right",
        headerAlign: "right",
        widthPx: 120,
        minWidthPx: 120,
        widthClassName: "w-32",
        minWidthClassName: "min-w-32",
        cellClassName: "font-medium",
      },
    ];
  }, []);

  return (
    <Card className="border border-gray-100 shadow-xs rounded">
      <CardHeader className="border-b border-violet-100 [.border-b]:pb-1 ">
        <CardTitle className="text-primary text-lg font-bold">Segment Details</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <DataTable
          rows={segments}
          columns={columns}
          rowKey={(segment: WorkOrderSegment) => segment.segmentId}
          emptyState={<p className="text-gray-500">No segments found</p>}
        />
      </CardContent>
    </Card>
  );
}
