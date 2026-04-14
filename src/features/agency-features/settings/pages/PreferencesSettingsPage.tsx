import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PreferencesSettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [campaignUpdates, setCampaignUpdates] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">Preferences</h2>
        <p className="mt-1 text-sm text-gray-500">Manage notification and content preferences.</p>
      </div>

      <Card className="border border-violet-100">
        <CardHeader>
          <CardTitle className="text-primary">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-xs text-gray-500">Receive notifications and reminders by email.</p>
            </div>
            <Button type="button" variant={emailNotifications ? "default" : "outline"} onClick={() => setEmailNotifications((v) => !v)}>
              {emailNotifications ? "Enabled" : "Disabled"}
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
            <div>
              <p className="font-medium text-gray-900">SMS Notifications</p>
              <p className="text-xs text-gray-500">Receive urgent alerts via SMS.</p>
            </div>
            <Button type="button" variant={smsNotifications ? "default" : "outline"} onClick={() => setSmsNotifications((v) => !v)}>
              {smsNotifications ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-violet-100">
        <CardHeader>
          <CardTitle className="text-primary">Content Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
            <div>
              <p className="font-medium text-gray-900">Campaign Updates</p>
              <p className="text-xs text-gray-500">Get updates about campaign status and delivery milestones.</p>
            </div>
            <Button type="button" variant={campaignUpdates ? "default" : "outline"} onClick={() => setCampaignUpdates((v) => !v)}>
              {campaignUpdates ? "Enabled" : "Disabled"}
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
            <div>
              <p className="font-medium text-gray-900">Payment Alerts</p>
              <p className="text-xs text-gray-500">Get notified for invoice due dates and payment confirmations.</p>
            </div>
            <Button type="button" variant={paymentAlerts ? "default" : "outline"} onClick={() => setPaymentAlerts((v) => !v)}>
              {paymentAlerts ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button className="bg-primary text-white hover:bg-primary/90">Save Preferences</Button>
    </div>
  );
}
