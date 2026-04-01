import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Eye, Radio, Tv, Calendar, Layers, DollarSign } from "lucide-react";
// import { listRateCards, deleteRateCard } from "../api";
import type { RateCard, FMMetadata, TVMetadata } from "../types";
import { dummyRateCards } from "../dummy-data";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function RateCardsList() {
  const [selectedMediaType, setSelectedMediaType] = useState<'FM' | 'TV' | 'ALL'>('ALL');
  // const queryClient = useQueryClient();
  const navigate = useNavigate();

  // ===== DEMO MODE: Using dummy data instead of API =====
  // Fetch rate cards
  // const { data: rateCards, isLoading, error } = useQuery({
  //   queryKey: ['rateCards', selectedMediaType],
  //   queryFn: () => listRateCards(selectedMediaType !== 'ALL' ? { mediaType: selectedMediaType } : undefined),
  // });

  // Filter dummy rate cards based on selected media type
  const rateCards = selectedMediaType === 'ALL' 
    ? dummyRateCards 
    : dummyRateCards.filter(card => card.mediaType === selectedMediaType);
  const isLoading = false;
  const error = null;

  // Delete mutation
  // const deleteMutation = useMutation({
  //   mutationFn: deleteRateCard,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['rateCards'] });
  //     toast.success('Rate card deleted successfully');
  //   },
  //   onError: (error) => {
  //     toast.error('Failed to delete rate card');
  //     console.error('Delete error:', error);
  //   },
  // });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDelete = (_id: string) => {
    if (window.confirm('Are you sure you want to delete this rate card?')) {
      // deleteMutation.mutate(id);
      toast.info('Delete functionality disabled in demo mode');
    }
  };

  // Helper functions to extract metadata
  const getRateCardStats = (rateCard: RateCard) => {
    if (rateCard.mediaType === 'FM' && rateCard.metadata.mediaType === 'FM') {
      const metadata = rateCard.metadata as FMMetadata;
      const segments = metadata.segments || [];
      const totalContentTypes = segments.reduce((acc, seg) => acc + (seg.enabledTypes?.length || 0), 0);
      
      // Collect all rates
      const rates: number[] = [];
      segments.forEach(seg => {
        seg.announcements?.forEach(a => rates.push(a.rate));
        seg.interviews?.forEach(i => rates.push(i.rate));
        seg.livePresenterMentions?.forEach(l => rates.push(l.rate));
        seg.jingles?.forEach(j => rates.push(j.rate));
        seg.newsCoverage?.forEach(n => rates.push(n.rate));
      });

      return {
        segments: segments.length,
        contentTypes: totalContentTypes,
        minRate: rates.length > 0 ? Math.min(...rates) : 0,
        maxRate: rates.length > 0 ? Math.max(...rates) : 0,
        totalItems: rates.length,
      };
    } else if (rateCard.mediaType === 'TV' && rateCard.metadata.mediaType === 'TV') {
      const metadata = rateCard.metadata as TVMetadata;
      const segments = metadata.segments || [];
      const totalContentTypes = segments.reduce((acc, seg) => acc + (seg.enabledTypes?.length || 0), 0);
      
      // Collect all rates
      const rates: number[] = [];
      segments.forEach(seg => {
        seg.spotAdverts?.forEach(s => rates.push(s.rate));
        seg.documentary?.forEach(d => rates.push(d.rate));
        seg.announcements?.forEach(a => rates.push(a.rate));
        seg.newsCoverage?.forEach(n => rates.push(n.rate));
        seg.executiveInterview?.forEach(e => rates.push(e.rate));
        seg.preaching?.forEach(p => rates.push(p.rate));
        seg.airtimeSale?.forEach(a => rates.push(a.rate));
        seg.media?.forEach(m => rates.push(m.rate));
      });

      return {
        segments: segments.length,
        contentTypes: totalContentTypes,
        minRate: rates.length > 0 ? Math.min(...rates) : 0,
        maxRate: rates.length > 0 ? Math.max(...rates) : 0,
        totalItems: rates.length,
      };
    } else if (rateCard.mediaType === 'OOH' && rateCard.metadata.mediaType === 'OOH') {
      return {
        segments: 1,
        contentTypes: 1,
        minRate: rateCard.metadata.baseRate || 0,
        maxRate: rateCard.metadata.baseRate || 0,
        totalItems: 1,
      };
    }
    
    return { segments: 0, contentTypes: 0, minRate: 0, maxRate: 0, totalItems: 0 };
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading rate cards...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">Error loading rate cards</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary tracking-tight">Rate Cards</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your media rates and packages</p>
        </div>
        <Button className="bg-primary text-white hover:bg-transparent hover:border hover:border-primary hover:text-primary" onClick={() => navigate('/media-partner/rate-cards/create')}>
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
      {rateCards && rateCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rateCards.map((rateCard: RateCard) => {
            const stats = getRateCardStats(rateCard);
            
            return (
              <Card key={rateCard.id} className="hover:shadow-lg transition-shadow duration-200 border border-gray-200">
                <CardHeader className="pb-3 bg-linear-to-r from-purple-50 to-blue-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        {getMediaIcon(rateCard.mediaType)}
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {rateCard.mediaType} Rate Card
                        </CardTitle>
                        <p className="text-xs text-gray-500 mt-1">
                          {rateCard.mediaPartnerName}
                        </p>
                      </div>
                    </div>
                    <Badge variant={rateCard.isActive ? 'default' : 'secondary'} className={`shrink-0 px-2 py-1 text-xs ${rateCard.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {rateCard.isActive ? 'Active' : 'Inactive'}
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
                      <p className="text-2xl font-bold text-blue-900">{stats.segments}</p>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700 mb-1">
                        <Layers className="w-4 h-4" />
                        <span className="text-xs font-medium">Content Types</span>
                      </div>
                      <p className="text-2xl font-bold text-green-900">{stats.contentTypes}</p>
                    </div>
                  </div>

                  {/* Rate Range */}
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-700 mb-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xs font-medium">Rate Range</span>
                    </div>
                    {stats.totalItems > 0 ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-purple-900">
                          GHS {stats.minRate.toLocaleString()}
                        </span>
                        <span className="text-gray-500">-</span>
                        <span className="text-lg font-bold text-purple-900">
                          GHS {stats.maxRate.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No rates configured</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{stats.totalItems} items configured</p>
                  </div>

                  {/* Timestamps */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
                    <Calendar className="w-3 h-3" />
                    <span>Updated {new Date(rateCard.updatedAt).toLocaleDateString()}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate(`/media-partner/rate-cards/${rateCard.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate(`/media-partner/rate-cards/${rateCard.id}/edit`)}
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(rateCard.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
