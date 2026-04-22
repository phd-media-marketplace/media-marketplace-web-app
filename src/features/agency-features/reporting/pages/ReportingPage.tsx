import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, Download, Filter } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DateRangePicker } from "@/components/universal/DateRangePicker";
import MultiSelectDropdown, { type MultiSelectOption } from "@/components/universal/MultiSelectDropdown";

type ReportTab = "spend" | "performance" | "campaigns";
type Channel = "TV" | "RADIO" | "DIGITAL" | "OOH";
type MediaPartner = "AdWave" | "PrimeReach" | "VistaMedia" | "PulseNetwork";

type SpendRecord = {
  month: string;
  channel: Channel;
  mediaPartner: MediaPartner;
  campaign: string;
  spend: number;
  reach: number;
  impressions: number;
};

type QuarterFilter = "Q1" | "Q2" | "Q3" | "Q4";

const chartColors = ["#0f766e", "#0ea5e9", "#f59e0b", "#ef4444", "#22c55e"];

const sampleData: SpendRecord[] = [
  { month: "2026-01", channel: "TV", mediaPartner: "AdWave", campaign: "Brand Lift 360", spend: 120000, reach: 520000, impressions: 1600000 },
  { month: "2026-01", channel: "DIGITAL", mediaPartner: "PrimeReach", campaign: "Always On Digital", spend: 85000, reach: 490000, impressions: 2200000 },
  { month: "2026-02", channel: "RADIO", mediaPartner: "VistaMedia", campaign: "Drive Time Blitz", spend: 64000, reach: 300000, impressions: 980000 },
  { month: "2026-02", channel: "TV", mediaPartner: "AdWave", campaign: "Brand Lift 360", spend: 130000, reach: 560000, impressions: 1720000 },
  { month: "2026-03", channel: "OOH", mediaPartner: "PulseNetwork", campaign: "City Domination", spend: 72000, reach: 360000, impressions: 1100000 },
  { month: "2026-03", channel: "DIGITAL", mediaPartner: "PrimeReach", campaign: "Always On Digital", spend: 91000, reach: 510000, impressions: 2360000 },
  { month: "2026-04", channel: "TV", mediaPartner: "VistaMedia", campaign: "Season Launch", spend: 138000, reach: 610000, impressions: 1850000 },
  { month: "2026-04", channel: "RADIO", mediaPartner: "AdWave", campaign: "Drive Time Blitz", spend: 67000, reach: 310000, impressions: 990000 },
  { month: "2026-05", channel: "DIGITAL", mediaPartner: "PulseNetwork", campaign: "Retarget + Scale", spend: 98000, reach: 570000, impressions: 2620000 },
  { month: "2026-05", channel: "OOH", mediaPartner: "VistaMedia", campaign: "City Domination", spend: 78000, reach: 390000, impressions: 1190000 },
  { month: "2026-06", channel: "TV", mediaPartner: "AdWave", campaign: "Season Launch", spend: 146000, reach: 640000, impressions: 1940000 },
  { month: "2026-06", channel: "DIGITAL", mediaPartner: "PrimeReach", campaign: "Retarget + Scale", spend: 103000, reach: 600000, impressions: 2750000 },
  { month: "2026-07", channel: "RADIO", mediaPartner: "PulseNetwork", campaign: "Morning Reach", spend: 70000, reach: 335000, impressions: 1040000 },
  { month: "2026-07", channel: "OOH", mediaPartner: "AdWave", campaign: "Transit Visibility", spend: 82000, reach: 420000, impressions: 1260000 },
  { month: "2026-08", channel: "TV", mediaPartner: "VistaMedia", campaign: "Brand Lift 360", spend: 149000, reach: 655000, impressions: 1980000 },
  { month: "2026-08", channel: "DIGITAL", mediaPartner: "PrimeReach", campaign: "Always On Digital", spend: 108000, reach: 620000, impressions: 2830000 },
  { month: "2026-09", channel: "OOH", mediaPartner: "PulseNetwork", campaign: "Transit Visibility", spend: 86000, reach: 435000, impressions: 1310000 },
  { month: "2026-09", channel: "RADIO", mediaPartner: "AdWave", campaign: "Morning Reach", spend: 73000, reach: 350000, impressions: 1070000 },
  { month: "2026-10", channel: "TV", mediaPartner: "AdWave", campaign: "Holiday Push", spend: 155000, reach: 680000, impressions: 2060000 },
  { month: "2026-10", channel: "DIGITAL", mediaPartner: "PrimeReach", campaign: "Holiday Push", spend: 111000, reach: 640000, impressions: 2910000 },
  { month: "2026-11", channel: "RADIO", mediaPartner: "VistaMedia", campaign: "Holiday Push", spend: 76000, reach: 366000, impressions: 1120000 },
  { month: "2026-11", channel: "OOH", mediaPartner: "PulseNetwork", campaign: "Retail Visibility", spend: 89000, reach: 450000, impressions: 1370000 },
  { month: "2026-12", channel: "TV", mediaPartner: "VistaMedia", campaign: "Year End Burst", spend: 162000, reach: 705000, impressions: 2140000 },
  { month: "2026-12", channel: "DIGITAL", mediaPartner: "AdWave", campaign: "Year End Burst", spend: 116000, reach: 665000, impressions: 3030000 },
];

