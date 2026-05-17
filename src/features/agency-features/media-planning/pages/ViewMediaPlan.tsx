import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle,CardContent } from '@/components/ui/card';
import { ArrowLeft, Edit, Send, Play,} from 'lucide-react';
import { dummyMediaPlans } from '../dummy-data';
import type { Channel, ChannelFormData, DayOfWeek, MediaPlan, Segment, SegmentFormData } from '../types';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';
import Header from '@/components/universal/Header';
import BudgetSummary from '../components/BudgetSummary';
import { campaignWeeks, calculateAggregatedDiscount } from '../helperFunction';
import { DataTable } from '@/components/universal/DataTable';
import type { UniversalDataTableColumn } from '@/components/universal/DataTable';
import NoDataCard from '@/components/universal/NoDataCard';
import { getStatusColor, getStatusLabel } from '../helperFunction';

interface ReviewRow {
  channelName: string;
  mediaType?: string;
  programName: string;
  timeSlot: string;
  duration: string;
  days?: DayOfWeek[];
  totalSpots: number;
  unitRate: number;
  grossTotal: number;
  discount?: number;
  netTotal: number;
  spotsPerDay?: Partial<Record<DayOfWeek, number>>;
}

const reviewColumns: UniversalDataTableColumn<ReviewRow>[] = [
  {
    id: 'program',
    header: 'Programme/Station',
    accessor: 'programName',
    sticky: true,
    stickyLeft: 0,
    widthPx: 320,
    headerClassName: 'whitespace-nowrap',
    cellClassName: 'whitespace-nowrap',
  },
  {
    id: 'time',
    header: 'Prog Time',
    accessor: 'timeSlot',
    widthPx: 140,
    headerClassName: 'whitespace-nowrap',
    cellClassName: 'whitespace-nowrap',
  },
  {
    id: 'duration',
    header: 'Duration',
    accessor: 'duration',
    widthPx: 120,
    headerClassName: 'whitespace-nowrap',
    cellClassName: 'whitespace-nowrap',
  },
  {
    id: 'days',
    header: 'Prog. Day',
    cell: (row) => (row.days || []).map((day: DayOfWeek) => day.substring(0, 3)).join(', '),
    widthPx: 160,
    headerClassName: 'whitespace-nowrap',
    cellClassName: 'whitespace-nowrap',
  },
  {
    id: 'spots',
    header: 'Spots',
    accessor: 'totalSpots',
    align: 'right',
    widthPx: 80,
    headerClassName: 'whitespace-nowrap',
    cellClassName: 'whitespace-nowrap',
  },
  {
    id: 'unitRate',
    header: 'Unit Rate (Rate Card)',
    cell: (row) => formatCurrency(row.unitRate),
    align: 'right',
    widthPx: 120,
    headerClassName: 'whitespace-nowrap',
    cellClassName: 'whitespace-nowrap',
  },
  {
    id: 'gross',
    header: 'Gross Total',
    cell: (row) => formatCurrency(row.grossTotal),
    align: 'right',
    widthPx: 120,
    headerClassName: 'whitespace-nowrap',
    cellClassName: 'whitespace-nowrap',
  },
  {
    id: 'Disc',
    header: 'Disc. %',
    cell: (row) => `${row.discount}%`,
    align: 'right',
    widthPx: 90,
    headerClassName: 'whitespace-nowrap',
    cellClassName: 'whitespace-nowrap',
  },
  {
    id: 'netTotal',
    header: 'Net Total',
    cell: (row) => formatCurrency(row.netTotal),
    align: 'right',
    widthPx: 120,
    headerClassName: 'whitespace-nowrap',
    cellClassName: 'whitespace-nowrap',
  },
  {
    id: 'mon',
    header: 'Mon',
    cell: (row) => (row.spotsPerDay?.MONDAY ? row.spotsPerDay.MONDAY : ''),
    align: 'center',
    widthPx: 70,
    headerClassName: 'whitespace-nowrap',
    cellClassName: 'whitespace-nowrap',
  },
  {
    id: 'tue',
    header: 'Tue',
    cell: (row) => (row.spotsPerDay?.TUESDAY ? row.spotsPerDay.TUESDAY : ''),
    align: 'center',
    widthPx: 70,
    headerClassName: 'whitespace-nowrap',
    cellClassName: 'whitespace-nowrap',
  },
  {
    id: 'wed',
    header: 'Wed',
    cell: (row) => (row.spotsPerDay?.WEDNESDAY ? row.spotsPerDay.WEDNESDAY : ''),
    align: 'center',
    widthPx: 70,
    headerClassName: 'whitespace-nowrap',
    cellClassName: 'whitespace-nowrap',
  },
  {
    id: 'thu',
    header: 'Thu',
    cell: (row) => (row.spotsPerDay?.THURSDAY ? row.spotsPerDay.THURSDAY : ''),
    align: 'center',
    widthPx: 70,
    headerClassName: 'whitespace-nowrap',
    cellClassName: 'whitespace-nowrap',
  },
  {
    id: 'fri',
    header: 'Fri',
    cell: (row) => (row.spotsPerDay?.FRIDAY ? row.spotsPerDay.FRIDAY : ''),
    align: 'center',
    widthPx: 70,
    headerClassName: 'whitespace-nowrap',
    cellClassName: 'whitespace-nowrap',
  },
  {
    id: 'sat',
    header: 'Sat',
    cell: (row) => (row.spotsPerDay?.SATURDAY ? row.spotsPerDay.SATURDAY : ''),
    align: 'center',
    widthPx: 70,
    headerClassName: 'whitespace-nowrap',
    cellClassName: 'whitespace-nowrap',
  },
  {
    id: 'sun',
    header: 'Sun',
    cell: (row) => (row.spotsPerDay?.SUNDAY ? row.spotsPerDay.SUNDAY : ''),
    align: 'center',
    widthPx: 70,
    headerClassName: 'whitespace-nowrap',
    cellClassName: 'whitespace-nowrap',
  },
];

