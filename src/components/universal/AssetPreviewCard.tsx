import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Image as ImageIcon, Sparkles } from "lucide-react";

export interface AssetPreviewCardProps {
  assets?: string[];
  title?: string;
  description?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export default function AssetPreviewCard({
  assets = [],
  title = "Asset Preview",
  description = "Uploaded assets will appear here for a quick preview",
  emptyTitle = "No asset uploaded yet",
  emptyMessage ,
  actionLabel,
  actionHref,
  onAction,
  className = "",
}: AssetPreviewCardProps) {
  const assetCount = assets.length;
  const primaryAsset = assets[0];
  const thumbnailAssets = assets.slice(0, 4);

  return (
    <Card className={`overflow-hidden border border-secondary bg-linear-to-br lg:py-4 from-secondary/5 via-white to-blue-50 shadow-sm ${className}`}>
        <CardHeader className="border-b border-secondary/30 pb-2">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-primary text-lg font-bold">{title}</CardTitle>
                <Badge variant="secondary" className="bg-secondary text-primary/90  ">
                    {assetCount} asset{assetCount === 1 ? "" : "s"}
                </Badge>
            </div>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
            </div>
        </CardHeader>

      <CardContent className="space-y-4 pt-5 lg:px-4">
        {assetCount > 0 && primaryAsset ? (
          <>
            <div className="relative overflow-hidden rounded-2xl border border-secondary/20 bg-white shadow-sm">
              <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-primary/80 shadow-sm backdrop-blur">
                <Sparkles className="h-3 w-3" />
                Primary asset
              </div>
              <img
                src={primaryAsset}
                alt={`${title} preview`}
                className="h-56 w-full object-cover"
              />
            </div>

            {thumbnailAssets.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {thumbnailAssets.map((asset, index) => (
                  <a
                    key={`${asset}-${index}`}
                    href={asset}
                    target="_blank"
                    rel="noreferrer"
                    className="group overflow-hidden rounded-xl border border-secondary/20 bg-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    <img
                      src={asset}
                      alt={`${title} asset ${index + 1}`}
                      className="h-20 w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </a>
                ))}
              </div>
            )}

            {(actionHref || onAction) && (
              <div className="flex items-center justify-between rounded-xl border border-secondary/20 bg-secondary/10 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-primary/80">
                    {assetCount} uploaded file{assetCount === 1 ? "" : "s"}
                  </p>
                  <p className="text-xs text-primary/80">Open any asset in a new tab to inspect the full preview.</p>
                </div>

                {actionHref ? (
                  <Button asChild size="sm" variant="outline" className="border-secondary/20 text-secondary hover:bg-secondary/10">
                    <a href={actionHref}>
                      {actionLabel}
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={onAction} className="border-secondary/20 text-secondary hover:bg-secondary/10">
                    {actionLabel}
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-secondary bg-white/80 p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/20 text-primary/90">
              <ImageIcon className="h-8 w-8" />
            </div>
            <h4 className="mt-4 text-base font-semibold text-gray-900">{emptyTitle}</h4>
            <p className="mt-2 text-sm text-gray-600">{emptyMessage}</p>

            {(actionHref || onAction) && (
              <div className="mt-4">
                {actionHref ? (
                  <Button asChild size="sm" className="bg-secondary/80 text-primary hover:bg-secondary/70">
                    <a href={actionHref}>{actionLabel}</a>
                  </Button>
                ) : (
                  <Button size="sm" onClick={onAction} className="bg-secondary text-white hover:bg-secondary/70">
                    {actionLabel}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}