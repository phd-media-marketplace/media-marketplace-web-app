import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MediaPartnerTimeFramesSettingsPage() {
  const [billingCycle, setBillingCycle] = useState("MONTHLY");
  const [invoiceDueDays, setInvoiceDueDays] = useState("14");
  const [reportingWindow, setReportingWindow] = useState("MONTHLY");

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">Time Frames</h2>
        <p className="mt-1 text-sm text-gray-500">Configure billing and reporting periods for your media partner account.</p>
      </div>

      <Card className="border border-violet-100">
        <CardHeader><CardTitle className="text-primary">Billing Time Frame</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1 text-sm font-medium text-gray-900">Billing Cycle</p>
            <Select value={billingCycle} onValueChange={setBillingCycle}>
              <SelectTrigger className="w-full input-field"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-white border-none">
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="QUARTERLY">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="mb-1 text-sm font-medium text-gray-900">Invoice Due (Days)</p>
            <Input type="number" min="1" value={invoiceDueDays} onChange={(e) => setInvoiceDueDays(e.target.value)} className="input-field" />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-violet-100">
        <CardHeader><CardTitle className="text-primary">Reporting Time Frame</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-1 text-sm font-medium text-gray-900">Default Reporting Window</p>
            <Select value={reportingWindow} onValueChange={setReportingWindow}>
              <SelectTrigger className="w-full max-w-sm input-field"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-white border-none">
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="bg-primary text-white hover:bg-primary/90">Save Time Frames</Button>
        </CardContent>
      </Card>
    </div>
  );
}
