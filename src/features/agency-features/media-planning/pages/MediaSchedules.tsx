import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    ArrowLeft, 
    Download, 
    Calendar, 
    DollarSign, 
    Tv, 
    Radio, 
    Monitor, 
    Building2,
    FileText
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import type { DayOfWeek } from "../types";

const mediaIcons = {
    FM: Radio,
    TV: Tv,
    OOH: Building2,
    DIGITAL: Monitor
};

const dayColors: Record<DayOfWeek, string> = {
    MONDAY: 'bg-blue-100 text-blue-800',
    TUESDAY: 'bg-purple-100 text-purple-800',
    WEDNESDAY: 'bg-green-100 text-green-800',
    THURSDAY: 'bg-yellow-100 text-yellow-800',
    FRIDAY: 'bg-orange-100 text-orange-800',
    SATURDAY: 'bg-pink-100 text-pink-800',
    SUNDAY: 'bg-red-100 text-red-800'
};

export default function MediaSchedules() {
    const location = useLocation();
    const navigate = useNavigate();
    const mediaPlan = location.state?.mediaPlan;

    if (!mediaPlan) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <FileText className="w-16 h-16 text-gray-400" />
                <h2 className="text-2xl font-bold text-gray-900">No Media Plan Found</h2>
                <p className="text-gray-600">Please create a media plan first</p>
                <Button onClick={() => navigate("/agency/media-planning/create")}>
                    Create Media Plan
                </Button>
            </div>
        );
    }

    const calculateWeeks = () => {
        const start = new Date(mediaPlan.startDate);
        const end = new Date(mediaPlan.endDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return Math.ceil(days / 7);
    };

    const weeks = calculateWeeks();
    const weekNumbers = Array.from({ length: weeks }, (_, i) => i + 1);

    // Generate date for each week
    const getWeekDates = (weekNum: number) => {
        const start = new Date(mediaPlan.startDate);
        const weekStart = new Date(start);
        weekStart.setDate(start.getDate() + (weekNum - 1) * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        return {
            start: weekStart.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
            end: weekEnd.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
        };
    };

    // Calculate totals
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const calculateChannelTotal = (channel: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return channel.segments?.reduce((total: number, segment: any) => {
            const totalSpots = segment.spotsPerDay * segment.days.length * weeks;
            return total + (segment.uniteRate * totalSpots);
        }, 0) || 0;
    };

    const calculateGrandTotal = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return mediaPlan.channels?.reduce((total: number, channel: any) => {
            return total + calculateChannelTotal(channel);
        }, 0) || 0;
    };

    const handleExport = () => {
        alert("Export functionality would be implemented here (Excel/PDF export)");
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Media Schedule</h1>
                    <p className="text-gray-600 mt-1">{mediaPlan.CampaignTitle}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                </div>
            </div>

            {/* Campaign Info Card */}
            <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-sm text-gray-600">Client</p>
                        <p className="font-semibold text-gray-900">{mediaPlan.client}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Campaign Period</p>
                        <p className="font-semibold text-gray-900 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(mediaPlan.startDate).toLocaleDateString()} - {new Date(mediaPlan.endDate).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-semibold text-gray-900">{weeks} weeks</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Total Budget</p>
                        <p className="font-semibold text-primary flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {formatCurrency(mediaPlan.budget)}
                        </p>
                    </div>
                    {mediaPlan.objective && (
                        <div>
                            <p className="text-sm text-gray-600">Objective</p>
                            <p className="font-semibold text-gray-900">{mediaPlan.objective}</p>
                        </div>
                    )}
                    {mediaPlan.targetAudience && (
                        <div className="md:col-span-3">
                            <p className="text-sm text-gray-600">Target Audience</p>
                            <p className="font-semibold text-gray-900">{mediaPlan.targetAudience}</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Schedule Tables - One per channel */}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {mediaPlan.channels && mediaPlan.channels.map((channel: any, channelIdx: number) => {
                const Icon = mediaIcons[channel.mediaType as 'FM' | 'TV' | 'OOH' | 'DIGITAL'];
                const channelTotal = calculateChannelTotal(channel);

                return (
                    <Card key={channelIdx} className="p-6 space-y-4">
                        {/* Channel Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Icon className="w-6 h-6 text-primary" />
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{channel.channelName}</h2>
                                    <Badge variant="secondary">{channel.mediaType}</Badge>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Channel Total</p>
                                <p className="text-2xl font-bold text-primary">{formatCurrency(channelTotal)}</p>
                            </div>
                        </div>

                        {/* Schedule Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 p-3 text-left text-sm font-semibold">Program</th>
                                        <th className="border border-gray-300 p-3 text-left text-sm font-semibold">Time</th>
                                        <th className="border border-gray-300 p-3 text-left text-sm font-semibold">Days</th>
                                        <th className="border border-gray-300 p-3 text-center text-sm font-semibold">Rate/Spot</th>
                                        <th className="border border-gray-300 p-3 text-center text-sm font-semibold">Spots/Day</th>
                                        <th className="border border-gray-300 p-3 text-center text-sm font-semibold">Duration</th>
                                        {weekNumbers.map(weekNum => (
                                            <th key={weekNum} className="border border-gray-300 p-3 text-center text-sm font-semibold bg-blue-50">
                                                <div>Week {weekNum}</div>
                                                <div className="text-xs font-normal text-gray-600">
                                                    {getWeekDates(weekNum).start}
                                                </div>
                                            </th>
                                        ))}
                                        <th className="border border-gray-300 p-3 text-center text-sm font-semibold bg-green-50">Total Spots</th>
                                        <th className="border border-gray-300 p-3 text-center text-sm font-semibold bg-primary text-white">Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {channel.segments && channel.segments.map((segment: any, segIdx: number) => {
                                        const spotsPerWeek = segment.spotsPerDay * segment.days.length;
                                        const totalSpots = spotsPerWeek * weeks;
                                        const totalCost = segment.uniteRate * totalSpots;

                                        return (
                                            <tr key={segIdx} className="hover:bg-gray-50">
                                                <td className="border border-gray-300 p-3">
                                                    <div className="font-medium">{segment.programName}</div>
                                                    <div className="text-xs text-gray-600">{segment.segmentType}</div>
                                                </td>
                                                <td className="border border-gray-300 p-3 text-sm">
                                                    {segment.startTime} - {segment.endTime}
                                                </td>
                                                <td className="border border-gray-300 p-3">
                                                    <div className="flex flex-wrap gap-1">
                                                        {segment.days.map((day: DayOfWeek) => (
                                                            <Badge key={day} variant="outline" className={`text-xs ${dayColors[day]}`}>
                                                                {day.substring(0, 3)}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="border border-gray-300 p-3 text-center text-sm">
                                                    {formatCurrency(segment.uniteRate)}
                                                </td>
                                                <td className="border border-gray-300 p-3 text-center font-semibold">
                                                    {segment.spotsPerDay}
                                                </td>
                                                <td className="border border-gray-300 p-3 text-center text-sm">
                                                    {segment.durationSeconds}s
                                                </td>
                                                {weekNumbers.map(weekNum => (
                                                    <td key={weekNum} className="border border-gray-300 p-3 text-center font-semibold text-blue-600">
                                                        {spotsPerWeek}
                                                    </td>
                                                ))}
                                                <td className="border border-gray-300 p-3 text-center font-bold text-green-600">
                                                    {totalSpots}
                                                </td>
                                                <td className="border border-gray-300 p-3 text-center font-bold text-primary">
                                                    {formatCurrency(totalCost)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    
                                    {/* Channel Subtotal Row */}
                                    <tr className="bg-gray-100 font-bold">
                                        <td colSpan={6} className="border border-gray-300 p-3 text-right">
                                            Channel Subtotal
                                        </td>
                                        {weekNumbers.map(weekNum => (
                                            <td key={weekNum} className="border border-gray-300 p-3 text-center">
                                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                {channel.segments?.reduce((sum: number, seg: any) => 
                                                    sum + (seg.spotsPerDay * seg.days.length), 0
                                                )}
                                            </td>
                                        ))}
                                        <td className="border border-gray-300 p-3 text-center text-green-600">
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {channel.segments?.reduce((sum: number, seg: any) => 
                                                sum + (seg.spotsPerDay * seg.days.length * weeks), 0
                                            )}
                                        </td>
                                        <td className="border border-gray-300 p-3 text-center text-primary">
                                            {formatCurrency(channelTotal)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Card>
                );
            })}

            {/* Grand Total Card */}
            <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Campaign Budget</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(mediaPlan.budget)}</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Allocated</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(calculateGrandTotal())}</p>
                    </div>
                    <div className={`text-center p-4 rounded-lg ${mediaPlan.budget - calculateGrandTotal() >= 0 ? 'bg-gray-50' : 'bg-red-50'}`}>
                        <p className="text-sm text-gray-600">Remaining</p>
                        <p className={`text-2xl font-bold ${mediaPlan.budget - calculateGrandTotal() >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                            {formatCurrency(mediaPlan.budget - calculateGrandTotal())}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}