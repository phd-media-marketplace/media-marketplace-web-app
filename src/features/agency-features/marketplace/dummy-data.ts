import type { MediaPackage } from "./types";

export const dummyMediaPackages: MediaPackage[] = [
    {
        id: "mp-001",
        mediaPartnerId: "tenant-mp-001",
        mediaPartnerName: "Ghana Television Network",
        packageName: "Prime Time TV Bundle",
        description: "Complete prime time advertising package for weekdays. Includes special placement during evening news segment.",
        mediaType: "TV",
        items: [
            {
                rateCardId: "rc-tv-spot-001",
                adType: "SPOT_ADVERTS",
                segmentId: "seg-premium-001",
                segmentClass: "PREMIUM",
                quantity: 14,
                unitRate: 15000,
                totalPrice: 210000,
            }
        ],
        reach: 2500000,
        demographics: ["Adults 25-54"],
        location: "Nationwide",
        packageDurationValue: 2,
        packageDurationUnit: "WEEKS",
        totalPrice: 210000,
        discount: 10,
        finalPrice: 189000,
        isActive: true,
        validFrom: "2024-01-01T00:00:00Z",
        validTo: "2024-12-31T23:59:59Z",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-03-10T14:30:00Z",
        metadata: {
            rating: 4.5,
            popularityScore: 92,
            segment: "News & Current Affairs",
            timeOfDay: "18:00-22:00",
            daysOfAllocation: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
        }
    },
    {
        id: "mp-002",
        mediaPartnerId: "tenant-mp-002",
        mediaPartnerName: "Joy FM",
        packageName: "Morning Drive Radio Package",
        description: "Peak commute hours with high listener engagement",
        mediaType: "FM",
        items: [
            {
                rateCardId: "rc-fm-announcements-001",
                adType: "ANNOUNCEMENTS",
                segmentId: "seg-a1-001",
                segmentClass: "A1",
                quantity: 20,
                unitRate: 5000,
                totalPrice: 100000,
            }
        ],
        reach: 1200000,
        demographics: ["Adults 18-45"],
        location: "Greater Accra",
        packageDurationValue: 1,
        packageDurationUnit: "MONTHS",
        totalPrice: 100000,
        discount: 15,
        finalPrice: 85000,
        isActive: true,
        validFrom: "2024-02-01T00:00:00Z",
        validTo: "2024-12-31T23:59:59Z",
        createdAt: "2024-02-05T09:00:00Z",
        updatedAt: "2024-03-12T16:00:00Z",
        metadata: {
            rating: 4.8,
            popularityScore: 95,
            segment: "Morning Show",
            timeOfDay: "06:00-10:00",
            daysOfAllocation: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            spotDurationSeconds: 60
        }
    },
    {
        id: "mp-003",
        mediaPartnerId: "tenant-mp-003",
        mediaPartnerName: "MyJoyOnline",
        packageName: "Digital Banner Campaign",
        description: "Homepage banner and article sidebar placements",
        mediaType: "DIGITAL",
        items: [
            {
                rateCardId: "rc-digital-banner-001",
                adType: "BANNER_ADS",
                segmentId: "seg-digital-001",
                quantity: 30,
                unitRate: 500,
                totalPrice: 15000,
            }
        ],
        reach: 800000,
        demographics: ["All ages 18-65"],
        location: "Nationwide",
        packageDurationValue: 30,
        packageDurationUnit: "DAYS",
        totalPrice: 15000,
        discount: 0,
        finalPrice: 15000,
        isActive: true,
        validFrom: "2024-03-01T00:00:00Z",
        validTo: "2024-12-31T23:59:59Z",
        createdAt: "2024-02-20T11:00:00Z",
        updatedAt: "2024-03-14T10:00:00Z",
        metadata: {
            impressions: 1500000,
            clickThroughRate: 2.5,
            format: "Banner 728x90"
        }
    },
    {
        id: "mp-004",
        mediaPartnerId: "tenant-mp-001",
        mediaPartnerName: "Metro TV",
        packageName: "Weekend Sports Package",
        description: "Perfect for sports betting and sports apparel brands",
        mediaType: "TV",
        items: [
            {
                rateCardId: "rc-tv-spot-002",
                adType: "SPOT_ADVERTS",
                segmentId: "seg-m1-001",
                segmentClass: "M1",
                quantity: 16,
                unitRate: 8000,
                totalPrice: 128000,
            }
        ],
        reach: 1800000,
        demographics: ["Males 18-45"],
        location: "Nationwide",
        packageDurationValue: 4,
        packageDurationUnit: "WEEKS",
        totalPrice: 128000,
        discount: 20,
        finalPrice: 102400,
        isActive: true,
        validFrom: "2024-01-15T00:00:00Z",
        validTo: "2024-12-31T23:59:59Z",
        createdAt: "2024-01-20T08:00:00Z",
        updatedAt: "2024-03-11T15:00:00Z",
        metadata: {
            rating: 4.3,
            popularityScore: 88,
            segment: "Sports & Entertainment",
            timeOfDay: "12:00-18:00",
            daysOfAllocation: ["Saturday", "Sunday"],
            spotDurationSeconds: 30
        }
    },
    {
        id: "mp-005",
        mediaPartnerId: "tenant-mp-002",
        mediaPartnerName: "Peace FM",
        packageName: "Afternoon Talk Show",
        description: "High engagement during political discussions",
        mediaType: "FM",
        items: [
            {
                rateCardId: "rc-fm-interviews-001",
                adType: "INTERVIEWS",
                segmentId: "seg-p-001",
                segmentClass: "P",
                quantity: 10,
                unitRate: 8000,
                totalPrice: 80000,
            }
        ],
        reach: 950000,
        demographics: ["Adults 30-60"],
        location: "Greater Accra",
        packageDurationValue: 2,
        packageDurationUnit: "WEEKS",
        totalPrice: 80000,
        discount: 10,
        finalPrice: 72000,
        isActive: true,
        validFrom: "2024-02-10T00:00:00Z",
        validTo: "2024-12-31T23:59:59Z",
        createdAt: "2024-02-15T09:30:00Z",
        updatedAt: "2024-03-13T14:00:00Z",
        metadata: {
            rating: 4.6,
            popularityScore: 90,
            segment: "Talk Show",
            timeOfDay: "14:00-17:00",
            daysOfAllocation: ["Monday", "Wednesday", "Friday"],
            spotDurationSeconds: 45
        }
    },
    {
        id: "mp-006",
        mediaPartnerId: "tenant-mp-004",
        mediaPartnerName: "Urban Billboards Ghana",
        packageName: "Premium Billboard",
        description: "High-traffic location with 24/7 visibility. Digital LED screen available",
        mediaType: "OOH",
        items: [
            {
                rateCardId: "rc-ooh-billboard-001",
                adType: "BILLBOARD",
                segmentId: "seg-premium-ooh-001",
                segmentClass: "PREMIUM",
                quantity: 1,
                unitRate: 25000,
                totalPrice: 25000,
            }
        ],
        reach: 500000,
        demographics: ["All ages"],
        location: "Accra - Circle",
        packageDurationValue: 3,
        packageDurationUnit: "MONTHS",
        totalPrice: 25000,
        discount: 0,
        finalPrice: 25000,
        isActive: true,
        validFrom: "2024-03-01T00:00:00Z",
        validTo: "2024-12-31T23:59:59Z",
        createdAt: "2024-02-25T10:00:00Z",
        updatedAt: "2024-03-15T09:00:00Z",
        metadata: {
            size: "48 sheet",
            illuminated: true,
            digital: true,
            vehicularTraffic: 45000
        }
    }
];

// Helper function to get packages by media type
export function getPackagesByMediaType(mediaType: string) {
    return dummyMediaPackages.filter(pkg => pkg.mediaType === mediaType);
}

// Helper function to get active packages
export function getActivePackages() {
    return dummyMediaPackages.filter(pkg => pkg.isActive);
}

// Helper function to get packages by location
export function getPackagesByLocation(location: string) {
    return dummyMediaPackages.filter(pkg => 
        pkg.location?.toLowerCase().includes(location.toLowerCase())
    );
}

// Helper function to get packages within budget
export function getPackagesWithinBudget(maxBudget: number) {
    return dummyMediaPackages.filter(pkg => {
        const finalCost = pkg.finalPrice;
        return finalCost <= maxBudget;
    });
}
