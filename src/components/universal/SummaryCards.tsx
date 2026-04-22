export interface SummaryCardsProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change?: string;
  trendIcon?: React.ElementType;
  footerText?: string;
  bgColor?: string;
}

export default function SummaryCards({
  title,
  value,
  change,
  icon: Icon,
  trendIcon: TrendIcon,
  footerText,
  bgColor,
}: SummaryCardsProps) {
  const showTrend = Boolean(change && TrendIcon);
  const TrendIconComponent = TrendIcon;
  const iconContainerClassName = "h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform";

  return (
    <div className={`group relative overflow-hidden rounded-xl bg-linear-to-br ${bgColor || 'from-purple-500 to-purple-700'} p-6 text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 cursor-pointer`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
      {showTrend && TrendIconComponent ? (
        <>
          <div className="relative mb-4 flex items-center justify-between">
            <div className={iconContainerClassName}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-sm font-medium">
              <TrendIconComponent className="w-3 h-3" />
              <span>{change}</span>
            </div>
          </div>
          <div className="relative">
            <p className="mb-1 text-sm font-medium text-white/85">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {footerText ? <p className="mt-2 text-xs text-white/75">{footerText}</p> : null}
          </div>
        </>
      ) : (
        <div className="relative flex items-center gap-8">
          <div className={`${iconContainerClassName} shrink-0`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-2 justify-end"> 
              <p className="text-3xl font-bold leading-tight">{value}</p>
              <p className="mb-1 text-sm font-medium text-white/85">{title}</p>
            </div>
            {footerText ? <p className="mt-1 text-xs text-white/75">{footerText}</p> : null}
          </div>
        </div>
      )}
    </div>
  )
}
