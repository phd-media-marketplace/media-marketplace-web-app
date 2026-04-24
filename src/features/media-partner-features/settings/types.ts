export type MediaPartnerCompanyProfile = {
  name: string;
  code: string;
  type: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  website: string;
  paymentTerms: number;
  commissionRate: number;
  notes: string;
  metadata: {
    logo: string;
    BUSINESS_REGISTRATION_DOCUMENTS: string[];
    TAX_IDENTIFICATION_DOCUMENTS: string[];
  };
};

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  tenantId: string;
  tenantName: string;
  roles: string[];
};

export type status = "ACTIVE" | "INACTIVE" | "PENDING";

export type TeamMember = {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  status: status;
}

export type PayoutMethod = "MOMO" | "BANK" | "CRYPTO";

export type SettlementCurrency = "GHS" | "USD" | "EUR";

export type MoMoProvider = "MTN" | "AIRTELTIGO" | "TELECEL";

export type CryptoNetwork = "USDT_TRON" | "USDT_ERC20" | "BTC";

export type BillingAccountFormValues = {
  paymentMethod: PayoutMethod;
  currency: SettlementCurrency;
  momoProvider: MoMoProvider;
  momoNumber: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  cryptoNetwork: CryptoNetwork;
  cryptoWalletAddress: string;
};

export type NotificationPreferencesFormValues = {
  invoiceReadyEmail: boolean;
  paymentReceivedEmail: boolean;
  paymentReceivedSms: boolean;
  weeklySummaryEmail: boolean;
  campaignReminderPush: boolean;
};