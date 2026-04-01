import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Edit, Send, Play, Pause, CheckCircle } from 'lucide-react';
import { dummyMediaPlans } from '../dummy-data';
import type { MediaPlan } from '../types';

// Helper functions for status badges (same as MediaPlansList)
const getStatusColor = (status: MediaPlan['status']) => {
  const colors = {
    draft: 'bg-gray-100 text-gray-700',
    active: 'bg-green-100 text-green-700',
    paused: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
    pending_approval: 'bg-purple-100 text-purple-700',
    approved: 'bg-emerald-100 text-emerald-700',
  };
  return colors[status] || colors.draft;
};

const getStatusLabel = (status: MediaPlan['status']) => {
  const labels = {
    draft: 'Draft',
    active: 'Active',
    paused: 'Paused',
    completed: 'Completed',
    cancelled: 'Cancelled',
    pending_approval: 'Pending Approval',
    approved: 'Approved',
  };
  return labels[status] || status;
};

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
};

// Format currency
const formatCurrency = (amount: number) => {
  return `GH₵ ${amount.toLocaleString('en-GH')}`;
};

export default function ViewMediaPlan() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState<MediaPlan['status'] | null>(null);

  // Find the media plan by ID
  const mediaPlan = useMemo(() => {
    return dummyMediaPlans.find(plan => plan.id === id);
  }, [id]);

  // Use current status if updated, otherwise use plan's status
  const displayStatus = currentStatus || mediaPlan?.status || 'draft';

  // If plan not found
  if (!mediaPlan) {
    return (
      <div className="container mx-auto py-12">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Media Plan Not Found</h2>
          <p className="text-gray-600 mb-6">This media plan does not exist or has been removed.</p>
          <Button onClick={() => navigate('/agency/media-planning/plans')}>
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
  const budgetUsagePercentage = (totalSpent / mediaPlan.totalBudget) * 100;

  // Handle actions
  const handleEdit = () => {
    // TODO: Navigate to edit page or enable edit mode
    navigate(`/agency/media-planning/plans/${id}/edit`);
  };

  const handleSendToApproval = () => {
    // Update status to pending_approval
    setCurrentStatus('pending_approval');
    // TODO: Call API to update status
    alert('Media plan sent to approval successfully!');
  };

  const handleActivate = () => {
    setCurrentStatus('active');
    alert('Media plan activated successfully!');
  };

  const handlePause = () => {
    setCurrentStatus('paused');
    alert('Media plan paused successfully!');
  };

  const handleComplete = () => {
    setCurrentStatus('completed');
    alert('Media plan marked as completed!');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/agency/media-planning/plans')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{mediaPlan.campaignName}</h1>
          <p className="text-gray-600 mt-1">Campaign Details and Media Plan</p>
        </div>
        <Badge className={`${getStatusColor(displayStatus)} px-4 py-2 text-base`}>
          {getStatusLabel(displayStatus)}
        </Badge>
      </div>

      {/* Action Buttons */}
      <Card className="p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Button onClick={handleEdit} className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Plan
          </Button>

          {(displayStatus === 'draft' || displayStatus === 'paused') && (
            <Button onClick={handleSendToApproval} variant="outline" className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send to Approval
            </Button>
          )}

          {displayStatus === 'approved' && (
            <Button onClick={handleActivate} variant="outline" className="flex items-center gap-2 bg-green-50 hover:bg-green-100">
              <Play className="w-4 h-4" />
              Activate Campaign
            </Button>
          )}

          {displayStatus === 'active' && (
            <>
              <Button onClick={handlePause} variant="outline" className="flex items-center gap-2">
                <Pause className="w-4 h-4" />
                Pause Campaign
              </Button>
              <Button onClick={handleComplete} variant="outline" className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100">
                <CheckCircle className="w-4 h-4" />
                Mark as Completed
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Campaign Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Campaign Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Campaign Name</label>
              <p className="text-gray-900 font-medium">{mediaPlan.campaignName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Client</label>
              <p className="text-gray-900 font-medium">{mediaPlan.clientName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Campaign Objective</label>
              <p className="text-gray-900 font-medium">{mediaPlan.campaignObjective}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Target Audience</label>
              <p className="text-gray-900 font-medium">{mediaPlan.targetAudience}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Start Date</label>
                <p className="text-gray-900 font-medium">{formatDate(mediaPlan.expectedStartDate)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">End Date</label>
                <p className="text-gray-900 font-medium">{formatDate(mediaPlan.expectedEndDate)}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Budget Summary</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Total Budget</label>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(mediaPlan.totalBudget)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Total Spent</label>
              <p className="text-xl font-semibold text-gray-900">{formatCurrency(totalSpent)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Remaining Budget</label>
              <p className={`text-xl font-semibold ${budgetRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(budgetRemaining)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Budget Usage</label>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    budgetUsagePercentage > 100 ? 'bg-red-500' : 
                    budgetUsagePercentage > 90 ? 'bg-yellow-500' : 
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(budgetUsagePercentage, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">{budgetUsagePercentage.toFixed(1)}% used</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Channels and Segments */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Channels & Segments</h2>
        <div className="space-y-6">
          {mediaPlan.channels.map((channel, channelIndex: number) => (
            <div key={channelIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{channel.channelName}</h3>
                  <Badge variant="outline" className="mt-1">{channel.mediaType}</Badge>
                </div>
              </div>

              {/* Segments Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Segment</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Ad Type</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Class</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Time Slot</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Days</th>
                      <th className="text-right py-2 px-3 text-sm font-medium text-gray-700">Unit Rate</th>
                      <th className="text-right py-2 px-3 text-sm font-medium text-gray-700">Spots</th>
                      <th className="text-right py-2 px-3 text-sm font-medium text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {channel.segments?.map((segment, segmentIndex: number) => {
                      const segmentTotal = segment.unitRate * segment.totalSpots;
                      return (
                        <tr key={segmentIndex} className="border-b border-gray-200">
                          <td className="py-3 px-3">
                            <div>
                              <p className="font-medium text-gray-900">{segment.segmentName}</p>
                              {segment.programName && (
                                <p className="text-xs text-gray-500">{segment.programName}</p>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-sm text-gray-700">
                            {segment.adType.replace(/_/g, ' ')}
                          </td>
                          <td className="py-3 px-3">
                            <Badge variant="outline">{segment.segmentClass}</Badge>
                          </td>
                          <td className="py-3 px-3 text-sm text-gray-700">{segment.timeSlot}</td>
                          <td className="py-3 px-3 text-xs text-gray-600">
                            {segment.days.map((d: string) => d.substring(0, 3)).join(', ')}
                          </td>
                          <td className="py-3 px-3 text-sm text-right text-gray-900">
                            {formatCurrency(segment.unitRate)}
                          </td>
                          <td className="py-3 px-3 text-sm text-right text-gray-900">
                            {segment.totalSpots}
                          </td>
                          <td className="py-3 px-3 text-sm text-right font-semibold text-gray-900">
                            {formatCurrency(segmentTotal)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Metadata */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Metadata</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="text-gray-500 font-medium">Plan ID</label>
            <p className="text-gray-900">{mediaPlan.id}</p>
          </div>
          <div>
            <label className="text-gray-500 font-medium">Created At</label>
            <p className="text-gray-900">{formatDate(mediaPlan.createdAt)}</p>
          </div>
          <div>
            <label className="text-gray-500 font-medium">Last Updated</label>
            <p className="text-gray-900">{formatDate(mediaPlan.updatedAt)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
