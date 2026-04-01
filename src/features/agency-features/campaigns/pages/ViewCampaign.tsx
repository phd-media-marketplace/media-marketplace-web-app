import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Pause, Play, XCircle, BarChart3 } from "lucide-react";
import { dummyCampaigns } from "../dummy-data";
import {
  CampaignStatusBadge,
  CampaignMetricsCards,
  CampaignBudgetSummary,
  CampaignChannelsTable,
} from "../components";

/**
 * ViewCampaign Component
 * Displays complete campaign details including metrics, budget, and channel performance
 * Shows ongoing campaign execution status and results
 */
export default function ViewCampaign() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the campaign by ID
  const campaign = dummyCampaigns.find(c => c.id === id);

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-2xl font-semibold text-gray-900">Campaign Not Found</h2>
        <p className="text-gray-500">The campaign you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/agency/campaigns')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Campaigns
        </Button>
      </div>
    );
  }

  // Calculate days remaining
  const today = new Date();
  const endDate = new Date(campaign.endDate);
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  // Handle campaign actions
  const handlePause = () => {
    alert('Pause Campaign functionality (Demo - actual implementation pending)');
  };

  const handleResume = () => {
    alert('Resume Campaign functionality (Demo - actual implementation pending)');
  };

  const handleCancel = () => {
    const confirm = window.confirm('Are you sure you want to cancel this campaign?');
    if (confirm) {
      alert('Cancel Campaign functionality (Demo - actual implementation pending)');
    }
  };

  const handleDownloadReport = () => {
    alert('Download Campaign Report functionality (Demo - actual implementation pending)');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/agency/campaigns')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary tracking-tight">
              {campaign.campaignName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {campaign.campaignCode} • Media Plan: {campaign.mediaPlanCode}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/agency/campaigns/${campaign.id}/charts`)}>
            <BarChart3 className="w-4 h-4 mr-2" />
            View Charts
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadReport}>
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          {campaign.status === 'ONGOING' && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                onClick={handlePause}
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={handleCancel}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
          {campaign.status === 'PAUSED' && (
            <Button 
              variant="outline" 
              size="sm"
              className="text-green-600 border-green-600 hover:bg-green-50"
              onClick={handleResume}
            >
              <Play className="w-4 h-4 mr-2" />
              Resume
            </Button>
          )}
        </div>
      </div>

      {/* Status & Basic Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <CampaignStatusBadge status={campaign.status} />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Client</label>
                <div className="text-lg font-semibold">{campaign.clientName}</div>
                {campaign.agencyName && (
                  <div className="text-sm text-gray-600">Agency: {campaign.agencyName}</div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Brand</label>
                <div className="text-lg font-semibold">{campaign.brandName}</div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Campaign Objective</label>
                <div className="text-lg font-semibold">{campaign.objective}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Target Audience</label>
                <div className="text-lg font-semibold">{campaign.targetAudience}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Campaign Period</label>
                <div className="text-lg font-semibold">
                  {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                </div>
                {campaign.status === 'ONGOING' && (
                  <div className="text-sm text-gray-600 mt-1">
                    {daysRemaining} days remaining
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Summary */}
      <CampaignBudgetSummary
        totalBudget={campaign.totalBudget}
        totalSpent={campaign.totalSpent}
        remainingBudget={campaign.remainingBudget}
        daysRemaining={daysRemaining}
      />

      {/* Overall Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Performance</h2>
        <CampaignMetricsCards metrics={campaign.overallMetrics} />
      </div>

      {/* Channel Performance */}
      <CampaignChannelsTable channels={campaign.channels} />

      {/* Additional Digital Metrics (if available) */}
      {campaign.overallMetrics.conversions && campaign.overallMetrics.conversions > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Digital Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {campaign.overallMetrics.clicks && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Clicks</label>
                  <div className="text-2xl font-bold text-primary">
                    {campaign.overallMetrics.clicks.toLocaleString()}
                  </div>
                </div>
              )}
              {campaign.overallMetrics.cpc && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Cost Per Click</label>
                  <div className="text-2xl font-bold text-primary">
                    GHS {campaign.overallMetrics.cpc.toFixed(2)}
                  </div>
                </div>
              )}
              {campaign.overallMetrics.conversions && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Conversions</label>
                  <div className="text-2xl font-bold text-primary">
                    {campaign.overallMetrics.conversions.toLocaleString()}
                  </div>
                </div>
              )}
              {campaign.overallMetrics.conversionRate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Conversion Rate</label>
                  <div className="text-2xl font-bold text-primary">
                    {campaign.overallMetrics.conversionRate.toFixed(2)}%
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaign Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Created By</label>
              <div className="text-lg font-semibold">{campaign.createdBy}</div>
              <div className="text-sm text-gray-600">
                {new Date(campaign.createdAt).toLocaleString()}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <div className="text-lg font-semibold">
                {new Date(campaign.updatedAt).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">
                {new Date(campaign.updatedAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
