import * as React from "react";
import type { UseFormWatch, FieldValues } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Save, Radio, Tv, Monitor, Building2 } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import type { DayOfWeek } from "../types";
import { formatDate} from "@/utils/formatters";

const mediaIcons = {
    FM: Radio,
    TV: Tv,
    OOH: Building2,
    DIGITAL: Monitor
};

interface ReviewStepProps {
    watch: UseFormWatch<FieldValues>;
    totalBudget: number;
    totalAllocated: number;
    remainingBudget: number;
    startDate: string;
    endDate: string;
    channels: unknown[];
    onPrevious: () => void;
}

export default function ReviewStep({
    watch,
    totalBudget,
    totalAllocated,
    remainingBudget,
    startDate,
    endDate,
    channels,
    onPrevious
}: ReviewStepProps) {
    const campaignWeeks = Math.ceil(
        ((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24) + 1) / 7
    );

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-0 px-1 py-6 border border-primary/10 rounded-lg shadow-md"
        >
            <div className="p-6 space-y-6 border-b-2 border-b-primary/10 rounded-none shadow-none bg-gray-50">
                <h2 className="text-xl font-semibold text-primary">Campaign Summary</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    <div>
                        <p className="font-semibold text-gray-900">Campaign Title</p>
                        <p className="text-sm text-gray-700 pt-1">{watch('CampaignTitle')}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">Client</p>
                        <p className="text-sm text-gray-700  pt-1">{watch('client')}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 ">Campaign Period</p>
                        <p className="text-sm text-gray-700  pt-1">
                            {`${formatDate(watch('startDate'))} - ${formatDate(watch('endDate'))}`}
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">Duration</p>
                        <p className="text-sm text-gray-700  pt-1">{campaignWeeks} weeks</p>
                    </div>
                    {watch('objective') && (
                        <div>
                            <p className="font-semibold text-gray-900">Objective</p>
                            <p className="text-sm text-gray-700  pt-1">{String(watch('objective') || '').charAt(0).toUpperCase() + String(watch('objective') || '').slice(1).toLowerCase()}</p>
                        </div>
                    )}
                    {watch('targetAudience') && (
                        <div className="">
                            <p className="font-semibold text-gray-900">Target Audience</p>
                            <p className="text-sm text-gray-700 pt-1">{String(watch('targetAudience') || '').toLowerCase()}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 space-y-4 border-b-2 border-b-primary/10 rounded-none shadow-none bg-gray-50">
                <h2 className="text-xl font-semibold text-primary">Budget Breakdown</h2>
                
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600">Total Budget:</p>
                        <p className="text-base font-bold text-primary">{formatCurrency(totalBudget)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600">Allocated</p>
                        <p className="text-base font-bold text-green-600">{formatCurrency(totalAllocated)}</p>
                    </div>
                    <div className={`flex items-center gap-2 ${remainingBudget >= 0 ? 'bg-gray-50' : 'bg-red-50'}`}>
                        <p className="text-sm text-gray-600">Remaining</p>
                        <p className={`text-base font-bold ${remainingBudget >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                            {formatCurrency(remainingBudget)}
                        </p>
                    </div>
                </div>

                {remainingBudget < 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 font-medium">
                            Warning: Total allocated budget exceeds campaign budget by {formatCurrency(Math.abs(remainingBudget))}
                        </p>
                    </div>
                )}
            </div>

            <Card className="p-4 space-y-4 max-w-240 overflow-x-auto border-none border-primary/20 rounded-none shadow-none bg-gray-50">
                <h2 className="text-xl font-semibold text-primary">Channels & Segments ({channels.length})</h2>
                
                <Table className="min-w-full border border-primary/10 rounded-xl">
                    <TableHeader className="mb-0.5 ">
                        <TableRow className="bg-primary text-white border-2 border-primary/5 ">
                            <TableHead className="">Programme/Station</TableHead>
                            <TableHead className="">Prog Time</TableHead>
                            <TableHead className="">Duration</TableHead>
                            <TableHead className="">Prog. Day</TableHead>
                            <TableHead className=" text-right">Spots</TableHead>
                            <TableHead className="text-right">Unit Rate<br/>(Rate Card)</TableHead>
                            <TableHead className="text-right">Gross Total</TableHead>
                            <TableHead className="text-right">Volume<br/>Disc.</TableHead>
                            <TableHead className="text-right">Agency<br/>Comm.</TableHead>
                            <TableHead className="text-right">Net Unit<br/>Rate</TableHead>
                            <TableHead className="text-right">Total rate<br/>card value</TableHead>
                            <TableHead className="text-right">Total<br/>Negotiated Value</TableHead>
                            <TableHead className="text-center">Mon</TableHead>
                            <TableHead className="text-center">Tue</TableHead>
                            <TableHead className="text-center">Wed</TableHead>
                            <TableHead className="text-center">Thu</TableHead>
                            <TableHead className="text-center">Fri</TableHead>
                            <TableHead className="text-center">Sat</TableHead>
                            <TableHead className="text-center">Sun</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {channels.map((channelData: any, channelIdx: number) => {
                            const channel = channelData as {
                                mediaType: 'FM' | 'TV' | 'OOH' | 'DIGITAL';
                                channelName: string;
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                segments?: Array<Record<string, any>>;
                            };
                            const Icon = mediaIcons[channel.mediaType];
                            
                            // Calculate channel totals
                            let channelTotalSpots = 0;
                            let channelGrossTotal = 0;
                            let channelTotalRateCardValue = 0;
                            let channelTotalNegotiatedValue = 0;
                            
                            return (
                                <React.Fragment key={channelIdx}>
                                    {/* Channel Header Row */}
                                    <TableRow className="bg-primary/20 border-2 border-primary/5 ">
                                        <TableCell colSpan={19} className="font-semibold text-primary">
                                            <div className="flex items-center gap-2">
                                                <Icon className="w-4 h-4" />
                                                <span>{channel.channelName || 'Unnamed Channel'}</span>
                                                <Badge variant="secondary" className="ml-2">{channel.mediaType}</Badge>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    
                                    {/* Segment Rows */}
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {channel.segments && channel.segments.map((segment: Record<string, any>, segIdx: number) => {
                                        const unitRate = Number(segment.unitRate) || 0;
                                        const totalSpots = Number(segment.totalSpots) || 0;
                                        const daysCount = (segment.days as DayOfWeek[])?.length || 0;
                                        const spotsPerDay = totalSpots / daysCount * campaignWeeks;
                                        
                                        // Default values for discounts and commissions (can be made configurable)
                                        const volumeDiscountPercent = 40; // 40%
                                        const agencyCommissionPercent = 0; // 0%
                                        
                                        const grossTotal = unitRate * totalSpots;
                                        const volumeDiscountAmount = (unitRate * volumeDiscountPercent) / 100;
                                        const agencyCommissionAmount = (unitRate * agencyCommissionPercent) / 100;
                                        const netUnitRate = unitRate - volumeDiscountAmount - agencyCommissionAmount;
                                        const totalRateCardValue = grossTotal;
                                        const totalNegotiatedValue = netUnitRate * totalSpots;
                                        
                                        // Accumulate channel totals
                                        channelTotalSpots += totalSpots;
                                        channelGrossTotal += grossTotal;
                                        channelTotalRateCardValue += totalRateCardValue;
                                        channelTotalNegotiatedValue += totalNegotiatedValue;
                                        
                                        // Map days to day of week
                                        const dayMap = {
                                            'MONDAY': 'Mon',
                                            'TUESDAY': 'Tue',
                                            'WEDNESDAY': 'Wed',
                                            'THURSDAY': 'Thu',
                                            'FRIDAY': 'Fri',
                                            'SATURDAY': 'Sat',
                                            'SUNDAY': 'Sun'
                                        };
                                        
                                        const segmentDays = segment.days as DayOfWeek[] || [];
                                        
                                        return (
                                            <TableRow key={segIdx} className="hover:bg-gray-50 text-xs text-gray-700">
                                                <TableCell className="font-medium">
                                                    {(segment.programName as string) || (segment.segmentType.charAt(0).toUpperCase() + segment.segmentType.slice(1).toLowerCase().replace(/_/g, ' ') as string) || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {segment.timeSlot as string || 
                                                     (segment.startTime && segment.endTime ? `${segment.startTime as string} - ${segment.endTime as string}` : '-')}
                                                </TableCell>
                                                <TableCell>
                                                    {(segment.duration as string) || 
                                                     (segment.interviewDuration as string) ||
                                                     (segment.jingleDuration as string) ||
                                                     (segment.preachingDuration as string) ||
                                                     (segment.airtimeSaleDuration as string) ||
                                                     (segment.mediaDuration ? `${segment.mediaDuration as string}s` : '') ||
                                                     '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {segmentDays.map(day => dayMap[day]).join(', ') || '-'}
                                                </TableCell>
                                                <TableCell className="text-right">{totalSpots}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(unitRate)}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(grossTotal)}</TableCell>
                                                <TableCell className="text-right">{volumeDiscountPercent}%</TableCell>
                                                <TableCell className="text-right">{agencyCommissionPercent}%</TableCell>
                                                <TableCell className="text-right">{formatCurrency(netUnitRate)}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(totalRateCardValue)}</TableCell>
                                                <TableCell className="text-right font-semibold">{formatCurrency(totalNegotiatedValue)}</TableCell>
                                                <TableCell className="text-center">{segmentDays.includes('MONDAY' as DayOfWeek) ? spotsPerDay * campaignWeeks : ''}</TableCell>
                                                <TableCell className="text-center">{segmentDays.includes('TUESDAY' as DayOfWeek) ? spotsPerDay * campaignWeeks : ''}</TableCell>
                                                <TableCell className="text-center">{segmentDays.includes('WEDNESDAY' as DayOfWeek) ? spotsPerDay * campaignWeeks : ''}</TableCell>
                                                <TableCell className="text-center">{segmentDays.includes('THURSDAY' as DayOfWeek) ? spotsPerDay * campaignWeeks : ''}</TableCell>
                                                <TableCell className="text-center">{segmentDays.includes('FRIDAY' as DayOfWeek) ? spotsPerDay * campaignWeeks : ''}</TableCell>
                                                <TableCell className="text-center">{segmentDays.includes('SATURDAY' as DayOfWeek) ? spotsPerDay * campaignWeeks : ''}</TableCell>
                                                <TableCell className="text-center">{segmentDays.includes('SUNDAY' as DayOfWeek) ? spotsPerDay * campaignWeeks : ''}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    
                                    {/* Channel Total Row */}
                                    {channel.segments && channel.segments.length > 0 && (
                                        <TableRow className="bg-primary/5 font-semibold border-t-2 border-primary/20">
                                            <TableCell colSpan={4} className="font-bold">
                                                {channel.channelName} Sub Total
                                            </TableCell>
                                            <TableCell className="text-right font-bold">{channelTotalSpots}</TableCell>
                                            <TableCell colSpan={1}></TableCell>
                                            <TableCell className="text-right font-bold">{formatCurrency(channelGrossTotal)}</TableCell>
                                            <TableCell colSpan={3}></TableCell>
                                            <TableCell className="text-right font-bold">{formatCurrency(channelTotalRateCardValue)}</TableCell>
                                            <TableCell className="text-right font-bold text-blue-700">{formatCurrency(channelTotalNegotiatedValue)}</TableCell>
                                            <TableCell colSpan={7}></TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </Card>

            <div className="flex justify-between">
                <Button type="button" onClick={onPrevious} variant="outline" className="border-secondary text-primary hover:bg-secondary/90">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                </Button>
                <Button type="submit" className="bg-primary text-white hover:bg-primary/90" disabled={remainingBudget < 0}>
                    <Save className="w-4 h-4 mr-2" />
                    Create Media Plan
                </Button>
            </div>
        </motion.div>
    );
}
