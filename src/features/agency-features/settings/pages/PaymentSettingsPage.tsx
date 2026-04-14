import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PaymentMethodType = "CREDIT_CARD" | "MOBILE_MONEY" | "CRYPTO";

export default function PaymentSettingsPage() {
  const [paymentMethodType, setPaymentMethodType] = useState<PaymentMethodType>("CREDIT_CARD");
  const [paymentMethodLabel, setPaymentMethodLabel] = useState("");

  const existingMethods = [
    { id: "pm-1", type: "CREDIT_CARD", label: "Visa •••• 4242" },
    { id: "pm-2", type: "MOBILE_MONEY", label: "MTN MoMo •••• 2048" },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">Payment Methods</h2>
        <p className="mt-1 text-sm text-gray-500">Add and manage payment methods for billing and subscriptions.</p>
      </div>

      <Card className="border border-violet-100">
        <CardHeader>
          <CardTitle className="text-primary">Add Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <p className="mb-1 text-sm font-medium text-gray-900">Method Type</p>
              <Select value={paymentMethodType} onValueChange={(value) => setPaymentMethodType(value as PaymentMethodType)}>
                <SelectTrigger className="input-field w-full">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent className="bg-white border-none">
                  <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                  <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                  <SelectItem value="CRYPTO">Crypto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <p className="mb-1 text-sm font-medium text-gray-900">Method Details</p>
              <Input
                value={paymentMethodLabel}
                onChange={(e) => setPaymentMethodLabel(e.target.value)}
                placeholder="e.g., Visa •••• 4242 or Wallet ID"
                className="input-field"
              />
            </div>
          </div>

          <Button type="button" className="bg-primary text-white hover:bg-primary/90">Add Payment Method</Button>
        </CardContent>
      </Card>

      <Card className="border border-violet-100">
        <CardHeader>
          <CardTitle className="text-primary">Saved Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {existingMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
              <div>
                <p className="font-medium text-gray-900">{method.label}</p>
                <p className="text-xs text-gray-500">{method.type.replace("_", " ")}</p>
              </div>
              <Button type="button" variant="outline">Remove</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
