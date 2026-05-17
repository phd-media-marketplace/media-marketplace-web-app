import { Badge } from "@/components/ui/badge";

interface MediaTypeBadgeProps {
  mediaType: 'FM' | 'RADIO' | 'TV' | 'OOH' | 'DIGITAL';
}

/**
 * MediaTypeBadge Component
 * Displays color-coded badge for media types
 */
export function MediaTypeBadge({ mediaType }: MediaTypeBadgeProps) {
  const styles = {
    RADIO: "bg-purple-100 text-purple-800 border-purple-300",
    FM: "bg-purple-100 text-purple-800 border-purple-300",
    TV: "bg-blue-100 text-blue-800 border-blue-300",
    OOH: "bg-orange-100 text-orange-800 border-orange-300",
    DIGITAL: "bg-pink-100 text-pink-800 border-pink-300",
  };

  const display = mediaType === 'FM' ? 'RADIO' : mediaType;
  return (
    <Badge className={`${styles[mediaType as keyof typeof styles]} border text-xs`}>
      {display}
    </Badge>
  );
}
