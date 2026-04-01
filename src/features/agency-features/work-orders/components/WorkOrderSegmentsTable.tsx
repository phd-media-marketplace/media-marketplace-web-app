import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { WorkOrderSegment } from "../types";
import { formatCurrency } from "@/utils/formatters";

interface WorkOrderSegmentsTableProps {
  segments: WorkOrderSegment[];
}

/**
 * WorkOrderSegmentsTable Component
 * Displays work order segments in a detailed table
 */
export function WorkOrderSegmentsTable({ segments }: WorkOrderSegmentsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Segment Details</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Segment Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Ad Type</TableHead>
              <TableHead>Days</TableHead>
              <TableHead>Time Slot</TableHead>
              <TableHead className="text-center">Spots</TableHead>
              <TableHead className="text-right">Unit Rate</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {segments.map((segment) => (
              <TableRow key={segment.segmentId}>
                <TableCell>
                  <div>
                    <div className="font-medium">{segment.segmentName}</div>
                    {segment.programName && (
                      <div className="text-xs text-gray-500">{segment.programName}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{segment.segmentClass}</Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {segment.adType.replace(/_/g, ' ')}
                  {segment.adForm && (
                    <div className="text-xs text-gray-500">{segment.adForm}</div>
                  )}
                </TableCell>
                <TableCell className="text-sm">
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
                </TableCell>
                <TableCell className="text-sm">{segment.timeSlot}</TableCell>
                <TableCell className="text-center font-medium">{segment.totalSpots}</TableCell>
                <TableCell className="text-right">{formatCurrency(segment.unitRate)}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(segment.totalAmount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
