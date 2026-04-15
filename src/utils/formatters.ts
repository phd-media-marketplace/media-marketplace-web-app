// Helper function to format numbers
export const formatNumber = (number: number): string => {
    if (number >= 1000000) {
        return `${(number / 1000000).toFixed(1)}M`;
    } else if (number >= 1000) {
        return `${(number / 1000).toFixed(1)}K`;
    }
    return number.toString();
};

// Helper function to format currency to GHS (Ghana Cedis)
export const formatCurrency = (amount: number, includeCurrency: boolean = true): string => {
    const formatted = amount.toLocaleString('en-GH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    return includeCurrency ? `₵ ${formatted}` : formatted;
};

// Helper function to format date to a more readable format
export const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GH', options);
};

export const formatLabel = (label: string): string => {
    // Convert camelCase or snake_case to Title Case
    const withSpaces = label.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ');
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
};

// Helper function to format ad types (e.g., "PRIME_TIME" to "Prime Time")
export const formatAdType = (adType: string): string => {
    return adType
        .split('_')
        .map(word => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ');
};

export const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case 'FM': return '📻';
      case 'TV': return '📺';
      case 'OOH': return '🏙️';
      case 'DIGITAL': return '💻';
      default: return '📦';
    }
  };