const buildReviewRows = (channel: Channel | ChannelFormData): ReviewRow[] => {
  const rows: ReviewRow[] = [];

  (channel.segments || []).forEach((segment: Segment | SegmentFormData) => {
    const unitRate = Number(segment.unitRate) || 0;
    const totalSpots = Number(segment.totalSpots) || 0;
    const segmentDiscount = 'discount' in segment ? (segment.discount ?? 0) : 0;
    const grossTotal = unitRate * totalSpots;
    const discountAmount = (segmentDiscount / 100) * grossTotal;
    const netTotal = grossTotal - discountAmount;

    const programName = segment.programName || '';
    const timeSlot = 'timeSlot' in segment && segment.timeSlot
      ? segment.timeSlot
      : 'startTime' in segment && segment.startTime
        ? `${(segment as SegmentFormData).startTime} - ${(segment as SegmentFormData).endTime}`
        : '';

    const duration = 'duration' in segment && segment.duration
      ? segment.duration
      : 'durationSeconds' in segment && (segment as SegmentFormData).durationSeconds
        ? `${(segment as SegmentFormData).durationSeconds} seconds`
        : '';

    rows.push({
      channelName: channel.channelName,
      mediaType: channel.mediaType,
      programName,
      timeSlot,
      duration,
      days: segment.days || [],
      totalSpots,
      unitRate,
      grossTotal,
      discount: segmentDiscount,
      netTotal,
      spotsPerDay: 'spotsPerDay' in segment ? segment.spotsPerDay : {},
    });
  });

  return rows;
};


