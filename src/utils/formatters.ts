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