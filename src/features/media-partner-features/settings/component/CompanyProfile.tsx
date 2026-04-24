import { useRef, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { Controller, useForm } from "react-hook-form";
import FileUpload, { type UploadTask, type UploadedFileResult } from "@/components/universal/FileUpload";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import type { MediaPartnerCompanyProfile } from "../types";

export default function CompanyProfile() {
  const user = useAuthStore((state) => state.user);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string>("");

  const { control, handleSubmit, setValue } = useForm<MediaPartnerCompanyProfile>({
    defaultValues: {
      name: user?.mediaPartner?.name ?? user?.tenantName ?? "",
      code: user?.mediaPartner?.code ?? "",
      type: user?.mediaPartner?.type ?? "",
      contactName: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
      contactEmail: user?.email ?? "",
      contactPhone: "",
      address: "",
      website: "",
      paymentTerms: 30,
      commissionRate: 0,
      notes: "",
      metadata: {
        logo: "",
        BUSINESS_REGISTRATION_DOCUMENTS: [],
        TAX_IDENTIFICATION_DOCUMENTS: [],
      },
    },
  });

  const logoUrl = logoPreviewUrl;
  const companyInitials = (user?.mediaPartner?.name ?? user?.tenantName ?? "MP").slice(0, 2).toUpperCase();

  const extractUrlsFromTasks = (tasks: UploadTask[]): string[] => {
    return tasks
      .filter((task) => task.status === "success" && task.result?.url)
      .map((task) => task.result?.url)
      .filter((url): url is string => Boolean(url));
  };

  const uploadLocalFile = async (
    file: File,
    options: { signal: AbortSignal; onProgress: (progress: number) => void }
  ): Promise<UploadedFileResult> => {
    const { signal, onProgress } = options;

    for (let progress = 0; progress <= 100; progress += 20) {
      if (signal.aborted) {
        throw new Error("Upload canceled");
      }
      onProgress(progress);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    return {
      fileName: file.name,
      size: file.size,
      mimeType: file.type,
      url: URL.createObjectURL(file),
    };
  };

  const onLogoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Logo must be an image file.");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setLogoPreviewUrl(localUrl);
    setValue("metadata.logo", localUrl, { shouldDirty: true });
    event.target.value = "";
  };

  const onSubmit = (data: MediaPartnerCompanyProfile) => {
    console.log("Company profile payload:", data);
  };

  return (
    <Card className="border border-violet-100">
      <CardHeader>
        <CardTitle className="text-primary text-2xl font-bold">Company Profile</CardTitle>
        <p className="text-sm text-slate-500">Manage your media partner company details and business information.</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2 flex items-center gap-4 rounded-lg border border-primary/15 bg-primary/5 p-4">
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onLogoFileChange}
            />
            <Avatar className="h-20 w-20 overflow-visible border-2 border-white shadow ring-2 ring-primary/20">
              <AvatarImage src={logoUrl} alt="Company logo" className="object-cover" />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                {companyInitials}
              </AvatarFallback>
              <AvatarBadge className="size-7! -bottom-1 -right-1 rounded-full bg-primary ring-2 ring-white [&>svg]:size-3!">
                <Camera className="text-white" />
              </AvatarBadge>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-primary">Company Logo</p>
              <p className="text-xs text-gray-600">Upload a square image for best display quality.</p>
            </div>
            <Button type="button" variant="outline" onClick={() => logoInputRef.current?.click()}>
              {logoUrl ? "Change Logo" : "Upload Logo"}
            </Button>
          </div>

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <div>
                <label className="mb-1 block text-sm font-medium text-primary">Company Name</label>
                <Input {...field} className="input-field" />
              </div>
            )}
          />

          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <div>
                <label className="mb-1 block text-sm font-medium text-primary">Company Code</label>
                <Input {...field} className="input-field" />
              </div>
            )}
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <div>
                <label className="mb-1 block text-sm font-medium text-primary">Company Type</label>
                <Input {...field} className="input-field" />
              </div>
            )}
          />

          <Controller
            name="website"
            control={control}
            render={({ field }) => (
              <div>
                <label className="mb-1 block text-sm font-medium text-primary">Website</label>
                <Input {...field} className="input-field" placeholder="https://example.com" />
              </div>
            )}
          />

          <Controller
            name="contactName"
            control={control}
            render={({ field }) => (
              <div>
                <label className="mb-1 block text-sm font-medium text-primary">Contact Name</label>
                <Input {...field} className="input-field" />
              </div>
            )}
          />

          <Controller
            name="contactEmail"
            control={control}
            render={({ field }) => (
              <div>
                <label className="mb-1 block text-sm font-medium text-primary">Contact Email</label>
                <Input {...field} type="email" className="input-field" />
              </div>
            )}
          />

          <Controller
            name="contactPhone"
            control={control}
            render={({ field }) => (
              <div>
                <label className="mb-1 block text-sm font-medium text-primary">Contact Phone</label>
                <Input {...field} className="input-field" />
              </div>
            )}
          />

          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <div>
                <label className="mb-1 block text-sm font-medium text-primary">Address</label>
                <Input {...field} className="input-field" />
              </div>
            )}
          />

          <Controller
            name="paymentTerms"
            control={control}
            render={({ field }) => (
              <div>
                <label className="mb-1 block text-sm font-medium text-primary">Payment Terms (days)</label>
                <Input
                  {...field}
                  type="number"
                  className="input-field"
                  onChange={(event) => field.onChange(Number(event.target.value) || 0)}
                />
              </div>
            )}
          />

          <Controller
            name="commissionRate"
            control={control}
            render={({ field }) => (
              <div>
                <label className="mb-1 block text-sm font-medium text-primary">Commission Rate (%)</label>
                <Input
                  {...field}
                  type="number"
                  className="input-field"
                  onChange={(event) => field.onChange(Number(event.target.value) || 0)}
                />
              </div>
            )}
          />

          <div className="md:col-span-2 space-y-4">
            <FileUpload
              label="Business Registration Documents"
              helperText="Upload registration certificates or related documents"
              accept=".pdf,image/*"
              multiple
              maxFiles={6}
              maxFileSizeMB={8}
              onUpload={uploadLocalFile}
              onTasksChange={(tasks) => {
                setValue("metadata.BUSINESS_REGISTRATION_DOCUMENTS", extractUrlsFromTasks(tasks), { shouldDirty: true });
              }}
              onValidationError={(message) => toast.error(message)}
            />

            <FileUpload
              label="Tax Identification Documents"
              helperText="Upload tax certificates or tax identification documents"
              accept=".pdf,image/*"
              multiple
              maxFiles={6}
              maxFileSizeMB={8}
              onUpload={uploadLocalFile}
              onTasksChange={(tasks) => {
                setValue("metadata.TAX_IDENTIFICATION_DOCUMENTS", extractUrlsFromTasks(tasks), { shouldDirty: true });
              }}
              onValidationError={(message) => toast.error(message)}
            />
          </div>

          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-primary">Notes</label>
                <Textarea {...field} rows={4} className="input-field resize-none" />
              </div>
            )}
          />
        </form>
      </CardContent>

      <CardFooter>
        <Button className="bg-primary text-white hover:bg-primary/90" onClick={handleSubmit(onSubmit)}>
          Save Company Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