export default function ViewMediaPlan() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState<MediaPlan['status'] | null>(null);
  const { user } = useAuthStore();

  // Find the media plan by ID
  const mediaPlan = useMemo(() => {
    return dummyMediaPlans.find(plan => plan.id === id);
  }, [id]);

  // Use current status if updated, otherwise use plan's status
  const displayStatus = currentStatus || mediaPlan?.status || 'DRAFT';

  // If plan not found
  if (!mediaPlan) {
    return (
      <div className="container mx-auto py-12">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Media Plan Not Found</h2>
          <p className="text-gray-600 mb-6">This media plan does not exist or has been removed.</p>
          <Button onClick={() => navigate(`/${user?.tenantType}/media-planning/plans`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Media Plans
          </Button>
        </Card>
      </div>
    );
  }

  // Calculate total budget spent by summing up all segments
  const calculateTotalSpent = () => {
    let total = 0;
    mediaPlan.channels.forEach((channel) => {
      channel.segments?.forEach((segment) => {
        total += segment.unitRate * segment.totalSpots;
      });
    });
    return total;
  };

  const totalSpent = calculateTotalSpent();
  const budgetRemaining = mediaPlan.totalBudget - totalSpent;

  // Handle actions
  const handleEdit = () => {
    // Navigate to edit page
      navigate(`/${user?.tenantType}/media-planning/plans/${id}/edit`);
   
  };

  const canEditPlan = mediaPlan && !["APPROVED", "REVISED"].includes(mediaPlan.status);
  const isCompletedPlan = mediaPlan?.status === "COMPLETED";

  const handleSendToApproval = () => {
    // Update status to pending_approval
    setCurrentStatus('PENDING_APPROVAL');
    // TODO: Call API to update status
    alert('Media plan sent to approval successfully!');
  };

  const handlePayAndGenerateWO = () => {
    
    toast.success('Work order generated and payment processed successfully!');
  };

  const campaignDuration = campaignWeeks(new Date(mediaPlan.expectedStartDate), new Date(mediaPlan.expectedEndDate));
  const {  totalDiscountAmount, effectiveDiscountPercent } = calculateAggregatedDiscount(mediaPlan.channels);


  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header with Back Button */}
      <Header
        title = {mediaPlan.campaignName}
        description = "Campaign Details and Media Plan"
        returnTofunc={() => navigate(`/${user?.tenantType}/media-planning/plans`)}
        ctaFunc={handleEdit}
        ctabtnText={isCompletedPlan ? "Create from This Plan" : "Edit Plan"}
        ctaIcon={Edit}
        
      />

      <Card className="">
        <Card className={`${getStatusColor(displayStatus)}`}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <p className="text-lg font-semibold">Status:</p>
                <Badge variant="outline" className={`${getStatusColor(displayStatus)}`}>
                  {getStatusLabel(displayStatus)}
                </Badge>
              </div>
              {displayStatus === 'APPROVED' && (
                <div className="text-sm text-gray-600">
                  Approved on {new Date(mediaPlan.updatedAt!).toLocaleDateString()} by {mediaPlan.approvedBy}
                </div>
              )}
              {displayStatus === 'REJECTED' && mediaPlan.rejectionReason && (
                <div className="text-sm text-red-600 max-w-md">
                  <strong>Reason:</strong> {mediaPlan.rejectionReason}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        {/* Campaign Overview */}
        <Card className="space-y-2 ">
          <CardHeader className="border-b border-violet-100 [.border-b]:pb-1 ">
            <CardTitle className="text-primary text-lg font-bold">Campaign Information</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
              <div className="rounded-md bg-violet-50/30 p-2 ">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-violet-700/80">Campaign Name</p>
                <p className="mt-1 break-all font-medium text-violet-950">{mediaPlan.campaignName}</p>
              </div>
              <div className="rounded-md bg-indigo-50/30 p-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-700/80">Brand/Client</p>
                <p className="mt-1 break-all font-medium text-indigo-950">{mediaPlan.clientName}</p>
              </div>
              <div className="rounded-md bg-green-50/30 p-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-green-700/80">Campaign Period</p>
                <p className="mt-1 font-medium text-green-950">{formatDate(mediaPlan.expectedStartDate)} - {formatDate(mediaPlan.expectedEndDate)}</p>
              </div>
              <div className="rounded-md bg-blue-50/30 p-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-700/80">Duration</p>
                <p className="mt-1 font-medium text-blue-950">{campaignDuration} weeks</p>
              </div>
              <div className="rounded-md bg-cyan-50/30 p-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-700/80">Campaign Objective</p>
                <p className="mt-1 font-medium text-cyan-950">{mediaPlan.campaignObjective}</p>
              </div>
              
              <div className="rounded-md bg-amber-50/30 p-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-700/80">Target Audience</p>
                <p className="mt-1 font-medium text-amber-950">{mediaPlan.targetAudience}</p>
              </div>
              <div className="rounded-md bg-lime-50/30 p-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-lime-700/80">Created At</p>
                <p className="mt-1 font-medium text-lime-950">{formatDate(mediaPlan.createdAt!)}</p>
              </div>
              <div className="rounded-md bg-gray-50/30 p-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-700/80">Last Updated</p>
                <p className="mt-1 font-medium text-gray-950">{formatDate(mediaPlan.updatedAt!)}</p>
              </div>
              
          </div>

        </Card>

        {/* Channels and Segments */}
        <div className="py-6 px-4 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Channels & Segments</h2>
          <hr className="border-primary/10 mb-2" />
          <div className="space-y-6 bg-gray-50 p-2">
            {mediaPlan.channels.map((channel, channelIndex: number) => {
              const rows = buildReviewRows(channel);

              return (
                <div key={channelIndex} className="">
                  <div className="flex items-center justify-between mb-4">
                    <div className='w-full flex items-center justify-between'>
                      <h3 className="text-lg font-semibold text-gray-900">{channel.channelName}</h3>
                      <Badge variant="outline" className="mt-1">{channel.mediaType}</Badge>
                    </div>
                  </div>

                  <DataTable
                    rows={rows}
                    columns={reviewColumns}
                    rowKey={(row, rowIndex) => `${row.channelName}-${row.programName}-${rowIndex}`}
                    minTableWidthClassName="min-w-[1600px]"
                    emptyState={
                      <NoDataCard
                        title="No segments added"
                        message="Add media channels and segments in the previous steps to see the campaign summary here."
                      />
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>

        <BudgetSummary 
            totalBudget={mediaPlan.totalBudget}
            totalAllocated={totalSpent}
            remainingBudget={budgetRemaining}
            startDate={mediaPlan.expectedStartDate}
            endDate={mediaPlan.expectedEndDate}
            discount={effectiveDiscountPercent}
            discountAmount={totalDiscountAmount}
            className=" bg-slate-50/20 rounded-none"
        />
      </Card>

      {/* Action Buttons */}
        <Card className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* {canEditPlan && (
              <Button onClick={handleEdit} className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                {isCompletedPlan ? "Create from This Plan" : "Edit Plan"}
              </Button>
            )} */}

            {!canEditPlan && (
              <div className="text-sm text-gray-600">
                This {getStatusLabel(displayStatus).toLowerCase()} plan cannot be edited.
              </div>
            )}

            {(displayStatus === 'DRAFT' || displayStatus === 'PENDING_APPROVAL') && (
              <Button onClick={handleSendToApproval} variant="outline" className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                {`${displayStatus==='PENDING_APPROVAL' ? 'Resend for Approval' : 'Send for Approval'}`}
              </Button>
            )}

            {displayStatus === 'APPROVED' && (
              <Button onClick={handlePayAndGenerateWO} variant="outline" className="flex items-center gap-2 bg-green-50 hover:bg-green-100">
                <Play className="w-4 h-4" />
                Pay and Generate Work Order
              </Button>
            )}
          </div>
        </Card>
    </div>
  );
}
