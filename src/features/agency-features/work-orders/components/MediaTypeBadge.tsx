import { Badge } from "@/components/ui/badge";

interface MediaTypeBadgeProps {
  mediaType: 'FM' | 'TV' | 'OOH' | 'DIGITAL';
}

/**
 * MediaTypeBadge Component
 * Displays color-coded badge for media types
 */
export function MediaTypeBadge({ mediaType }: MediaTypeBadgeProps) {
  const styles = {
    FM: "bg-purple-100 text-purple-800 border-purple-300",
    TV: "bg-blue-100 text-blue-800 border-blue-300",
    OOH: "bg-orange-100 text-orange-800 border-orange-300",
    DIGITAL: "bg-pink-100 text-pink-800 border-pink-300",
  };

  return (
    <Badge className={`${styles[mediaType]} border text-xs`}>
      {mediaType}
    </Badge>
  );
}