function monthLabel(yyyymm: string): string {
  const [year, month] = yyyymm.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function quarterFromMonth(yyyymm: string): QuarterFilter {
  const month = Number(yyyymm.split("-")[1]);
  if (month <= 3) return "Q1";
  if (month <= 6) return "Q2";
  if (month <= 9) return "Q3";
  return "Q4";
}

function formatCurrency(value: number): string {
  return `GHc ${value.toLocaleString()}`;
}

export default function ReportingPage() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<ReportTab>("spend");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedQuarters, setSelectedQuarters] = useState<QuarterFilter[]>(["Q1", "Q2", "Q3", "Q4"]);
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>(["TV", "RADIO", "DIGITAL", "OOH"]);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>(() => [...new Set(sampleData.map((r) => r.campaign))]);
  const [selectedPartners, setSelectedPartners] = useState<MediaPartner[]>(["AdWave", "PrimeReach", "VistaMedia", "PulseNetwork"]);
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-12-31");

  const campaignOptions = useMemo(() => [...new Set(sampleData.map((r) => r.campaign))], []);
  const quarterOptions: MultiSelectOption<QuarterFilter>[] = [
    { value: "Q1", label: "Q1" },
    { value: "Q2", label: "Q2" },
    { value: "Q3", label: "Q3" },
    { value: "Q4", label: "Q4" },
  ];
  const channelOptions: MultiSelectOption<Channel>[] = [
    { value: "TV", label: "TV" },
    { value: "RADIO", label: "Radio" },
    { value: "DIGITAL", label: "Digital" },
    { value: "OOH", label: "OOH" },
  ];
  const partnerOptions: MultiSelectOption<MediaPartner>[] = [
    { value: "AdWave", label: "AdWave" },
    { value: "PrimeReach", label: "PrimeReach" },
    { value: "VistaMedia", label: "VistaMedia" },
    { value: "PulseNetwork", label: "PulseNetwork" },
  ];
  const campaignFilterOptions: MultiSelectOption<string>[] = campaignOptions.map((item) => ({ value: item, label: item }));

  const filteredData = useMemo(() => {
    const from = new Date(startDate);
    const to = new Date(endDate);

    return sampleData.filter((record) => {
      const recordDate = new Date(`${record.month}-01`);
      const quarterMatch = selectedQuarters.includes(quarterFromMonth(record.month));
      const channelMatch = selectedChannels.includes(record.channel);
      const campaignMatch = selectedCampaigns.includes(record.campaign);
      const partnerMatch = selectedPartners.includes(record.mediaPartner);

      return recordDate >= from && recordDate <= to && quarterMatch && channelMatch && campaignMatch && partnerMatch;
    });
  }, [selectedQuarters, selectedChannels, selectedCampaigns, selectedPartners, startDate, endDate]);

  const summary = useMemo(() => {
    const totalSpend = filteredData.reduce((sum, item) => sum + item.spend, 0);
    const totalReach = filteredData.reduce((sum, item) => sum + item.reach, 0);
    const totalImpressions = filteredData.reduce((sum, item) => sum + item.impressions, 0);
    const campaigns = new Set(filteredData.map((item) => item.campaign)).size;
    return { totalSpend, totalReach, totalImpressions, campaigns };
  }, [filteredData]);

  const monthlySeries = useMemo(() => {
    const grouped = filteredData.reduce<Record<string, { spend: number; reach: number; impressions: number }>>((acc, item) => {
      if (!acc[item.month]) {
        acc[item.month] = { spend: 0, reach: 0, impressions: 0 };
      }
      acc[item.month].spend += item.spend;
      acc[item.month].reach += item.reach;
      acc[item.month].impressions += item.impressions;
      return acc;
    }, {});

    return Object.entries(grouped)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([month, values]) => ({ month: monthLabel(month), ...values }));
  }, [filteredData]);

  const quarterlyByChannel = useMemo(() => {
    const grouped = filteredData.reduce<Record<string, { TV: number; RADIO: number; DIGITAL: number; OOH: number }>>((acc, item) => {
      const q = quarterFromMonth(item.month);
      if (!acc[q]) {
        acc[q] = { TV: 0, RADIO: 0, DIGITAL: 0, OOH: 0 };
      }
      acc[q][item.channel] += item.spend;
      return acc;
    }, {});

    return ["Q1", "Q2", "Q3", "Q4"]
      .filter((q) => grouped[q])
      .map((q) => ({ quarter: q, ...grouped[q] }));
  }, [filteredData]);

  const partnerShareData = useMemo(() => {
    const grouped = filteredData.reduce<Record<string, number>>((acc, item) => {
      acc[item.mediaPartner] = (acc[item.mediaPartner] || 0) + item.spend;
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const campaignSpendData = useMemo(() => {
    const grouped = filteredData.reduce<Record<string, number>>((acc, item) => {
      acc[item.campaign] = (acc[item.campaign] || 0) + item.spend;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([campaign, spend]) => ({ campaign, spend }))
      .sort((a, b) => b.spend - a.spend);
  }, [filteredData]);

  const platformPerformance = useMemo(() => {
    const grouped = filteredData.reduce<Record<string, { reach: number; impressions: number }>>((acc, item) => {
      if (!acc[item.channel]) {
        acc[item.channel] = { reach: 0, impressions: 0 };
      }
      acc[item.channel].reach += item.reach;
      acc[item.channel].impressions += item.impressions;
      return acc;
    }, {});

    return Object.entries(grouped).map(([platform, values]) => ({ platform, ...values }));
  }, [filteredData]);

  const campaignComparison = useMemo(() => {
    const grouped = filteredData.reduce<Record<string, { spend: number; reach: number; impressions: number }>>((acc, item) => {
      if (!acc[item.campaign]) {
        acc[item.campaign] = { spend: 0, reach: 0, impressions: 0 };
      }
      acc[item.campaign].spend += item.spend;
      acc[item.campaign].reach += item.reach;
      acc[item.campaign].impressions += item.impressions;
      return acc;
    }, {});

    return Object.entries(grouped).map(([campaign, values]) => ({
      campaign,
      ...values,
      cpm: values.impressions ? Number(((values.spend / values.impressions) * 1000).toFixed(2)) : 0,
    }));
  }, [filteredData]);

  const FiltersBlock = (
    <Card className="border border-primary/15">
      <CardHeader className="pb-2">
        <CardTitle className="text-primary text-base">Filters</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MultiSelectDropdown
          label="Quarter"
          options={quarterOptions}
          selected={selectedQuarters}
          onChange={setSelectedQuarters}
        />

        <MultiSelectDropdown
          label="Channel"
          options={channelOptions}
          selected={selectedChannels}
          onChange={setSelectedChannels}
        />

        <MultiSelectDropdown
          label="Campaign"
          options={campaignFilterOptions}
          selected={selectedCampaigns}
          onChange={setSelectedCampaigns}
        />

        <MultiSelectDropdown
          label="Media Partner"
          options={partnerOptions}
          selected={selectedPartners}
          onChange={setSelectedPartners}
        />

        <div className="md:col-span-2 xl:col-span-4">
          <p className="mb-1 text-xs text-gray-500">Date Range</p>
          <DateRangePicker
            defaultStart={startDate}
            defaultEnd={endDate}
            onDateRangeChange={({ startDate: nextStart, endDate: nextEnd }) => {
              setStartDate(nextStart);
              setEndDate(nextEnd);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Reporting</h2>
          <p className="mt-1 text-sm text-gray-500">Spend and performance insights with filter-driven summaries.</p>
        </div>
        <Button className="bg-primary text-white hover:bg-primary/90">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {isMobile ? (
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between border-secondary hover:bg-secondary">
              <span className="inline-flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">{FiltersBlock}</CollapsibleContent>
        </Collapsible>
      ) : (
        FiltersBlock
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border border-primary/10"><CardContent className="p-4"><p className="text-xs text-gray-500">Total Spend</p><p className="mt-1 text-2xl font-bold text-primary">{formatCurrency(summary.totalSpend)}</p></CardContent></Card>
        <Card className="border border-primary/10"><CardContent className="p-4"><p className="text-xs text-gray-500">Total Reach</p><p className="mt-1 text-2xl font-bold text-primary">{summary.totalReach.toLocaleString()}</p></CardContent></Card>
        <Card className="border border-primary/10"><CardContent className="p-4"><p className="text-xs text-gray-500">Total Impressions</p><p className="mt-1 text-2xl font-bold text-primary">{summary.totalImpressions.toLocaleString()}</p></CardContent></Card>
        <Card className="border border-primary/10"><CardContent className="p-4"><p className="text-xs text-gray-500">Campaign Count</p><p className="mt-1 text-2xl font-bold text-primary">{summary.campaigns}</p></CardContent></Card>
      </div>

      <div className="inline-flex rounded-lg border border-primary/15 bg-white p-1">
        <button type="button" className={`rounded-md px-4 py-2 text-sm font-medium ${activeTab === "spend" ? "bg-primary text-white" : "text-primary"}`} onClick={() => setActiveTab("spend")}>Spend Overview</button>
        <button type="button" className={`rounded-md px-4 py-2 text-sm font-medium ${activeTab === "performance" ? "bg-primary text-white" : "text-primary"}`} onClick={() => setActiveTab("performance")}>Performance Overview</button>
        <button type="button" className={`rounded-md px-4 py-2 text-sm font-medium ${activeTab === "campaigns" ? "bg-primary text-white" : "text-primary"}`} onClick={() => setActiveTab("campaigns")}>Spend Analysis</button>
      </div>

      {activeTab === "spend" && (
        <div className="space-y-4">
          <Card className="border border-violet-100">
            <CardHeader><CardTitle className="text-primary">Trend Line + Historical Monthly Spend</CardTitle></CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlySeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value: number) => value.toLocaleString()} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="spend" name="Monthly Spend" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="spend" name="Spend Trend" stroke="#0f766e" strokeWidth={3} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Card className="border border-violet-100">
              <CardHeader><CardTitle className="text-primary">Quarterly Spend by Channel</CardTitle></CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={quarterlyByChannel}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="TV" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="RADIO" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="DIGITAL" fill="#0f766e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="OOH" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border border-violet-100">
              <CardHeader><CardTitle className="text-primary">Share of Spend by Media Partner</CardTitle></CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={partnerShareData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                      {partnerShareData.map((entry, index) => (
                        <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-violet-100">
            <CardHeader><CardTitle className="text-primary">Campaign Spend</CardTitle></CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={campaignSpendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="campaign" interval={0} angle={-20} textAnchor="end" height={72} />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="spend" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "performance" && (
        <div className="space-y-4">
          <Card className="border border-violet-100">
            <CardHeader><CardTitle className="text-primary">Reach and Impressions Across Platforms</CardTitle></CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={platformPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="platform" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => value.toLocaleString()} />
                  <Legend />
                  <Bar dataKey="reach" fill="#0f766e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="impressions" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border border-violet-100">
            <CardHeader><CardTitle className="text-primary">Monthly Reach and Impressions</CardTitle></CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlySeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => value.toLocaleString()} />
                  <Legend />
                  <Line type="monotone" dataKey="reach" stroke="#0f766e" strokeWidth={3} />
                  <Line type="monotone" dataKey="impressions" stroke="#0ea5e9" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "campaigns" && (
        <Card className="border border-violet-100">
          <CardHeader><CardTitle className="text-primary">Campaign Comparison (Spend, Reach, Impressions, CPM)</CardTitle></CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={campaignComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="campaign" interval={0} angle={-20} textAnchor="end" height={72} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value: number, name: string) => (name === "spend" ? formatCurrency(value) : value.toLocaleString())} />
                <Legend />
                <Bar yAxisId="left" dataKey="spend" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="left" dataKey="reach" fill="#0f766e" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="cpm" stroke="#ef4444" strokeWidth={3} name="CPM" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
