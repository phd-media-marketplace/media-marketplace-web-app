import { ArrowLeft } from "lucide-react";
import type { ElementType} from "react";
import { getMediaTypeIcon } from "@/utils/formatters";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export interface HeaderProps {
  headerIcon?: ElementType<{ className?: string }>;
  mediaType?: string;
  title: string;
  description?: string;
  isActive?: boolean;
  returnTofunc?: () => void;
  ctaFunc?: () => void;
  ctaIcon?: ElementType<{ className?: string }>;
  backbtnVisible?: boolean;
  ctabtnText?: string;
}

export default function Header({
  headerIcon: HeaderIcon,
  mediaType,
  title,
  description,
  isActive,
  returnTofunc,
  ctaFunc,
  ctaIcon: CtaIcon,
  ctabtnText,
  backbtnVisible = true
}: HeaderProps) {
  const iconContent = HeaderIcon
    ? <HeaderIcon className="w-6 h-6" />
    : mediaType
      ? <span className="text-xl leading-none">{getMediaTypeIcon(mediaType)}</span>
      : null;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {iconContent && (
          <div className="p-2 bg-primary/10 rounded-lg">
            {iconContent}
          </div>
        )}

        <div>
          <h2 className="text-3xl font-bold text-primary tracking-tight">
            {title}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-500">{description}</p>
            {isActive !== undefined && (
              <Badge
                variant={isActive ? "default" : "secondary"}
                className={`text-xs ${isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {isActive ? "Active" : "Inactive"}
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {backbtnVisible === true && (
          <Button
            size="sm"
            variant="outline"
            onClick={returnTofunc}
            className="border-secondary hover:bg-secondary"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        )}
        {ctaFunc && (
          <Button
            onClick={ctaFunc}
            className="bg-primary border text-white hover:bg-white hover:text-primary border-primary"
          >
            {CtaIcon && <CtaIcon className="w-4 h-4 mr-2" />}
            {ctabtnText}
          </Button>
        )}
      </div>
    </div>
  );
}
