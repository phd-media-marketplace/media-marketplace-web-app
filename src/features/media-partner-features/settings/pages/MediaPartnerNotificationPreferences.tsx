import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { BellRing, Bell, Mail, MessageSquare, Smartphone } from "lucide-react";
import { toast } from "sonner";
import type { NotificationPreferencesFormValues } from "../types";

const DEFAULT_VALUES: NotificationPreferencesFormValues = {
  invoiceReadyEmail: true,
  paymentReceivedEmail: true,
  paymentReceivedSms: false,
  weeklySummaryEmail: true,
  campaignReminderPush: true,
};

function NotificationItem({
  title,
  description,
  checked,
  onCheckedChange,
  icon,
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  icon: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:border-primary/20 hover:shadow-md">
      <div className="mt-0.5 rounded-xl bg-primary/10 p-2 text-primary">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-900">{title}</p>
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          </div>
          <Input
            type="checkbox"
            checked={checked}
            onChange={(event) => onCheckedChange(event.target.checked)}
            className="mt-1 h-4 w-4 shrink-0"
          />
        </div>
      </div>
    </label>
  );
}

export default function MediaPartnerNotificationPreferencesPage() {
  const { control, handleSubmit } = useForm<NotificationPreferencesFormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = () => {
    toast.success("Notification preferences saved.");
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">Notification Preferences</h2>
        <p className="mt-1 text-sm text-gray-500">Choose how your media partner team receives billing and operational alerts.</p>
      </div>

      <Card className="border border-primary/10 bg-linear-to-br from-white to-primary/5 shadow-sm">
        <CardHeader className="space-y-3">
          <CardTitle className="flex items-center gap-2 text-primary">
            <BellRing className="h-5 w-5" />
            Alert Channels
          </CardTitle>
          <p className="text-sm text-slate-600">Turn notifications on or off for your preferred channels.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Controller
              name="invoiceReadyEmail"
              control={control}
              render={({ field }) => (
                <NotificationItem
                  title="Invoice Ready by Email"
                  description="Get notified when an invoice is ready to review or send."
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  icon={<Mail className="h-4 w-4" />}
                />
              )}
            />
            <Controller
              name="paymentReceivedEmail"
              control={control}
              render={({ field }) => (
                <NotificationItem
                  title="Payment Received by Email"
                  description="Receive an email whenever a payout or invoice payment is confirmed."
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  icon={<Bell className="h-4 w-4" />}
                />
              )}
            />
            <Controller
              name="paymentReceivedSms"
              control={control}
              render={({ field }) => (
                <NotificationItem
                  title="Payment Received by SMS"
                  description="Get a quick SMS alert for every successful payment notification."
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  icon={<Smartphone className="h-4 w-4" />}
                />
              )}
            />
            <Controller
              name="weeklySummaryEmail"
              control={control}
              render={({ field }) => (
                <NotificationItem
                  title="Weekly Revenue Summary"
                  description="Send a weekly summary of revenue, payouts, and outstanding invoices."
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  icon={<MessageSquare className="h-4 w-4" />}
                />
              )}
            />
            <div className="lg:col-span-2">
              <Controller
                name="campaignReminderPush"
                control={control}
                render={({ field }) => (
                  <NotificationItem
                    title="Campaign Deadline Reminder"
                    description="Keep the team aligned with in-app reminders for important deadlines."
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    icon={<BellRing className="h-4 w-4" />}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <Button onClick={handleSubmit(onSubmit)} className="bg-primary text-white hover:bg-primary/90">
              Save Notification Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}