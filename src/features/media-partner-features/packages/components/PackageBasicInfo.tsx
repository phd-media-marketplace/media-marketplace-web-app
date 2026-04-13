import { useState } from "react";
import { useWatch, type Control, type FieldErrors, type UseFormRegister, type UseFormSetValue } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type UploadTask } from "@/components/universal/FileUpload";
import { uploadPackageImage } from "../api";
import FileUploadDialog from "@/components/universal/FileUploadDialog";

type PackageBasicInfoFields = {
	packageName: unknown;
	description?: unknown;
	mediaType: "FM" | "TV" | "OOH" | "DIGITAL";
	reach: unknown;
	location?: unknown;
	demographics: unknown;
	packageDurationValue: unknown;
	packageDurationUnit: string;
	discount: unknown;
	metadata?: Record<string, unknown>;
};

interface PackageBasicInfoProps {
	control: unknown;
	register: unknown;
	setValue: unknown;
	errors: unknown;
}

export default function PackageBasicInfo({ control, register, setValue, errors }: PackageBasicInfoProps) {
	const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
	const formControl = control as Control<PackageBasicInfoFields>;
	const formRegister = register as UseFormRegister<PackageBasicInfoFields>;
	const formSetValue = setValue as UseFormSetValue<PackageBasicInfoFields>;
	const formErrors = errors as FieldErrors<PackageBasicInfoFields>;

	const mediaType = useWatch({ control: formControl, name: "mediaType" });
	const packageDurationUnit = useWatch({ control: formControl, name: "packageDurationUnit" });
	const demographics = (useWatch({ control: formControl, name: "demographics" }) || []) as string[];
	const metadata = (useWatch({ control: formControl, name: "metadata" }) || {}) as Record<string, unknown>;
	const packageNameError = formErrors.packageName as { message?: string } | undefined;
	const reachError = formErrors.reach as { message?: string } | undefined;
	const packageDurationValueError = formErrors.packageDurationValue as { message?: string } | undefined;
	const packageNameMessage = typeof packageNameError?.message === "string" ? packageNameError.message : "";
	const reachMessage = typeof reachError?.message === "string" ? reachError.message : "";
	const uploadedFiles = (metadata.packageImages as string[] | undefined) || [];

	const handleUploadTasks = (tasks: UploadTask[]) => {
		const urls = tasks
			.filter((task) => task.status === "success" && task.result?.url)
			.map((task) => task.result?.url)
			.filter((url): url is string => Boolean(url));

		if (urls.length === 0 && uploadedFiles.length === 0) return;

		formSetValue("metadata", {
			...metadata,
			packageImages: urls,
		});
	};

	return (
		<Card className="border border-violet-100">
			<CardHeader>
				<CardTitle className="text-primary text-lg font-bold">Package Information</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label className="mb-1 block text-sm font-medium text-primary">
							Package Name <span className="text-red-500">*</span>
						</label>
						<Input
							{...formRegister("packageName", { required: "Package name is required" })}
							placeholder="e.g., Prime Time Bundle"
							className={packageNameError ? "border-red-500" : "input-field"}
						/>
						{packageNameMessage && (
							<p className="mt-1 text-xs text-red-500">{packageNameMessage}</p>
						)}
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium text-primary">
							Media Type <span className="text-red-500">*</span>
						</label>
						<Select
							value={mediaType}
							onValueChange={(value) => formSetValue("mediaType", value as PackageBasicInfoFields["mediaType"])}
						>
							<SelectTrigger className="w-full input-field">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="bg-white border-none">
								<SelectItem value="FM">📻 Radio</SelectItem>
								<SelectItem value="TV">📺 TV</SelectItem>
								<SelectItem value="OOH">🏙️ Out-of-Home</SelectItem>
								<SelectItem value="DIGITAL">💻 Digital</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div>
					<label className="mb-1 block text-sm font-medium text-primary">Description</label>
					<Textarea
						{...formRegister("description")}
						placeholder="Describe your package..."
						rows={3}
						className="resize-none input-field"
					/>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label className="mb-1 block text-sm font-medium text-primary">
							Estimated Reach <span className="text-red-500">*</span>
						</label>
						<Input
							type="number"
							{...formRegister("reach", { required: "Reach is required", min: 0, valueAsNumber: true })}
							placeholder="e.g., 1000000"
							className={reachError ? "border-red-500" : "input-field"}
						/>
						{reachMessage && (
							<p className="mt-1 text-xs text-red-500">{reachMessage}</p>
						)}
						<p className="mt-1 text-xs text-gray-500">Number of people this package can reach</p>
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium text-primary">Location</label>
						<Input
							{...formRegister("location")}
							placeholder="e.g., Greater Accra, Ghana"
							className="input-field"
						/>
						<p className="mt-1 text-xs text-gray-500">Geographic coverage area</p>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-primary">Target Demographics</label>
                        <Input
                            value={demographics.join(", ")}
                            placeholder="e.g., Adults 25-45, Urban Youth (comma separated)"
                            className="input-field"
                            onChange={(e) => {
                                const nextDemographics = e.target.value.split(",").map((item) => item.trim()).filter(Boolean);
                                    formSetValue("demographics", nextDemographics);
                            }}
                        />
                        <p className="mt-1 text-xs text-gray-500">Enter demographics separated by commas</p>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-primary">Program Flyers / Images</label>
                        <button
                            type="button"
                            onClick={() => setIsUploadDialogOpen(true)}
                            className="input-field flex w-full items-center justify-between rounded-md border px-3 py-2 text-left"
                        >
                            <span className="text-sm text-gray-600">
                                {uploadedFiles.length > 0
                                    ? `${uploadedFiles.length} file(s) uploaded`
                                    : "No files uploaded yet"}
                            </span>
                            <span className="text-xs font-medium text-primary">Manage Uploads</span>
                        </button>
                        <p className="mt-1 text-xs text-gray-500">Open popup to add, remove, or retry uploads</p>
                    </div>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div>
						<label className="mb-1 block text-sm font-medium text-primary">
							Package Duration <span className="text-red-500">*</span>
						</label>
						<Input
							type="number"
							{...formRegister("packageDurationValue", { required: true, min: 1, valueAsNumber: true })}
							placeholder="1"
							min="1"
							className={packageDurationValueError ? "border-red-500" : "input-field"}
						/>
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium text-primary">
							Duration Unit <span className="text-red-500">*</span>
						</label>
						<Select
							value={packageDurationUnit}
							onValueChange={(value) => formSetValue("packageDurationUnit", value)}
						>
							<SelectTrigger className="w-full input-field">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="bg-white border-none">
								<SelectItem value="DAYS">Days</SelectItem>
								<SelectItem value="WEEKS">Weeks</SelectItem>
								<SelectItem value="MONTHS">Months</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium text-primary">Discount (%)</label>
						<Input
							type="number"
							{...formRegister("discount", { min: 0, max: 100, valueAsNumber: true })}
							placeholder="0"
							min="0"
							max="100"
							className="input-field"
						/>
					</div>
				</div>

			</CardContent>

            {/* File Upload Dialog */}
            <FileUploadDialog
                isOpen={isUploadDialogOpen}
                onOpenChange={setIsUploadDialogOpen}
                onUpload={(file, options) => uploadPackageImage(file, options)}
                onTasksChange={handleUploadTasks}
                uploadedFiles={uploadedFiles}
            />
		</Card>
	);
}
