import { Button } from "@/components/ui/button";
import { mediaPartnerSummaryCardsData } from "../contents/dashboard-content";
import type { SummaryCardsProps } from "@/components/universal/SummaryCards";
import SummaryCards from "@/components/universal/SummaryCards";
import { dummyActiveCampaigns, dummyRevenueData } from "../dummy-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import RevenueChart from "../components/RevenueChart";


export default function MediaPartnerDashboard() {
  return (
    <div className="space-y-6 w-full h-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-primary tracking-tight">Dashboard</h2> 
        <div className="flex gap-2 sm:gap-4">
          <Button variant="outline" size="sm" className="border border-secondary whitespace-nowrap">Create Package 📦</Button>
          <Button variant="outline" size="sm" className="bg-secondary border-none whitespace-nowrap">Add Rate</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Summary Cards */}
        {mediaPartnerSummaryCardsData.map((card: SummaryCardsProps, index: number) => (
          <SummaryCards key={index} {...card} />
        ))}
      </div>
      <div className="">
        {/* Additional dashboard content (e.g., charts, tables) can be added here */}
        {/* Active Campaigns, Revenue, and Invoices charts can be added here */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-purple-50 col-span-2 rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Active Campaigns</h3>
            <div className="space-y-2">
              <Table className="bg-white rounded-lg py-2" >
                <TableHeader>
                  <TableRow className="border-b-2 border-gray-200">
                    <TableHead>Campaign</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyActiveCampaigns.map((campaign) => (
                    <TableRow key={campaign.id} className="hover:bg-gray-50 transition-colors border-b-2 border-gray-200 rounded-full">
                      
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${campaign.status === 'active' ? 'bg-green-500' : campaign.status === 'paused' ? 'bg-yellow-500' : 'bg-gray-500'} inline-block`}/>
                          <div>
                            <h4 className="text-md text-primary font-medium">{campaign.title}</h4>
                            <p className="text-xs text-gray-500">{campaign.clientName} {campaign.agencyName ? `- ${campaign.agencyName}` : ''}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{`₵${campaign.budget.toLocaleString()}`}</TableCell>
                      <TableCell>{new Date(campaign.endDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="xs" className="bg-secondary border-none whitespace-nowrap">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg shadow p-4 overflow-hidden">
            <h3 className="text-lg font-semibold mb-4">Revenue</h3>
            <RevenueChart data={dummyRevenueData} />
          </div>
        </div>
      </div>
    </div>

  )
}
