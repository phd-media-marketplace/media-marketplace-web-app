import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dummyMediaPlans } from "../../media-planning/dummy-data";
import { useAuthStore } from "@/features/auth/store/auth-store";
import type { MediaPackage } from "../types";

type AddToPlanMode = "existing" | "new";

type PackagePlanState = {
    packageId: string;
    packageName: string;
    mediaType: string;
    existingPlanId?: string;
};

interface AddToPlanDialogProps {
    mediaPackage: MediaPackage;
    triggerClassName?: string;
    triggerLabel?: string;
}

export default function AddToPlanDialog({
    mediaPackage,
    triggerClassName,
    triggerLabel = "Add to Plan",
}: AddToPlanDialogProps) {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [planMode, setPlanMode] = useState<AddToPlanMode>("existing");
    const [selectedDraftPlanId, setSelectedDraftPlanId] = useState<string>("");

    const draftPlans = useMemo(() => dummyMediaPlans.filter((plan) => plan.status === "DRAFT"), []);

    const loginState = {
        postLoginAction: "create-media-plan",
        packageState: {
            packageId: mediaPackage.id,
            packageName: mediaPackage.packageName,
            mediaType: mediaPackage.mediaType,
        },
    };

    const handleContinue = () => {
        const packageState: PackagePlanState = {
            packageId: mediaPackage.id,
            packageName: mediaPackage.packageName,
            mediaType: mediaPackage.mediaType,
            ...(planMode === "existing" && selectedDraftPlanId ? { existingPlanId: selectedDraftPlanId } : {}),
        };

        const createRoute = user?.tenantType === "CLIENT"
            ? "/client/media-planning/create"
            : "/agency/media-planning/create";

        // Pass the selected package into the builder so the plan can be seeded immediately.
        navigate(createRoute, { state: packageState });
        setIsOpen(false);
    };

    const handleTriggerClick = () => {
        if (!user) {
            navigate("/login", { state: loginState });
            return;
        }

        setIsOpen(true);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Button type="button" className={triggerClassName} onClick={handleTriggerClick}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                {triggerLabel}
            </Button>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add this package to a plan</DialogTitle>
                    <DialogDescription>
                        Choose an existing draft plan or start a new one with this package preloaded.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
                        <button
                            type="button"
                            onClick={() => setPlanMode("existing")}
                            className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${planMode === "existing" ? "bg-white text-slate-900 shadow" : "text-slate-500"}`}
                        >
                            Existing draft plan
                        </button>
                        <button
                            type="button"
                            onClick={() => setPlanMode("new")}
                            className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${planMode === "new" ? "bg-white text-slate-900 shadow" : "text-slate-500"}`}
                        >
                            Create new plan
                        </button>
                    </div>

                    {planMode === "existing" ? (
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-slate-700">Choose a drafted campaign plan</p>
                            <Select value={selectedDraftPlanId} onValueChange={setSelectedDraftPlanId}>
                                <SelectTrigger className="w-full input-field">
                                    <SelectValue placeholder="Select a draft plan" />
                                </SelectTrigger>
                                <SelectContent className="w-full select-trigger-bg">
                                    {draftPlans.length > 0 ? (
                                        draftPlans.map((plan) => (
                                            <SelectItem key={plan.id} value={plan.id!}>
                                                {plan.campaignName} - {plan.clientName}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="no-drafts" disabled>
                                            No draft plans available
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-slate-500">
                                Only draft plans are shown here so the package can be added before approval.
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                            We will open the create plan page with this package preloaded so you can build the campaign from scratch.
                        </div>
                    )}
                </div>

                <DialogFooter className="pt-2">
                    <Button 
                        variant="outline" 
                        onClick={() => setIsOpen(false)} 
                        className="custom-secondary-outline-btn"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleContinue}
                        disabled={planMode === "existing" && !selectedDraftPlanId}
                        className="custom-primary-btn disabled:bg-primary/50 disabled:text-white/70 disabled:border-primary/50"
                    >
                        Continue
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}