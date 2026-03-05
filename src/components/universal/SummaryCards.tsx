export interface SummaryCardsProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ElementType;
  trendIcon: React.ElementType;
  bgColor?: string;
}

export default function SummaryCards({ title, value, change, icon: Icon, trendIcon: TrendIcon, bgColor }: SummaryCardsProps) {
  return (
    <div className={`group relative overflow-hidden rounded-xl bg-linear-to-br ${bgColor || 'from-purple-500 to-purple-700'} p-6 text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 cursor-pointer`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
      <div className="relative flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center gap-1 text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
          <TrendIcon className="w-3 h-3" />
          <span>{change}</span>
        </div>
      </div>
      <div className="relative">
        <p className="text-sm font-medium text-purple-100 mb-1">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-xs text-purple-200 mt-2">+3 from last month</p>
      </div>
    </div>
  )
}
