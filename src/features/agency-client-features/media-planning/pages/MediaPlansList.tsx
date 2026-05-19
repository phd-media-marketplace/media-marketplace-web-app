import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Eye, Plus, Search,Trash2, FileText, Clock, CheckCircle2, Zap } from 'lucide-react';
import { DateRangePicker } from '@/components/universal/DateRangePicker';
import { DataTable } from '@/components/universal/DataTable';
import type { UniversalDataTableColumn } from '@/components/universal/DataTable';
import { dummyMediaPlans } from '../dummy-data';
import type { MediaPlan } from '../types';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { getStatusLabel, getStatusColor } from '../helperFunction';
import {formatCurrency, formatDate} from "@/utils/formatters";
import Header from '@/components/universal/Header';
import SummaryCards from '@/components/universal/SummaryCards';
import type { SummaryCardsProps } from '@/components/universal/SummaryCards';
import NoDataCard from '@/components/universal/NoDataCard';

export default function MediaPlansList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [objectiveFilter, setObjectiveFilter] = useState<string>('all');
  const [selectedPlans, setSelectedPlans] = useState<Set<string>>(new Set());
  // const [showFilters, setShowFilters] = useState(true);
  const { user } = useAuthStore();

  // Get unique objectives for filter
  const uniqueObjectives = useMemo(() => {
    const objectives = new Set(dummyMediaPlans.map(plan => plan.campaignObjective));
    return Array.from(objectives).sort();
  }, []);

  // Filter and search media plans
  const filteredPlans = useMemo(() => {
    let filtered = [...dummyMediaPlans];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(plan =>
        plan.campaignName.toLowerCase().includes(query) ||
        plan.clientName.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(plan => plan.status === statusFilter);
    }

    // Apply objective filter
    if (objectiveFilter !== 'all') {
      filtered = filtered.filter(plan => plan.campaignObjective === objectiveFilter);
    }

    // Sort by updatedAt (most recent first)
    filtered.sort((a, b) => new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime());

    return filtered;
  }, [searchQuery, statusFilter, objectiveFilter]);

  // Summary statistics (based on the currently filtered list)
  const summaryStats = useMemo(() => {
    const approved = filteredPlans.filter(plan => plan.status === 'APPROVED').length;
    const pendingApproval = filteredPlans.filter(plan => plan.status === 'PENDING_APPROVAL').length;
    const Rejected = filteredPlans.filter(plan => plan.status === 'REJECTED').length;
    // const totalBudget = filteredPlans.reduce((sum, plan) => sum + (plan.totalBudget || 0), 0);
    const total = filteredPlans.length;

    return {
      totalCount: total,
      approvedCount: approved,
      pendingApprovalCount: pendingApproval,
      rejectedCount: Rejected,
      // totalBudget,
    };
  }, [filteredPlans]);

  // Summary cards data
  const mediaPlansSummaryCardsData = useMemo<SummaryCardsProps[]>(() => {
    return [
      {
        title: 'Total Plans',
        value: summaryStats.totalCount,
        icon: FileText,
        footerText: 'Matching current filters',
        bgColor: 'from-purple-500 to-indigo-700',
      },
      {
        title: 'Approved Plans',
        value: summaryStats.approvedCount,
        icon: Zap,
        footerText: `${summaryStats.totalCount ? Math.round((summaryStats.approvedCount / summaryStats.totalCount) * 100) : 0}% of plans`,
        bgColor: 'from-emerald-500 to-green-700',
      },
      {
        title: 'Pending Approval',
        value: summaryStats.pendingApprovalCount,
        icon: Clock,
        footerText: `${summaryStats.totalCount ? Math.round((summaryStats.pendingApprovalCount / summaryStats.totalCount) * 100) : 0}% awaiting review`,
        bgColor: 'from-amber-500 to-orange-700',
      },
      {
        title: 'Rejected Plans',
        value: summaryStats.rejectedCount,
        icon: CheckCircle2,
        footerText: `${summaryStats.totalCount ? Math.round((summaryStats.rejectedCount / summaryStats.totalCount) * 100) : 0}% finished`,
        bgColor: 'from-rose-500 to-red-700',
      },
      // {
      //   title: 'Total Budget',
      //   value: formatCurrency(summaryStats.totalBudget),
      //   icon: Gauge,
      //   footerText: 'Across all filtered plans',
      //   bgColor: 'from-rose-500 to-red-700',
      // },
    ];
  }, [summaryStats]);

  const handleViewPlan = useCallback((planId: string) => {
    if (user?.tenantType === 'AGENCY') {
      navigate(`/agency/media-planning/plans/${planId}`);
    } else {
      navigate(`/client/media-planning/plans/${planId}`);
    }
  }, [user?.tenantType, navigate]);

  const handleCreatePlan = () => {
    if (user?.tenantType === 'AGENCY') {
      navigate('/agency/media-planning/create');
    } else {
      navigate('/client/media-planning/create');
    }
  };

  // Row selection handlers
  const toggleRowSelection = useCallback((planId: string) => {
    setSelectedPlans((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(planId)) {
        newSelected.delete(planId);
      } else {
        newSelected.add(planId);
      }
      return newSelected;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedPlans((prev) => {
      if (prev.size === filteredPlans.length) {
        return new Set();
      } else {
        return new Set(filteredPlans.map((p) => p.id!));
      }
    });
  }, [filteredPlans]);

  const handleDeleteSelected = () => {
    alert(`Delete ${selectedPlans.size} selected plan${selectedPlans.size !== 1 ? 's' : ''}?`);
    setSelectedPlans(new Set());
  };

  const handleViewSelected = () => {
    if (selectedPlans.size === 1) {
      const planId = Array.from(selectedPlans)[0];
      handleViewPlan(planId);
    } else {
      alert(`View ${selectedPlans.size} selected plan${selectedPlans.size !== 1 ? 's' : ''}?`);
    }
  };

  const computeDefaultDates = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
    };
  }, []);

  // Prepare columns for DataTable
  const planColumns = useMemo<UniversalDataTableColumn<MediaPlan>[]>(() => {
    return [
      {
        id: 'select',
        header: (
          <input
            type="checkbox"
            checked={selectedPlans.size === filteredPlans.length && filteredPlans.length > 0}
            onChange={toggleSelectAll}
            className="w-4 h-4 rounded"
            title="Select all plans"
          />
        ),
        cell: (plan) => (
          <input
            type="checkbox"
            checked={selectedPlans.has(plan.id!)}
            onChange={() => toggleRowSelection(plan.id!)}
            className="w-4 h-4 rounded"
          />
        ),
        widthPx: 50,
        align: 'center',
      },
      {
        id: 'campaignName',
        header: 'Campaign Name',
        accessor: 'campaignName',
        cell: (plan) => <span className="font-medium">{plan.campaignName}</span>,
        widthPx: 210,
      },
      {
        id: 'clientName',
        header: 'Client',
        accessor: 'clientName',
        widthPx: 150,
      },
      {
        id: 'status',
        header: 'Status',
        cell: (plan) => (
          <Badge className={getStatusColor(plan.status)}>
            {getStatusLabel(plan.status)}
          </Badge>
        ),
        widthPx: 140,
      },
      {
        id: 'objective',
        header: 'Objective',
        accessor: 'campaignObjective',
        widthPx: 140,
      },
      {
        id: 'budget',
        header: 'Budget',
        cell: (plan) => (
          <div className="space-y-1">
            <div className="text-sm font-medium">{formatCurrency(plan.totalBudget)}</div>
            <div className="text-xs text-gray-500">
              {formatCurrency(plan.budgetAllocated)} allocated
            </div>
          </div>
        ),
        widthPx: 150,
        align: 'left',
      },
      {
        id: 'startDate',
        header: 'Start Date',
        cell: (plan) => formatDate(plan.expectedStartDate),
        widthPx: 100,
      },
      {
        id: 'endDate',
        header: 'End Date',
        cell: (plan) => formatDate(plan.expectedEndDate),
        widthPx: 100,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (plan) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewPlan(plan.id!)}
            className="flex items-center gap-1"
          >
            <Eye className="w-4 h-4" />
            View
          </Button>
        ),
        widthPx: 100,
        align: 'center',
      },
    ];
  }, [selectedPlans, filteredPlans.length, toggleSelectAll, toggleRowSelection, handleViewPlan]);

  return (
    <div className="container mx-auto py-4 space-y-6">
      {/* Header */}
      <Header
        title="Media Plans"
        description="Manage and view all your media planning campaigns"
        ctaFunc={handleCreatePlan}
        ctabtnText='Create New plan'
        ctaIcon={Plus}
        backbtnVisible={false}
      />

      {/* Filters Card */}
      <Card className=" border-primary/10 rounded-lg gap-2">
        {/* <div className="flex items-center justify-end">
          <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
            <Filter className="w-5 h-5 " />
            Filters
          </h2> */}
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide' : 'Show'}
          </Button> */}
        {/* </div> */}

        {/* Active Filters Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {searchQuery && (
              <Badge variant="outline" className="flex items-center gap-1">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-red-600">×</button>
              </Badge>
            )}
            {statusFilter !== 'all' && (
              <Badge variant="outline" className="flex items-center gap-1">
                Status: {getStatusLabel(statusFilter as MediaPlan['status'])}
                <button onClick={() => setStatusFilter('all')} className="ml-1 hover:text-red-600">×</button>
              </Badge>
            )}
            {objectiveFilter !== 'all' && (
              <Badge variant="outline" className="flex items-center gap-1">
                Objective: {objectiveFilter}
                <button onClick={() => setObjectiveFilter('all')} className="ml-1 hover:text-red-600">×</button>
              </Badge>
            )}
          </div>
          <p className=" text-right text-sm text-gray-600">
            {filteredPlans.length} plan{filteredPlans.length !== 1 ? 's' : ''} found
          </p>
        </div>
        {/* {showFilters && ( */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search by Campaign/Client Name */}
            <div className="space-y-2">
              {/* <label className="text-sm font-medium text-gray-700">Search Campaign or Client</label> */}
              <div className="relative ">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by campaign or client name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="filter-input-field"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              {/* <label className="text-sm font-medium text-gray-700">Status</label> */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full input-field">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent className="select-trigger-bg">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECT">Rejected</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Objective Filter */}
            <div className="space-y-2">
              {/* <label className="text-sm font-medium text-gray-700">Campaign Objective</label> */}
              <Select value={objectiveFilter} onValueChange={setObjectiveFilter}>
                <SelectTrigger className="w-full input-field">
                  <SelectValue placeholder="All objectives" />
                </SelectTrigger>
                <SelectContent className="select-trigger-bg">
                  <SelectItem value="all">All Objectives</SelectItem>
                  {uniqueObjectives.map(objective => (
                    <SelectItem key={objective} value={objective}>{objective}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2 lg:col-span-1">
              {/* <label className="text-sm font-medium text-gray-700">Date Range</label> */}
              <DateRangePicker
                defaultStart={computeDefaultDates.start}
                defaultEnd={computeDefaultDates.end}
                onDateRangeChange={(range) => {
                  console.log('Date range updated:', range);
                }}
              />
            </div>
          </div>
        {/* )} */}

      </Card>

      {/* summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {mediaPlansSummaryCardsData.map((card, index) => (
          <SummaryCards key={index} {...card} />
        ))}
      </div>

      {/* Selection Action Bar */}
      {selectedPlans.size > 0 && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm font-medium text-gray-700">
            {selectedPlans.size} plan{selectedPlans.size !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2 ml-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={handleViewSelected}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              View
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDeleteSelected}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      )}


      {/* Media Plans Table */}
      <DataTable
        rows={filteredPlans}
        columns={planColumns}
        rowKey={(plan) => plan.id!}
        containerClassName="rounded-lg border border-slate-300"
        minTableWidthClassName="min-w-full"
        tableClassName="w-full"
        emptyState={
          <NoDataCard
            title="No media plans found"
            message={
              (searchQuery || statusFilter !== 'all' || objectiveFilter !== 'all')
                ? 'Try adjusting your filters or search criteria'
                : 'Create a new media plan to get started'
            }
          />
        }
      />
    </div>
  );
}
