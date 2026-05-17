import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {useQuery, useQueryClient, useMutation} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Radio, Tv, Package as PackageIcon, Percent } from "lucide-react";
import ListCard, { type StatItem } from "@/features/media-partner-features/Common-Components/ListCard";
// import { dummyPackages } from "../dummy-data";
import { toast } from "sonner";
import { formatDate } from "@/utils/formatters";
import NoDataCard from "@/components/universal/NoDataCard";
import Header from "@/components/universal/Header";
import ApprovalConfirmationDialogBox from "@/components/universal/ApprovalConfirmationDialogBox";
import { getFormErrorMessage } from "@/utils/error-handler";
import { deletePackage, listPackages } from "../api";
// import type { Package } from "../types";

export default function PackagesList() {
  const [selectedMediaType, setSelectedMediaType] = useState<'FM' | 'TV' | 'ALL'>('ALL');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const packagesQuery = useQuery({
    queryKey: ['packages', selectedMediaType],
    queryFn: () => listPackages(
      selectedMediaType === 'ALL' 
      ? undefined 
      : { mediaType: selectedMediaType }
    ),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const deleteMutation = useMutation({
    mutationFn: deletePackage,
    onSuccess: () => {
      toast.success('Package deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
    onError: (error: unknown) => {
      toast.error(getFormErrorMessage(error));
    },
  });
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<{ id: string; packageName?: string } | null>(null);

  const openDeleteConfirm = (pkg: { id: string; packageName?: string }) => {
    setPackageToDelete(pkg);
    setConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setPackageToDelete(null);
    setConfirmOpen(false);
  };

  const handleConfirmDelete = () => {
    if (packageToDelete) {
      deleteMutation.mutate(packageToDelete.id);
    }
    closeDeleteConfirm();
  };

  // Filter packages by media type
  const filteredPackages = selectedMediaType === 'ALL'
    ? packagesQuery.data?.packages || []
    : packagesQuery.data?.packages?.filter(pkg => pkg.mediaType === selectedMediaType) || [];

  // deletion now handled via confirmation dialog (openDeleteConfirm)

  // Helper to create media type icon component
  const createMediaTypeIconComponent = (mediaType: string) => {
    function MediaTypeIcon({ className }: { className?: string }) {
      switch (mediaType) {
        case 'FM':
          return <Radio className={className} />;
        case 'TV':
          return <Tv className={className} />;
        default:
          return <PackageIcon className={className} />;
      }
    }
    return MediaTypeIcon;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Header
        title="Packages"
        description="Create and manage advertising packages for your clients"
        backbtnVisible={false}
        ctaFunc={() => navigate('/media-partner/packages/create')}
        ctabtnText="Create Package"
        ctaIcon={Plus}
      />

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={selectedMediaType === 'ALL' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedMediaType('ALL')}
          className={selectedMediaType === 'ALL' ? 'bg-primary text-white' : 'border-secondary hover:bg-secondary'}
        >
          All
        </Button>
        <Button
          variant={selectedMediaType === 'FM' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedMediaType('FM')}
          className={selectedMediaType === 'FM' ? 'bg-primary text-white' : 'border-secondary hover:bg-secondary'}
        >
          <Radio className="w-4 h-4 mr-2" />
          Radio
        </Button>
        <Button
          variant={selectedMediaType === 'TV' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedMediaType('TV')}
          className={selectedMediaType === 'TV' ? 'bg-primary text-white' : 'border-secondary hover:bg-secondary'}
        >
          <Tv className="w-4 h-4 mr-2" />
          TV
        </Button>
      </div>

      {/* Packages Grid */}
      {filteredPackages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => {
            const hasValidityRange =
              typeof pkg.validFrom === "string" && typeof pkg.validTo === "string";

            // Build stats array
            const stats: StatItem[] = [
              {
                icon: PackageIcon,
                label: "Items",
                value: pkg.items.length,
                bgColor: "bg-blue-100",
                textColor: "text-blue-700",
              },
            ];

            // Add discount stat if applicable
            if (pkg.discount && pkg.discount > 0) {
              stats.push({
                icon: Percent,
                label: "Discount",
                value: `${pkg.discount}%`,
                bgColor: "bg-green-100",
                textColor: "text-green-700",
              });
            }

            return (
              <ListCard
                key={pkg.id}
                id={pkg.id}
                title={pkg.packageName}
                subtitle={`${pkg.mediaType} Package`}
                description={pkg.description}
                isActive={pkg.isActive}
                mediaIcon={createMediaTypeIconComponent(pkg.mediaType)}
                stats={stats}
                totalPrice={pkg.totalPrice}
                finalPrice={pkg.finalPrice}
                discount={pkg.discount}
                updatedAt={
                  hasValidityRange
                    ? `Valid: ${formatDate(pkg.validFrom!)} - To ${formatDate(pkg.validTo!)}`
                    : "Validity period not set"
                }
                onView={() => navigate(`/media-partner/packages/${pkg.id}`)}
                onEdit={() => navigate(`/media-partner/packages/${pkg.id}/edit`)}
                onDelete={() => openDeleteConfirm(pkg)}
                showPricingSection={true}
              />
            );
          })}
        </div>
      ) : (
          <NoDataCard
            title="Ooops! No Packages Found"
            message="You haven't created any packages yet or for the selected Media Type. Start by creating a new package to manage your media offerings."
            btnText="Create Package"
            redirectFunc={() => navigate('/media-partner/packages/create')}
            className="w-full lg:h-155 flex items-center justify-center"
          />
      )}
      <ApprovalConfirmationDialogBox
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={packageToDelete ? `Delete package "${packageToDelete.packageName ?? ''}"?` : 'Delete package?'}
        description="This action cannot be undone. Are you sure you want to permanently delete this package?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteConfirm}
        confirmDisabled={deleteMutation.isPending}
      />
    </div>
  );
}
