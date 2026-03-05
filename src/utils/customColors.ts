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