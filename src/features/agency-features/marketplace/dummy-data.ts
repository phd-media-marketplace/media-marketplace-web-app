import type { MediaPackage } from "./types";

export const dummyMediaPackages: MediaPackage[] = [
    {
        id: "mp-001",
        tenantId: "tenant-mp-001",
        title: "Prime Time TV Bundle",
        mediaType: "TV",
        channel: "Ghana Television (GTV)",
        cost: 15000,
        discount: 10,
        reach: 2500000,
        location: "Nationwide",
        demographics: "Adults 25-54",
        spotDurationSeconds: 30,
        packageDurationValue: 2,
        packageDurationUnit: "WEEKS",
        segment: "News & Current Affairs",
        numberOfSpots: 14,
        timeOfDay: "18:00-22:00",
        daysOfAllocation: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        notes: "Includes special placement during evening news segment",
        isActive: true,
        metadata: {
            rating: 4.5,
            popularityScore: 92
        }
    },
    {
        id: "mp-002",
        tenantId: "tenant-mp-002",
        title: "Morning Drive Radio Package",
        mediaType: "RADIO",
        channel: "Joy FM 99.7",
        cost: 8500,
        discount: 15,
        reach: 1200000,
        location: "Greater Accra",
        demographics: "Adults 18-45",
        spotDurationSeconds: 60,
        packageDurationValue: 1,
        packageDurationUnit: "MONTHS",
        segment: "Morning Show",
        numberOfSpots: 20,
        timeOfDay: "06:00-10:00",
        daysOfAllocation: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        notes: "Peak commute hours with high listener engagement",
        isActive: true,
        metadata: {
            rating: 4.8,
            popularityScore: 95
        }
    },
    {
        id: "mp-003",
        tenantId: "tenant-mp-003",
        title: "Digital Banner Campaign",
        mediaType: "DIGITAL",
        channel: "MyJoyOnline.com",
        cost: 5000,
        discount: null,
        reach: 800000,
        location: "Nationwide",
        demographics: "All ages 18-65",
        packageDurationValue: 30,
        packageDurationUnit: "DAYS",
        notes: "Homepage banner and article sidebar placements",
        isActive: true,
        metadata: {
            impressions: 1500000,
            clickThroughRate: 2.5,
            format: "Banner 728x90"
        }
    },
    {
        id: "mp-004",
        tenantId: "tenant-mp-001",
        title: "Weekend Sports Package",
        mediaType: "TV",
        channel: "Metro TV",
        cost: 12000,
        discount: 20,
        reach: 1800000,
        location: "Nationwide",
        demographics: "Males 18-45",
        spotDurationSeconds: 30,
        packageDurationValue: 4,
        packageDurationUnit: "WEEKS",
        segment: "Sports & Entertainment",
        numberOfSpots: 16,
        timeOfDay: "12:00-18:00",
        daysOfAllocation: ["Saturday", "Sunday"],
        notes: "Perfect for sports betting and sports apparel brands",
        isActive: true,
        metadata: {
            rating: 4.3,
            popularityScore: 88
        }
    },
    {
        id: "mp-005",
        tenantId: "tenant-mp-002",
        title: "Afternoon Talk Show",
        mediaType: "RADIO",
        channel: "Peace FM 104.3",
        cost: 6000,
        discount: 10,
        reach: 950000,
        location: "Greater Accra",
        demographics: "Adults 30-60",
        spotDurationSeconds: 45,
        packageDurationValue: 2,
        packageDurationUnit: "WEEKS",
        segment: "Talk Show",
        numberOfSpots: 10,
        timeOfDay: "14:00-17:00",
        daysOfAllocation: ["Monday", "Wednesday", "Friday"],
        notes: "High engagement during political discussions",
        isActive: true,
        metadata: {
            rating: 4.6,
            popularityScore: 90
        }
    },
    {
        id: "mp-006",
        tenantId: "tenant-mp-004",
        title: "Premium Billboard",
        mediaType: "OOH",
        channel: "Urban Billboards Ghana",
        cost: 25000,
        discount: null,
        reach: 500000,
        location: "Accra - Circle",
        demographics: "All ages",
        packageDurationValue: 3,
        packageDurationUnit: "MONTHS",
        notes: "High-traffic location with 24/7 visibility. Digital LED screen available",
        isActive: true,
        metadata: {
            size: "48 sheet",
            illuminated: true,
            digital: true,
            vehicularTraffic: 45000
        }
    },
    {
        id: "mp-007",
        tenantId: "tenant-mp-005",
        title: "Social Media Influencer Campaign",
        mediaType: "DIGITAL",
        channel: "Instagram & TikTok",
        cost: 10000,
        discount: 5,
        reach: 2000000,
        location: "Nationwide",
        demographics: "Youth 16-35",
        packageDurationValue: 2,
        packageDurationUnit: "WEEKS",
        notes: "Includes 10 posts across 5 major influencers with combined 2M followers",
        isActive: true,
        metadata: {
            influencers: 5,
            posts: 10,
            stories: 20,
            expectedEngagement: 150000
        }
    },
    {
        id: "mp-008",
        tenantId: "tenant-mp-001",
        title: "Late Night Entertainment",
        mediaType: "TV",
        channel: "TV3 Network",
        cost: 9000,
        discount: 25,
        reach: 1200000,
        location: "Nationwide",
        demographics: "Adults 18-35",
        spotDurationSeconds: 30,
        packageDurationValue: 3,
        packageDurationUnit: "WEEKS",
        segment: "Entertainment & Movies",
        numberOfSpots: 18,
        timeOfDay: "22:00-01:00",
        daysOfAllocation: ["Friday", "Saturday"],
        notes: "Great for targeting young professionals and students",
        isActive: true,
        metadata: {
            rating: 4.1,
            popularityScore: 82
        }
    },
    {
        id: "mp-009",
        tenantId: "tenant-mp-002",
        title: "Gospel Music Marathon",
        mediaType: "RADIO",
        channel: "House FM 91.9",
        cost: 4500,
        discount: null,
        reach: 600000,
        location: "Greater Accra",
        demographics: "Adults 25-55",
        spotDurationSeconds: 30,
        packageDurationValue: 1,
        packageDurationUnit: "MONTHS",
        segment: "Religious Programming",
        numberOfSpots: 24,
        timeOfDay: "00:00-23:59",
        daysOfAllocation: ["Sunday"],
        notes: "Excellent for faith-based products and services",
        isActive: true,
        metadata: {
            rating: 4.4,
            popularityScore: 85
        }
    },
    {
        id: "mp-010",
        tenantId: "tenant-mp-004",
        title: "Mall Advertising Package",
        mediaType: "OOH",
        channel: "Mall Media Ghana",
        cost: 18000,
        discount: 15,
        reach: 300000,
        location: "Accra - Tetteh Quarshie",
        demographics: "Middle to High Income, 20-50",
        packageDurationValue: 2,
        packageDurationUnit: "MONTHS",
        notes: "Indoor digital screens + static posters in high-traffic areas",
        isActive: true,
        metadata: {
            screens: 12,
            posters: 20,
            footfall: 150000,
            displayType: "mixed"
        }
    },
    {
        id: "mp-011",
        tenantId: "tenant-mp-003",
        title: "YouTube Pre-Roll Campaign",
        mediaType: "DIGITAL",
        channel: "YouTube Ghana",
        cost: 7500,
        discount: 10,
        reach: 1500000,
        location: "Nationwide",
        demographics: "All ages 13-45",
        packageDurationValue: 3,
        packageDurationUnit: "WEEKS",
        notes: "Skippable and non-skippable ads targeting Ghana-based viewers",
        isActive: true,
        metadata: {
            adFormat: "Pre-roll video",
            targetedViews: 500000,
            videoDuration: "15-30 seconds",
            skipRate: 35
        }
    },
    {
        id: "mp-012",
        tenantId: "tenant-mp-001",
        title: "Multi-Platform Package",
        mediaType: "TV_RADIO",
        channel: "TV3 & 3FM",
        cost: 22000,
        discount: 20,
        reach: 3000000,
        location: "Nationwide",
        demographics: "Adults 18-54",
        spotDurationSeconds: 30,
        packageDurationValue: 1,
        packageDurationUnit: "MONTHS",
        segment: "News & Entertainment",
        numberOfSpots: 40,
        timeOfDay: "06:00-09:00, 18:00-22:00",
        daysOfAllocation: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        notes: "Combined TV and Radio reach for maximum impact",
        isActive: true,
        metadata: {
            rating: 4.7,
            popularityScore: 94,
            channels: ["TV3", "3FM 92.7"]
        }
    },
    {
        id: "mp-013",
        tenantId: "tenant-mp-002",
        title: "Evening Commute",
        mediaType: "RADIO",
        channel: "Asempa FM 94.7",
        cost: 7000,
        discount: 12,
        reach: 850000,
        location: "Greater Accra",
        demographics: "Adults 25-50",
        spotDurationSeconds: 60,
        packageDurationValue: 3,
        packageDurationUnit: "WEEKS",
        segment: "News & Talk",
        numberOfSpots: 15,
        timeOfDay: "16:00-19:00",
        daysOfAllocation: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        notes: "High listenership during evening commute hours",
        isActive: true,
        metadata: {
            rating: 4.5,
            popularityScore: 89
        }
    },
    {
        id: "mp-014",
        tenantId: "tenant-mp-004",
        title: "Airport Road Billboard Network",
        mediaType: "OOH",
        channel: "Premium Outdoor Media",
        cost: 35000,
        discount: 10,
        reach: 750000,
        location: "Accra - Airport Road",
        demographics: "Business Professionals, High Income",
        packageDurationValue: 6,
        packageDurationUnit: "MONTHS",
        notes: "5 premium billboards along Airport Road corridor",
        isActive: true,
        metadata: {
            billboards: 5,
            size: "48 sheet each",
            illuminated: true,
            vehicularTraffic: 60000
        }
    },
    {
        id: "mp-015",
        tenantId: "tenant-mp-005",
        title: "Facebook & Instagram Ads Campaign",
        mediaType: "DIGITAL",
        channel: "Meta Platforms",
        cost: 6000,
        discount: null,
        reach: 1800000,
        location: "Nationwide",
        demographics: "All ages 18-55",
        packageDurationValue: 1,
        packageDurationUnit: "MONTHS",
        notes: "Targeted ads with custom audience segmentation and retargeting",
        isActive: true,
        metadata: {
            platforms: ["Facebook", "Instagram"],
            adFormats: ["Carousel", "Single Image", "Video"],
            budget: 6000,
            expectedClicks: 45000
        }
    },
    {
        id: "mp-016",
        tenantId: "tenant-mp-001",
        title: "Breakfast Show Package - Joy News",
        mediaType: "TV",
        channel: "Joy News",
        cost: 13000,
        discount: 15,
        reach: 1600000,
        location: "Nationwide",
        demographics: "Adults 30-60",
        spotDurationSeconds: 45,
        packageDurationValue: 4,
        packageDurationUnit: "WEEKS",
        segment: "News & Current Affairs",
        numberOfSpots: 20,
        timeOfDay: "06:00-09:00",
        daysOfAllocation: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        notes: "Premium placement during morning news program",
        isActive: true,
        metadata: {
            rating: 4.6,
            popularityScore: 91
        }
    },
    {
        id: "mp-017",
        tenantId: "tenant-mp-002",
        title: "Weekend Vibes",
        mediaType: "RADIO",
        channel: "Hitz FM 103.9",
        cost: 5500,
        discount: 8,
        reach: 700000,
        location: "Greater Accra",
        demographics: "Youth 15-30",
        spotDurationSeconds: 30,
        packageDurationValue: 2,
        packageDurationUnit: "WEEKS",
        segment: "Music & Entertainment",
        numberOfSpots: 12,
        timeOfDay: "10:00-18:00",
        daysOfAllocation: ["Saturday", "Sunday"],
        notes: "Perfect for youth-oriented brands and entertainment events",
        isActive: true,
        metadata: {
            rating: 4.7,
            popularityScore: 93
        }
    },
    {
        id: "mp-018",
        tenantId: "tenant-mp-004",
        title: "Bus Branding",
        mediaType: "OOH",
        channel: "Transit Ads Ghana",
        cost: 28000,
        discount: 12,
        reach: 1000000,
        location: "Accra & Kumasi",
        demographics: "All ages",
        packageDurationValue: 4,
        packageDurationUnit: "MONTHS",
        notes: "Full bus wrap on 10 buses operating on major routes",
        isActive: true,
        metadata: {
            buses: 10,
            routes: ["Accra-Kumasi", "Accra-Tema", "Circle-Madina"],
            wrapType: "Full wrap",
            dailyPassengers: 5000
        }
    },
    {
        id: "mp-019",
        tenantId: "tenant-mp-003",
        title: "Google Display Network Campaign",
        mediaType: "DIGITAL",
        channel: "Google Ads",
        cost: 8000,
        discount: 5,
        reach: 2200000,
        location: "Nationwide",
        demographics: "All ages 18-65",
        packageDurationValue: 1,
        packageDurationUnit: "MONTHS",
        notes: "Display ads across Google partner sites with audience targeting",
        isActive: true,
        metadata: {
            network: "Google Display Network",
            adSizes: ["300x250", "728x90", "160x600"],
            expectedImpressions: 3000000,
            targeting: ["Interest-based", "Contextual", "Remarketing"]
        }
    },
    {
        id: "mp-020",
        tenantId: "tenant-mp-001",
        title: "Sports & Reality Show Package",
        mediaType: "TV",
        channel: "GHOne TV",
        cost: 11000,
        discount: 18,
        reach: 1400000,
        location: "Nationwide",
        demographics: "Adults 18-40",
        spotDurationSeconds: 30,
        packageDurationValue: 3,
        packageDurationUnit: "WEEKS",
        segment: "Sports & Reality",
        numberOfSpots: 21,
        timeOfDay: "19:00-23:00",
        daysOfAllocation: ["Wednesday", "Thursday", "Friday", "Saturday"],
        notes: "Feature during popular reality shows and sports analysis programs",
        isActive: true,
        metadata: {
            rating: 4.4,
            popularityScore: 87,
            programs: ["Sports Tonight", "Date Rush"]
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
        const finalCost = pkg.discount 
            ? pkg.cost - (pkg.cost * pkg.discount / 100) 
            : pkg.cost;
        return finalCost <= maxBudget;
    });
}
