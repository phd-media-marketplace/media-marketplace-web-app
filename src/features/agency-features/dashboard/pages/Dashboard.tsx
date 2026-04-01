import { Button } from "@/components/ui/button";
import { 
  Megaphone, 
  // ShoppingCart,  
  // FileText,
  // TrendingUp,
  // TrendingDown,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Star,
  Users,
  Target,
  Coins,
  Clock1,
  MapPin,
  CalendarDays,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { CampaignsData, recommendedPackages, campaignChannels } from "../dummy-data";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import SummaryCards from "@/components/universal/SummaryCards";
import type { SummaryCardsProps } from "@/components/universal/SummaryCards";
import { agencySummaryCardsData } from "../../contents/dashboard-content";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'reach' | 'impressions' | 'spend'>('reach');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null);

  // Define color schemes for different media types
  const getCardColors = (mediaType: string) => {
    const colors = {
      TV: {
        gradient: 'from-purple-600 to-purple-800',
        badge: 'bg-purple-400/20 text-purple-100 border-purple-400/30',
        icon: 'bg-purple-400/30',
        button: 'bg-purple-500 hover:bg-purple-600 border-purple-400'
      },
      DIGITAL: {
        gradient: 'from-blue-600 to-cyan-700',
        badge: 'bg-cyan-400/20 text-cyan-100 border-cyan-400/30',
        icon: 'bg-cyan-400/30',
        button: 'bg-cyan-500 hover:bg-cyan-600 border-cyan-400'
      },
      RADIO: {
        gradient: 'from-orange-600 to-red-700',
        badge: 'bg-orange-400/20 text-orange-100 border-orange-400/30',
        icon: 'bg-orange-400/30',
        button: 'bg-orange-500 hover:bg-orange-600 border-orange-400'
      },
      OOH: {
        gradient: 'from-green-600 to-emerald-800',
        badge: 'bg-green-400/20 text-green-100 border-green-400/30',
        icon: 'bg-green-400/30',
        button: 'bg-green-500 hover:bg-green-600 border-green-400'
      },
      PRINT: {
        gradient: 'from-pink-600 to-rose-800',
        badge: 'bg-pink-400/20 text-pink-100 border-pink-400/30',
        icon: 'bg-pink-400/30',
        button: 'bg-pink-500 hover:bg-pink-600 border-pink-400'
      }
    };
    return colors[mediaType as keyof typeof colors] || colors.TV;
  };

  // Sort campaigns based on selected metric
  const campaigns = [...CampaignsData].sort((a, b) => {
    if (sortBy === 'spend') {
      return b.spend - a.spend;
    }
    return b.metrics[sortBy] - a.metrics[sortBy];
  });

  // Get campaign channels with their performance
  const getCampaignChannels = (channelNames: string[]) => {
    return campaignChannels.filter(ch => channelNames.includes(ch.name));
  };

  // Toggle campaign expansion
  const toggleCampaign = (campaignName: string) => {
    setExpandedCampaign(expandedCampaign === campaignName ? null : campaignName);
  };

  // Format numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  // Auto-slide timer for recommended packages
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % recommendedPackages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleBuyMedia = () => {
    navigate('/client/marketplace');
  }


  return (
    <div className="space-y-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-primary tracking-tight">Dashboard</h2> 
        <div className="flex gap-2 sm:gap-4">
          <Button variant="outline" size="sm" className="border border-secondary whitespace-nowrap">Plan with AI ✨ </Button>
          <Button variant="outline" size="sm" className="bg-secondary border-none whitespace-nowrap" onClick={handleBuyMedia}>Buy Media</Button>
        </div>
      
      </div>
      {/* Summary Cards Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {agencySummaryCardsData.map((card:SummaryCardsProps, index:number) => (
          <SummaryCards key={index} {...card} />
        ))}
      </div>

      {/* Main Section */}
      <div className="grid gap-6 lg:grid-cols-3 overflow-hidden">
        {/* Active Campaign - Takes 2 columns */}
        <div className="lg:col-span-2 rounded-xl bg-purple/20 border border-gray-100 shadow-xl">
          <div className="p-6 border-b-2 border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="flex items-center gap-3 text-lg md:text-xl lg:text-xl font-bold md:font-medium text-primary">
                <span className="p-2 bg-purple-100 rounded-full"><Megaphone className="w-5 h-5"/></span>
                Active Campaigns
              </h3>
              <div className="flex flex-col md:flex-row lg:flex-row md:items-center lg:items-center gap-2">  
                <p className="text-base md:text-lg lg:text-lg hidden md:block lg:block">Sort By:</p>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'reach' | 'impressions' | 'spend')}>
                  <SelectTrigger className="w-32 border-secondary">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reach">
                      Reach
                    </SelectItem>
                    <SelectItem value="impressions">
                      Impressions
                    </SelectItem>
                    <SelectItem value="spend">
                      Spend
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="p-3 max-h-150 overflow-y-auto">
            <div className="space-y-2">
              {campaigns.map((campaign) => {
                const isExpanded = expandedCampaign === campaign.campaignName;
                const channelDetails = getCampaignChannels(campaign.channel);
                const statusColor = campaign.status === 'active' ? 'text-green-600' : 
                                    campaign.status === 'paused' ? 'text-yellow-600' : 'text-gray-600';
                
                return (
                  <div key={campaign.campaignName} className="border-b border-gray-100 rounded-lg overflow-hidden">
                    {/* Campaign Row */}
                    <div 
                      onClick={() => toggleCampaign(campaign.campaignName)}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="shrink-0">
                          {isExpanded ? 
                            <ChevronDown className="w-5 h-5 text-primary" /> : 
                            <ChevronRight className="w-5 h-5 text-primary" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-primary truncate">{campaign.campaignName}</p>
                            <Badge variant="outline" className={`text-xs ${statusColor} border-current`}>
                              {campaign.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{campaign.channel.length} channel{campaign.channel.length > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 lg:gap-6 text-center min-w-0 w-full sm:w-auto">
                        <div>
                          <div className="flex items-center gap-1 justify-center text-sm font-semibold">
                            <Users className="w-3 h-3 text-muted-foreground" />
                            {formatNumber(campaign.metrics.reach)}
                          </div>
                          <p className="text-xs text-muted-foreground">Reach</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 justify-center text-sm font-semibold">
                            <Eye className="w-3 h-3 text-muted-foreground" />
                            {formatNumber(campaign.metrics.impressions)}
                          </div>
                          <p className="text-xs text-muted-foreground">Impressions</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 justify-center text-sm font-semibold">
                            <Coins className="w-3 h-3 text-muted-foreground" />
                            {formatNumber(campaign.spend)}
                          </div>
                          <p className="text-xs text-muted-foreground">Spend</p>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Channel Details */}
                    {isExpanded && (
                      <div className="bg-muted/20 border-t">
                        <div className="p-4 space-y-3">
                          <h4 className="text-sm font-semibold text-primary mb-3">Channel Performance</h4>
                          {channelDetails.map((channel) => (
                            <div 
                              key={channel.id}
                              className="flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className="w-8 h-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                                  {channel.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm truncate">{channel.name}</p>
                                    {channel.trend === 'up' && <ArrowUpRight className="w-3 h-3 text-green-500" />}
                                    {channel.trend === 'down' && <ArrowDownRight className="w-3 h-3 text-red-500" />}
                                    {channel.trend === 'stable' && <Minus className="w-3 h-3 text-yellow-500" />}
                                  </div>
                                  <p className="text-xs text-muted-foreground">{channel.mediaType}</p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                  <p className="text-xs font-semibold">{formatNumber(channel.reach)}</p>
                                  <p className="text-xs text-muted-foreground">Reach</p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold">{formatNumber(channel.impressions)}</p>
                                  <p className="text-xs text-muted-foreground">Impressions</p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold">{formatNumber(channel.spend)}</p>
                                  <p className="text-xs text-muted-foreground">Spend</p>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* Campaign Summary */}
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div>
                                <p className="text-xs text-muted-foreground">Budget</p>
                                <p className="font-semibold">₵{campaign.budget.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Total Spend</p>
                                <p className="font-semibold">₵{campaign.spend.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Remaining</p>
                                <p className="font-semibold text-green-600">₵{(campaign.budget - campaign.spend).toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Avg Frequency</p>
                                <p className="font-semibold">{campaign.metrics.AvgFrequency.toFixed(1)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recommended Media Packages - Takes 1 column */}
        <div className="min-h-45">
          <div className="relative z-10">
            <div className="flex flex-col items-center w-full">
              <div className="flex flex-col items-center gap-4 h-145 w-full rounded-xl overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className={`flex flex-col w-full h-full rounded-xl bg-linear-to-br ${getCardColors(recommendedPackages[currentSlide].mediaType).gradient} text-white shadow-2xl overflow-hidden`}
                  >
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />
                          
                    {/* Card Content */}
                    <div className="relative p-6 space-y-4">
                      {/* Header with Badge and Price */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <Badge variant="outline" className={`${getCardColors(recommendedPackages[currentSlide].mediaType).badge} border`}>
                            {recommendedPackages[currentSlide].mediaType}
                          </Badge>
                          {recommendedPackages[currentSlide].badge && (
                            <Badge className="ml-2 bg-[#C8F526] text-[#2D0A4E] hover:bg-[#C8F526]/90 border-none">
                              <Star className="w-3 h-3 mr-1" fill="currentColor" />
                              {recommendedPackages[currentSlide].badge}
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          {recommendedPackages[currentSlide].discount && (
                            <p className="text-xs text-white/70 line-through">
                              GH₵{recommendedPackages[currentSlide].cost.toLocaleString()}
                            </p>
                          )}
                          <div className="flex items-baseline gap-1">
                            <Coins className="w-4 h-4 text-[#C8F526]" />
                            <span className="text-2xl font-bold">
                              GH₵{(recommendedPackages[currentSlide].cost * 
                                (1 - (recommendedPackages[currentSlide].discount || 0) / 100)).toLocaleString()}
                            </span>
                          </div>
                          {recommendedPackages[currentSlide].discount && (
                            <p className="text-xs text-[#C8F526] font-semibold">
                              Save {recommendedPackages[currentSlide].discount}%
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Title and Channel */}
                      <div>
                        <h3 className="text-xl font-bold mb-1">{recommendedPackages[currentSlide].title}</h3>
                        <p className="text-sm text-white/80 flex items-center gap-1">
                          <Target className="w-3.5 h-3.5" />
                          {recommendedPackages[currentSlide].channel}
                        </p>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className={`flex items-center gap-2 p-3 rounded-lg ${getCardColors(recommendedPackages[currentSlide].mediaType).icon}`}>
                          <Clock1 className="w-4 h-4 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-white/70">Duration</p>
                            <p className="text-sm font-semibold truncate">{recommendedPackages[currentSlide].duration}</p>
                          </div>
                        </div>
                        
                        <div className={`flex items-center gap-2 p-3 rounded-lg ${getCardColors(recommendedPackages[currentSlide].mediaType).icon}`}>
                          <Users className="w-4 h-4 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-white/70">Reach</p>
                            <p className="text-sm font-semibold truncate">{recommendedPackages[currentSlide].reach}</p>
                          </div>
                        </div>

                        {recommendedPackages[currentSlide].location && (
                          <div className={`flex items-center gap-2 p-3 rounded-lg ${getCardColors(recommendedPackages[currentSlide].mediaType).icon}`}>
                            <MapPin className="w-4 h-4 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-white/70">Location</p>
                              <p className="text-sm font-semibold truncate">{recommendedPackages[currentSlide].location}</p>
                            </div>
                          </div>
                        )}
                        
                        {recommendedPackages[currentSlide].packageduration && (
                          <div className={`flex items-center gap-2 p-3 rounded-lg ${getCardColors(recommendedPackages[currentSlide].mediaType).icon}`}>
                            <CalendarDays className="w-4 h-4 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-white/70">Package</p>
                              <p className="text-sm font-semibold truncate">
                                {recommendedPackages[currentSlide].packageduration} month{recommendedPackages[currentSlide].packageduration > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Demographics */}
                      {recommendedPackages[currentSlide].demographics && (
                        <div className={`p-3 rounded-lg ${getCardColors(recommendedPackages[currentSlide].mediaType).icon}`}>
                          <p className="text-xs text-white/70 mb-1">Target Demographics</p>
                          <p className="text-sm font-semibold">{recommendedPackages[currentSlide].demographics}</p>
                        </div>
                      )}

                      {/* Spot Time */}
                      <div className={`p-3 rounded-lg ${getCardColors(recommendedPackages[currentSlide].mediaType).icon}`}>
                        <p className="text-xs text-white/70 mb-1">Spot Time</p>
                        <p className="text-sm font-semibold">{recommendedPackages[currentSlide].spotTime}</p>
                      </div>

                      {/* Action Button */}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`w-full ${getCardColors(recommendedPackages[currentSlide].mediaType).button} text-white border-2 font-semibold shadow-lg hover:shadow-xl transition-all`}
                      >
                        View Package Details
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* Dots indicator */}
              <div className="flex gap-2 mt-6">
                {recommendedPackages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'w-6 h-1.5 bg-[#C8F526]' 
                        : 'w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>  
   </div>
  );
}
