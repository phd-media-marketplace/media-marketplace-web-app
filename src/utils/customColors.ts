export const getCardColors = (mediaType: string) => {
    const colors = {
      TV: {
        gradient: 'from-purple-600 to-purple-800',
        badge: 'bg-purple-400/20  border-purple-400/30',
        icon: 'bg-purple-400/30',
        button: 'bg-purple-500 hover:bg-purple-600 border-purple-400'
      },
      DIGITAL: {
        gradient: 'from-blue-600 to-cyan-700',
        badge: 'bg-cyan-400/20  border-cyan-400/30',
        icon: 'bg-cyan-400/30',
        button: 'bg-cyan-500 hover:bg-cyan-600 border-cyan-400'
      },
      RADIO: {
        gradient: 'from-orange-600 to-red-700',
        badge: 'bg-orange-400/20  border-orange-400/30',
        icon: 'bg-orange-400/30',
        button: 'bg-orange-500 hover:bg-orange-600 border-orange-400'
      },
      OOH: {
        gradient: 'from-green-600 to-emerald-800',
        badge: 'bg-green-400/20  border-green-400/30',
        icon: 'bg-green-400/30',
        button: 'bg-green-500 hover:bg-green-600 border-green-400'
      },
      PRINT: {
        gradient: 'from-pink-600 to-rose-800',
        badge: 'bg-pink-400/20  border-pink-400/30',
        icon: 'bg-pink-400/30',
        button: 'bg-pink-500 hover:bg-pink-600 border-pink-400'
      }
    };
    return colors[mediaType as keyof typeof colors] || colors.TV;
  };

  // Helper function to get day color
export const getDayColor = (day: string) => {
    const colors: Record<string, string> = {
        'Monday': 'bg-blue-100 text-black hover:bg-blue-100',
        'Tuesday': 'bg-purple-100 text-black hover:bg-purple-100',
        'Wednesday': 'bg-green-100 text-black hover:bg-green-100',
        'Thursday': 'bg-yellow-100 text-black hover:bg-yellow-100',
        'Friday': 'bg-pink-100 text-black hover:bg-pink-100',
        'Saturday': 'bg-orange-100 text-black hover:bg-orange-100',
        'Sunday': 'bg-red-100 text-black hover:bg-red-100',
    };
    return colors[day] || 'bg-gray-100 text-gray-700';
};

export const getStatusColors = (status: string) => {
    const colors: Record<string, { bg: string; text: string; hover: string }> = {
        'Active': { bg: 'bg-green-100', text: 'text-green-800', hover: 'hover:bg-green-100' },
        'Inactive': { bg: 'bg-red-100', text: 'text-red-800', hover: 'hover:bg-red-100' },
        'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', hover: 'hover:bg-yellow-100' },
        'Completed': { bg: 'bg-blue-100', text: 'text-blue-800', hover: 'hover:bg-blue-100' },
    };
    return colors[status] || { bg: 'bg-gray-100', text: 'text-gray-700', hover: 'hover:bg-gray-100' };
};

export const getAdTypeColors = (adType: string) => {
    const colors: Record<string, { bg: string; text: string; hover: string }> = {
    'ANNOUNCEMENTS': { bg: 'bg-violet-100', text: 'text-violet-800', hover: 'hover:bg-violet-100' },
    'INTERVIEWS': { bg: 'bg-indigo-100', text: 'text-indigo-800', hover: 'hover:bg-indigo-100' },
    'LIVE_PRESENTER_MENTIONS': { bg: 'bg-cyan-100', text: 'text-cyan-800', hover: 'hover:bg-cyan-100' },
    'JINGLES': { bg: 'bg-fuchsia-100', text: 'text-fuchsia-800', hover: 'hover:bg-fuchsia-100' },
    'NEWS_COVERAGE': { bg: 'bg-blue-100', text: 'text-blue-800', hover: 'hover:bg-blue-100' },
    'SPOT_ADVERTS': { bg: 'bg-emerald-100', text: 'text-emerald-800', hover: 'hover:bg-emerald-100' },
    'DOCUMENTARY': { bg: 'bg-slate-100', text: 'text-slate-800', hover: 'hover:bg-slate-100' },
    'EXECUTIVE_INTERVIEW': { bg: 'bg-teal-100', text: 'text-teal-800', hover: 'hover:bg-teal-100' },
    'PREACHING': { bg: 'bg-amber-100', text: 'text-amber-800', hover: 'hover:bg-amber-100' },
    'AIRTIME_SALE': { bg: 'bg-lime-100', text: 'text-lime-800', hover: 'hover:bg-lime-100' },
    'MEDIA': { bg: 'bg-rose-100', text: 'text-rose-800', hover: 'hover:bg-rose-100' }
    };
    return colors[adType] || { bg: 'bg-gray-100', text: 'text-gray-700', hover: 'hover:bg-gray-100' };
};
