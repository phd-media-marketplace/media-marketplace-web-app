import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Eye, Radio, Tv, Calendar, Layers, DollarSign } from "lucide-react";
import type { RadioMetadata, TVMetadata, RadioAdType, TVAdType } from "../types";
import { dummyRateCards } from "../dummy-data";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface AdTypeCard {
  id: string;
  rateCardId: string;
  mediaPartnerName: string;
  mediaType: 'FM' | 'TV';
  adType: RadioAdType | TVAdType;
  segments: number;
  minRate: number;
  maxRate: number;
  totalRates: number;
  isActive: boolean;
  updatedAt: string;
}

export default function RateCardsList() {
  const [selectedMediaType, setSelectedMediaType] = useState<'FM' | 'TV' | 'ALL'>('ALL');
  const navigate = useNavigate();

  // Transform rate cards into ad type cards
  const getAdTypeCards = (): AdTypeCard[] => {
    const adTypeCards: AdTypeCard[] = [];

    dummyRateCards.forEach((rateCard) => {
      if (rateCard.mediaType === 'FM' && rateCard.metadata.mediaType === 'FM') {
        const metadata = rateCard.metadata as RadioMetadata;
        
        metadata.adTypeRates.forEach((adTypeRate, index) => {
          const rates: number[] = [];
          
          // Collect all unit rates from segments
          adTypeRate.RadioSegment.forEach(segment => {
            if (segment.UnitRate) {
              rates.push(segment.UnitRate);
            }
          });

          adTypeCards.push({
            id: `${rateCard.id}-${adTypeRate.adType}-${index}`,
            rateCardId: rateCard.id,
            mediaPartnerName: rateCard.mediaPartnerName,
            mediaType: 'FM',
            adType: adTypeRate.adType,
            segments: adTypeRate.RadioSegment.length,
            minRate: rates.length > 0 ? Math.min(...rates) : 0,
            maxRate: rates.length > 0 ? Math.max(...rates) : 0,
            totalRates: rates.length,
            isActive: rateCard.isActive || false,
            updatedAt: rateCard.updatedAt,
          });
        });
      } else if (rateCard.mediaType === 'TV' && rateCard.metadata.mediaType === 'TV') {
        const metadata = rateCard.metadata as TVMetadata;
        
        metadata.adTypeRates.forEach((adTypeRate, index) => {
          const rates: number[] = [];
          
          // Collect all unit rates from segments
          adTypeRate.TVSegment.forEach(segment => {
            if (segment.UnitRate) {
              rates.push(segment.UnitRate);
            }
          });

          adTypeCards.push({
            id: `${rateCard.id}-${adTypeRate.adType}-${index}`,
            rateCardId: rateCard.id,
            mediaPartnerName: rateCard.mediaPartnerName,
            mediaType: 'TV',
            adType: adTypeRate.adType,
            segments: adTypeRate.TVSegment.length,
            minRate: rates.length > 0 ? Math.min(...rates) : 0,
            maxRate: rates.length > 0 ? Math.max(...rates) : 0,
            totalRates: rates.length,
            isActive: rateCard.isActive || false,
            updatedAt: rateCard.updatedAt,
          });
        });
      }
    });

    return adTypeCards;
  };

  const adTypeCards = getAdTypeCards();

  // Filter by media type
  const filteredCards = selectedMediaType === 'ALL'
    ? adTypeCards
    : adTypeCards.filter(card => card.mediaType === selectedMediaType);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this rate card?')) {
      toast.info('Delete functionality disabled in demo mode');
    }
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'FM':
        return <Radio className="w-5 h-5" />;
      case 'TV':
        return <Tv className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  const formatAdType = (adType: string): string => {
    return adType
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary tracking-tight">Rate Cards</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your media rates grouped by ad types</p>
        </div>
        <Button 
          className="bg-primary text-white hover:bg-transparent hover:border hover:border-primary hover:text-primary" 
          onClick={() => navigate('/media-partner/rate-cards/create')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Rate Card
        </Button>
      </div>

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
          FM Radio
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

      {/* Cards Grid */}
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <Card key={card.id} className="hover:shadow-lg transition-shadow duration-200 border border-gray-200">
              <CardHeader className="pb-3 bg-linear-to-r from-purple-50 to-blue-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      {getMediaIcon(card.mediaType)}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {formatAdType(card.adType)}
                      </CardTitle>
                      <p className="text-xs text-gray-500 mt-1">
                        {card.mediaType} - {card.mediaPartnerName}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={card.isActive ? 'default' : 'secondary'} 
                    className={`shrink-0 px-2 py-1 text-xs ${
                      card.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {card.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-4 space-y-4">
                {/* Statistics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700 mb-1">
                      <Layers className="w-4 h-4" />
                      <span className="text-xs font-medium">Segments</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{card.segments}</p>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 mb-1">
                      <Layers className="w-4 h-4" />
                      <span className="text-xs font-medium">Time Slots</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900">{card.totalRates}</p>
                  </div>
                </div>

                {/* Rate Range */}
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-purple-700 mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs font-medium">Rate Range</span>
                  </div>
                  {card.totalRates > 0 ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-purple-900">
                        GH₵ {card.minRate.toLocaleString()}
                      </span>
                      <span className="text-gray-500">-</span>
                      <span className="text-lg font-bold text-purple-900">
                        GH₵ {card.maxRate.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No rates configured</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{card.totalRates} rate{card.totalRates !== 1 ? 's' : ''} configured</p>
                </div>

                {/* Timestamps */}
                <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
                  <Calendar className="w-3 h-3" />
                  <span>Updated {new Date(card.updatedAt).toLocaleDateString()}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate(`/media-partner/rate-cards/${card.rateCardId}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate(`/media-partner/rate-cards/${card.rateCardId}/edit`)}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete()}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-primary/50 text-center">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <motion.div
              className="flex items-center justify-center mb-1"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="p-4 bg-linear-to-br from-primary/50 to-secondary/50 rounded-full mb-4">
                <Layers className="w-8 h-8 text-primary/90" />
              </div>
            </motion.div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No rate cards found</h3>
            <p className="text-sm text-gray-500 mb-4">Create your first rate card to get started</p>
            <Button 
              className="bg-primary text-white hover:bg-transparent hover:border hover:border-primary hover:text-primary"
              onClick={() => navigate('/media-partner/rate-cards/create')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Rate Card
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
