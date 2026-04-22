import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/universal/Header";
import { Download, FileText, Wallet, BanknoteX, TrendingUp } from "lucide-react";
import ReportFilters from "@/features/media-partner-features/reporting/components/ReportFilters";
import { reportingRecords } from "@/features/media-partner-features/reporting/dummy-data";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ComposedChart,
  Line,

} from "recharts";
import SummaryCards from "@/components/universal/SummaryCards";
import type { SummaryCardsProps } from "@/components/universal/SummaryCards";
import type { ReportFiltersState, ReportQuarter } from "../types";

function formatCurrency(value: number): string {
  return `GHc ${value.toLocaleString()}`;
}

function getQuarterFromDate(date: string): Exclude<ReportQuarter, "ALL"> {
  const month = Number(date.split("-")[1]);
  if (month <= 3) return "Q1";
  if (month <= 6) return "Q2";
  if (month <= 9) return "Q3";
  return "Q4";
}

function getMonthLabel(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { month: "short" });
}

const DEFAULT_FILTERS: ReportFiltersState = {
  quarter: "ALL",
  startDate: "",
  endDate: "",
  clients: [],
};

export default function MediaPartnerReportingPage() {
  const [filters, setFilters] = useState<ReportFiltersState>(DEFAULT_FILTERS);

  const clientOptions = useMemo(
    () => [...new Set(reportingRecords.map((record) => record.clientName))],
    []
  );

  const filteredRecords = useMemo(() => {
    return reportingRecords.filter((record) => {
      if (filters.quarter !== "ALL" && getQuarterFromDate(record.date) !== filters.quarter) {
        return false;
      }

      if (filters.startDate && record.date < filters.startDate) {
        return false;
      }

      if (filters.endDate && record.date > filters.endDate) {
        return false;
      }

      if (filters.clients.length > 0 && !filters.clients.includes(record.clientName)) {
        return false;
      }

      return true;
    });
  }, [filters.clients, filters.endDate, filters.quarter, filters.startDate]);

  // Prepare data for charts and summary cards based on filteredRecords
  const filteredMonthlyRevenueDebt = useMemo(() => {
    const grouped = filteredRecords.reduce<Record<string, { date: string; revenue: number; debt: number }>>((acc, record) => {
      if (!acc[record.date]) {
        acc[record.date] = { date: record.date, revenue: 0, debt: 0 };
      }

      acc[record.date].revenue += record.revenue;
      acc[record.date].debt += record.debt;
      return acc;
    }, {});

    return Object.values(grouped)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((item) => ({
        month: getMonthLabel(item.date),
        revenue: item.revenue,
        debt: item.debt,
      }));
  }, [filteredRecords]);

  // For quarterly chart, we can reuse the same data as filteredMonthlyRevenueDebt but aggregate by quarter
  const filteredQuarterlyRevenueDebt = useMemo(() => {
    const grouped = filteredRecords.reduce<Record<Exclude<ReportQuarter, "ALL">, { revenue: number; debt: number }>>((acc, record) => {
      const quarter = getQuarterFromDate(record.date);
      if (!acc[quarter]) {
        acc[quarter] = { revenue: 0, debt: 0 };
      }

      acc[quarter].revenue += record.revenue;
      acc[quarter].debt += record.debt;
      return acc;
    }, {} as Record<Exclude<ReportQuarter, "ALL">, { revenue: number; debt: number }>);

    const quarterOrder: Array<Exclude<ReportQuarter, "ALL">> = ["Q1", "Q2", "Q3", "Q4"];

    return quarterOrder
      .filter((quarter) => grouped[quarter])
      .map((quarter) => ({
        quarter,
        revenue: grouped[quarter].revenue,
        debt: grouped[quarter].debt,
      }));

  }, [filteredRecords]);
// Prepare top clients by work orders for the second chart
  const filteredTopClientsByWork = useMemo(() => {
    const grouped = filteredRecords.reduce<Record<string, { workOrders: number; revenue: number }>>((acc, record) => {
      if (!acc[record.clientName]) {
        acc[record.clientName] = { workOrders: 0, revenue: 0 };
      }

      acc[record.clientName].workOrders += record.workOrders;
      acc[record.clientName].revenue += record.revenue;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([name, value]) => ({
        name,
        workOrders: value.workOrders,
        revenue: value.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredRecords]);

  const selectedQuarter = useMemo(() => {
    if (filters.quarter !== "ALL") {
      return filteredQuarterlyRevenueDebt.find((item) => item.quarter === filters.quarter) ?? { quarter: filters.quarter, revenue: 0, debt: 0 };
    }

    return filteredQuarterlyRevenueDebt[filteredQuarterlyRevenueDebt.length - 1] ?? { quarter: "Q1", revenue: 0, debt: 0 };
  }, [filteredQuarterlyRevenueDebt, filters.quarter]);

  const topContributor = filteredTopClientsByWork[0] ?? { name: "-", workOrders: 0 };

  const reportSummaryCardsData = useMemo<SummaryCardsProps[]>(() => {
    const totalWorkOrders = filteredRecords.reduce((sum, record) => sum + record.workOrders, 0);

    return [
      {
        title: "Total Work Orders",
        value: totalWorkOrders,
        icon: FileText,
        change: "10%",
        trendIcon: TrendingUp,
        footerText: "Matching current filters",
        bgColor: "from-indigo-500 to-blue-700",
      },
      {
        title: "Quarter Revenue",
        value: formatCurrency(selectedQuarter.revenue),
        icon: Wallet,
        change: "3%",
        trendIcon: TrendingUp,
        footerText: filters.quarter === "ALL" ? "Current quarter" : `${filters.quarter} selection`,
        bgColor: "from-emerald-500 to-teal-700",
      },
      {
        title: "Quarter Debt",
        value: formatCurrency(selectedQuarter.debt),
        icon: BanknoteX,
        change: "0%",
        trendIcon: TrendingUp,
        footerText: `Top contributor: ${topContributor.name}`,
        bgColor: "from-rose-500 to-red-700",
      },
    ];
  }, [filteredRecords, selectedQuarter, filters.quarter, topContributor.name]);


  return (
    <div className="space-y-6 pb-10">
      <Header 
        title="Reporting"
        description="Track client contribution, revenue trends, and debt performance."
        backbtnVisible={false}
        ctaFunc={() => {}}
        ctaIcon={Download}
        ctabtnText="Export Report"
      />

      <ReportFilters
        value={filters}
        clientOptions={clientOptions}
        onQuarterChange={(quarter) => setFilters((prev) => ({ ...prev, quarter }))}
        onStartDateChange={(startDate) => setFilters((prev) => ({ ...prev, startDate }))}
        onEndDateChange={(endDate) => setFilters((prev) => ({ ...prev, endDate }))}
        onClientsChange={(clients) => setFilters((prev) => ({ ...prev, clients }))}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {reportSummaryCardsData.map((card) => (
          <SummaryCards key={card.title} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="border border-violet-100">
          <CardHeader><CardTitle className="text-primary">Revenue vs Debt (Quarterly)</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={filteredQuarterlyRevenueDebt}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="revenue" fill="#0f766e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="debt" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-violet-100">
          <CardHeader><CardTitle className="text-primary">Top Clients by Work Orders</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={filteredTopClientsByWork}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" interval={0} angle={-12} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip formatter={(value: number, key: string) => (key === "revenue" ? formatCurrency(value) : value.toLocaleString())} />
                <Legend />
                <Bar dataKey="workOrders" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="revenue" stroke="#0f766e" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card className="border border-violet-100">
        <CardHeader><CardTitle className="text-primary">Revenue vs Debt (Monthly)</CardTitle></CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={filteredMonthlyRevenueDebt}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="debt" stroke="#ef4444" strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
