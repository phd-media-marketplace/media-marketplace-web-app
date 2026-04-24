import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { Building2, CreditCard, Smartphone, Wallet } from "lucide-react";
import { toast } from "sonner";
import type { BillingAccountFormValues, CryptoNetwork, MoMoProvider, PayoutMethod, SettlementCurrency } from "../types";

const DEFAULT_VALUES: BillingAccountFormValues = {
  paymentMethod: "MOMO",
  currency: "GHS",
  momoProvider: "MTN",
  momoNumber: "",
  bankName: "",
  bankAccountName: "",
  bankAccountNumber: "",
  cryptoNetwork: "USDT_TRON",
  cryptoWalletAddress: "",
};

export default function MediaPartnerBillingSettings() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BillingAccountFormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  const [paymentMethod, setPaymentMethod] = useState<PayoutMethod>(DEFAULT_VALUES.paymentMethod);

  const paymentMethodIcon = useMemo(() => {
    if (paymentMethod === "MOMO") {
      return Smartphone;
    }
    if (paymentMethod === "BANK") {
      return Building2;
    }
    return Wallet;
  }, [paymentMethod]);

  const PaymentMethodIcon = paymentMethodIcon;

  const handleSaveBillingAccount = (data: BillingAccountFormValues) => {
    if (data.paymentMethod === "MOMO" && !data.momoNumber.trim()) {
      toast.error("Please provide a MoMo number.");
      return;
    }

    if (data.paymentMethod === "BANK" && (!data.bankName.trim() || !data.bankAccountName.trim() || !data.bankAccountNumber.trim())) {
      toast.error("Please complete all bank account fields.");
      return;
    }

    if (data.paymentMethod === "CRYPTO" && !data.cryptoWalletAddress.trim()) {
      toast.error("Please provide a crypto wallet address.");
      return;
    }

    toast.success("Billing account updated successfully.");
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">Billing Accounts</h2>
        <p className="mt-1 text-sm text-gray-500">Configure where your payouts are received.</p>
      </div>

      <Card className="border border-primary/10 bg-linear-to-br from-white to-primary/5 shadow-sm">
        <CardHeader className="space-y-3">
          <CardTitle className="flex items-center gap-2 text-primary">
            <CreditCard className="h-5 w-5" />
            Payout Billing Account
          </CardTitle>
          <p className="text-sm text-slate-600">Choose your payout channel: Mobile Money, Bank transfer, or Crypto wallet.</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-900">Payout Method</p>
              <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      const nextValue = value as PayoutMethod;
                      field.onChange(nextValue);
                      setPaymentMethod(nextValue);
                    }}
                  >
                    <SelectTrigger className="w-full input-field">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-none">
                      <SelectItem value="MOMO">Mobile Money (MoMo)</SelectItem>
                      <SelectItem value="BANK">Bank Account</SelectItem>
                      <SelectItem value="CRYPTO">Crypto Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-900">Settlement Currency</p>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(value) => field.onChange(value as SettlementCurrency)}>
                    <SelectTrigger className="w-full input-field">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-none">
                      <SelectItem value="GHS">GHS</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <PaymentMethodIcon className="h-4 w-4" />
              </div>
              <p className="text-sm font-semibold text-slate-800">{paymentMethod === "MOMO" ? "MoMo Details" : paymentMethod === "BANK" ? "Bank Account Details" : "Crypto Wallet Details"}</p>
            </div>

            {paymentMethod === "MOMO" ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-900">MoMo Provider</p>
                  <Controller
                    name="momoProvider"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={(value) => field.onChange(value as MoMoProvider)}>
                        <SelectTrigger className="w-full input-field">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-none">
                          <SelectItem value="MTN">MTN</SelectItem>
                          <SelectItem value="AIRTELTIGO">AirtelTigo</SelectItem>
                          <SelectItem value="TELECEL">Telecel</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-900">MoMo Number</p>
                  <Controller
                    name="momoNumber"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="e.g. 0240000000" className="input-field" />
                    )}
                  />
                  {errors.momoNumber ? <p className="text-xs text-red-600">{errors.momoNumber.message}</p> : null}
                </div>
              </div>
            ) : null}

            {paymentMethod === "BANK" ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-900">Bank Name</p>
                  <Controller
                    name="bankName"
                    control={control}
                    render={({ field }) => <Input {...field} placeholder="e.g. Ecobank" className="input-field" />}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-900">Account Name</p>
                  <Controller
                    name="bankAccountName"
                    control={control}
                    render={({ field }) => <Input {...field} placeholder="Business legal name" className="input-field" />}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-900">Account Number</p>
                  <Controller
                    name="bankAccountNumber"
                    control={control}
                    render={({ field }) => <Input {...field} placeholder="0000000000" className="input-field" />}
                  />
                </div>
              </div>
            ) : null}

            {paymentMethod === "CRYPTO" ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-900">Network</p>
                  <Controller
                    name="cryptoNetwork"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={(value) => field.onChange(value as CryptoNetwork)}>
                        <SelectTrigger className="w-full input-field">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-none">
                          <SelectItem value="USDT_TRON">USDT (TRON)</SelectItem>
                          <SelectItem value="USDT_ERC20">USDT (ERC20)</SelectItem>
                          <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-900">Wallet Address</p>
                  <Controller
                    name="cryptoWalletAddress"
                    control={control}
                    render={({ field }) => <Input {...field} placeholder="Paste wallet address" className="input-field" />}
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-end">
            <Button onClick={handleSubmit(handleSaveBillingAccount)} className="bg-primary text-white hover:bg-primary/90" disabled={isSubmitting}>
              Save Billing Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
