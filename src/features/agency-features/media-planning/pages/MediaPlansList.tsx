import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Plus, Search, Filter, Trash2 } from 'lucide-react';
import { DateRangePicker } from '@/components/universal/DateRangePicker';
import { dummyMediaPlans } from '../dummy-data';
import type { MediaPlan } from '../types';
import { useAuthStore } from '@/features/auth/store/auth-store';

// Helper functions for status badges
const getStatusColor = (status: MediaPlan['status']) => {
  const colors = {
    draft: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    active: 'bg-green-100 text-green-700 hover:bg-green-200',
    paused: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    completed: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    cancelled: 'bg-red-100 text-red-700 hover:bg-red-200',
    pending_approval: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    approved: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
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
    filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return filtered;
  }, [searchQuery, statusFilter, objectiveFilter]);

  const handleViewPlan = (planId: string) => {
    if (user?.tenantType === 'AGENCY') {
      navigate(`/agency/media-planning/plans/${planId}`);
    } else {
      navigate(`/client/media-planning/plans/${planId}`);
    }
  };

  const handleCreatePlan = () => {
    if (user?.tenantType === 'AGENCY') {
      navigate('/agency/media-planning/create');
    } else {
      navigate('/client/media-planning/create');
    }
  };

  // Row selection handlers
  const toggleRowSelection = (planId: string) => {
    const newSelected = new Set(selectedPlans);
    if (newSelected.has(planId)) {
      newSelected.delete(planId);
    } else {
      newSelected.add(planId);
    }
    setSelectedPlans(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedPlans.size === filteredPlans.length) {
      setSelectedPlans(new Set());
    } else {
      setSelectedPlans(new Set(filteredPlans.map((p) => p.id)));
    }
  };

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

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Plans</h1>
          <p className="text-gray-600 mt-1">Manage and view all your media planning campaigns</p>
        </div>
        <Button onClick={handleCreatePlan} className="flex items-center gap-2 text-white border bg-primary hover:bg-white hover:text-primary hover:border-secondary">
          <Plus className="w-4 h-4" />
          Create New Plan
        </Button>
      </div>

      {/* Filters Card */}
      <Card className="p-4 border-primary/10 rounded-lg gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
            <Filter className="w-5 h-5 " />
            Filters
          </h2>
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide' : 'Show'}
          </Button> */}
        </div>

        {/* {showFilters && ( */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search by Campaign/Client Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Search Campaign or Client</label>
              <div className="relative ">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full input-field">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending_approval">Pending Approval</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Objective Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Campaign Objective</label>
              <Select value={objectiveFilter} onValueChange={setObjectiveFilter}>
                <SelectTrigger className="w-full input-field">
                  <SelectValue placeholder="All objectives" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Objectives</SelectItem>
                  {uniqueObjectives.map(objective => (
                    <SelectItem key={objective} value={objective}>{objective}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2 lg:col-span-1">
              <label className="text-sm font-medium text-gray-700">Date Range</label>
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

        {/* Active Filters Summary */}
        <div className=" border-t border-primary/10 py-1 my-2">
          <p className="text-sm text-gray-600">
            {filteredPlans.length} plan{filteredPlans.length !== 1 ? 's' : ''} found
          </p>
          <div className="flex items-center gap-2 mt-4 flex-wrap">
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
        </div>
      </Card>

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
      <Card className='max-w-full  mx-auto rounded-lg border border-slate-300'>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-200">
                <TableHead className="w-12 pl-4">
                  <input
                    type="checkbox"
                    checked={selectedPlans.size === filteredPlans.length && filteredPlans.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded"
                    title="Select all plans"
                  />
                </TableHead>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Objective</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlans.length === 0 ? (
                <TableRow className='border-b border-slate-200'>
                  <TableCell colSpan={9} className="text-center  py-12 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-12 h-12 text-gray-300" />
                      <p>No media plans found</p>
                      {(searchQuery || statusFilter !== 'all' || objectiveFilter !== 'all') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('all');
                            setObjectiveFilter('all');
                          }}
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlans.map(plan => {
                  const isSelected = selectedPlans.has(plan.id);
                  return (
                    <TableRow 
                      key={plan.id} 
                      className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                    >
                      <TableCell className="pl-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRowSelection(plan.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{plan.campaignName}</TableCell>
                      <TableCell>{plan.clientName}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(plan.status)}>
                          {getStatusLabel(plan.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{plan.campaignObjective}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{formatCurrency(plan.totalBudget)}</div>
                          <div className="text-xs text-gray-500">
                            {formatCurrency(plan.budgetAllocated)} allocated
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(plan.expectedStartDate)}</TableCell>
                      <TableCell>{formatDate(plan.expectedEndDate)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewPlan(plan.id);
                          }}
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
