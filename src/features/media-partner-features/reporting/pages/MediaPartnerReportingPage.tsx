import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const monthlyRevenueDebt = [
  { month: "Jan", revenue: 112000, debt: 19000 },
  { month: "Feb", revenue: 98000, debt: 21000 },
  { month: "Mar", revenue: 134000, debt: 25000 },
  { month: "Apr", revenue: 142000, debt: 27000 },
  { month: "May", revenue: 126000, debt: 22000 },
  { month: "Jun", revenue: 151000, debt: 29000 },
];

const quarterlyRevenueDebt = [
  { quarter: "Q1", revenue: 344000, debt: 65000 },
  { quarter: "Q2", revenue: 419000, debt: 78000 },
  { quarter: "Q3", revenue: 392000, debt: 70000 },
  { quarter: "Q4", revenue: 441000, debt: 83000 },
];

const topClientsByWork = [
  { name: "Nova Agency", workOrders: 42, revenue: 244000 },
  { name: "Prime Agency", workOrders: 36, revenue: 210000 },
  { name: "Vista Retail", workOrders: 28, revenue: 148000 },
  { name: "City Consumer Co", workOrders: 24, revenue: 133000 },
];

function formatCurrency(value: number): string {
  return `GHc ${value.toLocaleString()}`;
}

export default function MediaPartnerReportingPage() {
  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">Reporting</h2>
        <p className="mt-1 text-sm text-gray-500">Track client contribution, revenue trends, and debt performance.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border border-primary/10"><CardContent className="p-4"><p className="text-xs text-gray-500">Top Work Contributor</p><p className="mt-1 text-xl font-bold text-primary">Nova Agency</p><p className="text-xs text-gray-500">42 work orders</p></CardContent></Card>
        <Card className="border border-primary/10"><CardContent className="p-4"><p className="text-xs text-gray-500">Quarter Revenue</p><p className="mt-1 text-xl font-bold text-primary">{formatCurrency(419000)}</p><p className="text-xs text-gray-500">Current quarter</p></CardContent></Card>
        <Card className="border border-primary/10"><CardContent className="p-4"><p className="text-xs text-gray-500">Quarter Debt</p><p className="mt-1 text-xl font-bold text-red-700">{formatCurrency(78000)}</p><p className="text-xs text-gray-500">Outstanding debt</p></CardContent></Card>
      </div>

      <Card className="border border-violet-100">
        <CardHeader><CardTitle className="text-primary">Revenue vs Debt (Monthly)</CardTitle></CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyRevenueDebt}>
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

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="border border-violet-100">
          <CardHeader><CardTitle className="text-primary">Revenue vs Debt (Quarterly)</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={quarterlyRevenueDebt}>
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
          <CardHeader><CardTitle className="text-primary">Clients Providing More Work</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={topClientsByWork}>
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
    </div>
  );
}
