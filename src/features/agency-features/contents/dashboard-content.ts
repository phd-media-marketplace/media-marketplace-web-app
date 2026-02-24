import type { SummaryCardsProps } from '../../../components/universal/SummaryCards';
import {
    Megaphone,
    ShoppingCart,
    Coins,
    FileText,
    TrendingUp,
    TrendingDown 
} from 'lucide-react';

export const agencySummaryCardsData: SummaryCardsProps[] = [
    {
      title: 'Total Campaigns',
      value: 24,
      change: '12%',
      icon: Megaphone,
      trendIcon: TrendingUp,
      bgColor: 'from-purple-500 to-purple-700'
    },
    {
      title: 'Active Campaigns',
      value: 12,
      change: '8%',
      icon: ShoppingCart,
      trendIcon: TrendingUp,
      bgColor: 'from-green-500 to-emerald-700'
    },
    {
      title: 'Total Spend',
      value: '₵45,231',
      change: '3%',
      icon: Coins,
      trendIcon: TrendingDown,
      bgColor: 'from-blue-500 to-blue-700'
    },
    {
      title: 'Outstanding Invoices',
      value: '₵5,000',
      change: '2%',
      icon: FileText,
      trendIcon: TrendingUp,
      bgColor: 'from-orange-500 to-orange-700'
    }
  ];