import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Plus } from "lucide-react";
import { dummyCampaignListItems } from "../dummy-data";
import type { CampaignStatus } from "../types";
import {
  CampaignFilters,
  CampaignSummaryCards,
  CampaignsTable,
} from "../components";

/**
 * CampaignsList Component
 * Displays all campaigns with filtering and performance metrics
 * Shows campaign execution status and overall results
 */
export default function CampaignsList() {
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "ALL">("ALL");

  // Filter campaigns
  const filteredCampaigns = useMemo(() => {
    return dummyCampaignListItems.filter(campaign => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        campaign.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.campaignCode.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === "ALL" || campaign.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Calculate summary stats
  const summaryStats = useMemo(() => ({
    totalCount: dummyCampaignListItems.length,
    ongoingCount: dummyCampaignListItems.filter(c => c.status === 'ONGOING').length,
    completedCount: dummyCampaignListItems.filter(c => c.status === 'COMPLETED').length,
    planningCount: dummyCampaignListItems.filter(c => c.status === 'PLANNING').length,
  }), []);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Campaigns</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track campaign performance and results
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <CampaignFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={(value) => setStatusFilter(value)}
          />
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <CampaignSummaryCards
        totalCount={summaryStats.totalCount}
        ongoingCount={summaryStats.ongoingCount}
        completedCount={summaryStats.completedCount}
        planningCount={summaryStats.planningCount}
      />

      {/* Campaigns Table */}
      <Card>
        <CardContent className="p-0">
          <CampaignsTable campaigns={filteredCampaigns} />
        </CardContent>
      </Card>
    </div>
  );
}
