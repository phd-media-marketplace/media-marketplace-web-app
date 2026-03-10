import type { RateCard, FMMetadata, TVMetadata, OOHMetadata, DIGITALMetadata } from './types';

/**
 * Dummy Rate Cards Data
 * Sample data for all media types: FM, TV, OOH, and DIGITAL
 */

export const dummyRateCards: RateCard[] = [
  // FM Radio Rate Cards
  {
    id: 'rc-fm-001',
    mediaPartnerId: 'mp-001',
    mediaPartnerName: 'Metro FM 97.5',
    mediaType: 'FM',
    isActive: true,
    metadata: {
      mediaType: 'FM',
      segments: [
        {
          segmentName: 'Prime Time Package',
          segmentType: 'ANNOUNCEMENTS',
          enabledTypes: ['ANNOUNCEMENTS'],
          announcements: [
            {
              announcementType: 'COMMERCIAL/PRODUCTS',
              timeInterval: { startTime: '06:00', endTime: '09:00' },
              rate: 5000,
              day: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
            },
            {
              announcementType: 'PROMOTIONS',
              timeInterval: { startTime: '17:00', endTime: '19:00' },
              rate: 6000,
              day: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
            },
          ],
        },
        {
          segmentName: 'Prime Time Package',
          segmentType: 'JINGLES',
          enabledTypes: ['JINGLES'],
          jingles: [
            {
              timeInterval: { startTime: '06:00', endTime: '09:00' },
              duration: '30_SECS',
              rate: 4500,
              day: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
            },
            {
              timeInterval: { startTime: '12:00', endTime: '14:00' },
              duration: '60_SECS',
              rate: 7000,
              day: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'],
            },
          ],
        },
        {
          segmentName: 'Prime Time Package',
          segmentType: 'LIVE_PRESENTER_MENTIONS',
          enabledTypes: ['LIVE_PRESENTER_MENTIONS'],
          livePresenterMentions: [
            {
              mentionType: 'LIVE_PRESENTER_MENTION',
              timeInterval: { startTime: '06:00', endTime: '10:00' },
              rate: 8000,
              day: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
            },
            {
              mentionType: 'SPONSORSHIP_MENTION',
              timeInterval: { startTime: '17:00', endTime: '20:00' },
              rate: 12000,
              day: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
            },
          ],
        },
        {
          segmentName: 'Weekend Special',
          segmentType: 'ANNOUNCEMENTS',
          enabledTypes: ['ANNOUNCEMENTS'],
          announcements: [
            {
              announcementType: 'SOCIAL',
              timeInterval: { startTime: '08:00', endTime: '12:00' },
              rate: 3500,
              day: ['SATURDAY', 'SUNDAY'],
            },
          ],
        },
        {
          segmentName: 'Weekend Special',
          segmentType: 'INTERVIEWS',
          enabledTypes: ['INTERVIEWS'],
          interviews: [
            {
              timeInterval: { startTime: '10:00', endTime: '12:00' },
              durationSeconds: '30_MINS',
              rate: 15000,
              day: ['SATURDAY', 'SUNDAY'],
            },
          ],
        },
        {
          segmentName: 'Weekend Special',
          segmentType: 'NEWS_COVERAGE',
          enabledTypes: ['NEWS_COVERAGE'],
          newsCoverage: [
            {
              location: 'Greater Accra',
              rate: 10000,
              day: ['SATURDAY', 'SUNDAY'],
            },
          ],
        },
      ],
    } as FMMetadata,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-02-20T14:45:00Z',
  },
  {
    id: 'rc-fm-002',
    mediaPartnerId: 'mp-002',
    mediaPartnerName: 'City Radio 103.5',
    mediaType: 'FM',
    isActive: true,
    metadata: {
      mediaType: 'FM',
      segments: [
        {
          segmentName: 'Morning Drive',
          segmentType: 'ANNOUNCEMENTS',
          enabledTypes: ['ANNOUNCEMENTS'],
          announcements: [
            {
              announcementType: 'COMMERCIAL/PRODUCTS',
              timeInterval: { startTime: '05:00', endTime: '08:00' },
              rate: 7500,
              day: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
            },
            {
              announcementType: 'FUNERAL',
              timeInterval: { startTime: '05:00', endTime: '22:00' },
              rate: 2500,
              day: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
            },
          ],
        },
        {
          segmentName: 'Morning Drive',
          segmentType: 'JINGLES',
          enabledTypes: ['JINGLES'],
          jingles: [
            {
              timeInterval: { startTime: '05:00', endTime: '08:00' },
              duration: '45_SECS',
              rate: 5500,
              day: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
            },
          ],
        },
        {
          segmentName: 'Morning Drive',
          segmentType: 'LIVE_PRESENTER_MENTIONS',
          enabledTypes: ['LIVE_PRESENTER_MENTIONS'],
          livePresenterMentions: [
            {
              mentionType: 'SPONSORSHIP_MENTION',
              timeInterval: { startTime: '05:00', endTime: '08:00' },
              rate: 15000,
              day: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
            },
          ],
        },
        {
          segmentName: 'Morning Drive',
          segmentType: 'NEWS_COVERAGE',
          enabledTypes: ['NEWS_COVERAGE'],
          newsCoverage: [
            {
              location: 'Kumasi',
              rate: 12000,
              day: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
            },
          ],
        },
        {
          segmentName: 'Night Shows',
          segmentType: 'INTERVIEWS',
          enabledTypes: ['INTERVIEWS'],
          interviews: [
            {
              timeInterval: { startTime: '20:00', endTime: '23:00' },
              durationSeconds: '45_MINS',
              rate: 18000,
              day: ['FRIDAY', 'SATURDAY'],
            },
          ],
        },
        {
          segmentName: 'Night Shows',
          segmentType: 'JINGLES',
          enabledTypes: ['JINGLES'],
          jingles: [
            {
              timeInterval: { startTime: '20:00', endTime: '02:00' },
              duration: '30_SECS',
              rate: 3000,
              day: ['FRIDAY', 'SATURDAY', 'SUNDAY'],
            },
          ],
        },
      ],
    } as FMMetadata,
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-28T16:20:00Z',
  },

  // TV Rate Cards
  {
    id: 'rc-tv-001',
    mediaPartnerId: 'mp-003',
    mediaPartnerName: 'Prime Television Network',
    mediaType: 'TV',
    isActive: true,
    metadata: {
      mediaType: 'TV',
      segments: [
        {
          segmentName: 'Prime Time Advertising',
          segmentType: 'SPOT_ADVERTS',
          enabledTypes: ['SPOT_ADVERTS'],
          spotAdverts: [
            {
              intervalType: 'PREMIUM',
              spotAdvertType: 'DURATION_BASED',
              programmeType: 'News and Current Affairs',
              timeInterval: { startTime: '19:00', endTime: '21:00' },
              rate: 25000,
              day: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
              durationBasedAdvert: {
                duration: '30_SECS',
                rate: 25000,
              },
            },
            {
              intervalType: 'PREMIUM',
              spotAdvertType: 'DURATION_BASED',
              programmeType: 'Prime Time Drama',
              timeInterval: { startTime: '20:00', endTime: '21:30' },
              rate: 35000,
              day: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
              durationBasedAdvert: {
                duration: '60_SECS',
                rate: 35000,
              },
            },
            {
              intervalType: 'PREMIUM',
              spotAdvertType: 'PRODUCT_PLACEMENT',
              programmeType: 'Reality Show',
              timeInterval: { startTime: '18:00', endTime: '19:00' },
              rate: 50000,
              day: ['SATURDAY', 'SUNDAY'],
              productPlacement: {
                duration: '30_MINS',
                rate: 50000,
              },
            },
            {
              intervalType: 'TIME_INTERVAL',
              spotAdvertType: 'CRAWLERS',
              timeInterval: { startTime: '09:00', endTime: '17:00' },
              rate: 8000,
              day: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
              otherSportAdvertTypeRate: 8000,
            },
            {
              intervalType: 'PREMIUM',
              spotAdvertType: 'LOGO_DISPLAY',
              programmeType: 'Sports Coverage',
              timeInterval: { startTime: '15:00', endTime: '18:00' },
              rate: 15000,
              day: ['SATURDAY', 'SUNDAY'],
              otherSportAdvertTypeRate: 15000,
            },
          ],
        },
        {
          segmentName: 'Prime Time Advertising',
          segmentType: 'ANNOUNCEMENTS',
          enabledTypes: ['ANNOUNCEMENTS'],
          announcements: [
            {
              announcementType: 'COMMERCIAL/PRODUCTS',
              rate: 12000,
              day: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
            },
            {
              announcementType: 'SOCIAL',
              rate: 5000,
              day: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
            },
          ],
        },
        {
          segmentName: 'Special Programs',
          segmentType: 'DOCUMENTARY',
          enabledTypes: ['DOCUMENTARY'],
          documentary: [
            {
              documentaryType: 'COMMERCIAL',
              durationMinutes: '30_MINS',
              timeInterval: { startTime: '14:00', endTime: '15:00' },
              rate: 80000,
              day: ['SATURDAY', 'SUNDAY'],
            },
            {
              documentaryType: 'SOCIAL',
              durationMinutes: '45_MINS',
              timeInterval: { startTime: '16:00', endTime: '17:00' },
              rate: 60000,
              day: ['SUNDAY'],
            },
          ],
        },
        {
          segmentName: 'Special Programs',
          segmentType: 'EXECUTIVE_INTERVIEW',
          enabledTypes: ['EXECUTIVE_INTERVIEW'],
          executiveInterview: [
            {
              durationMinutes: '30_MINS',
              rate: 50000,
              day: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
            },
          ],
        },
        {
          segmentName: 'Special Programs',
          segmentType: 'NEWS_COVERAGE',
          enabledTypes: ['NEWS_COVERAGE'],
          newsCoverage: [
            {
              location: 'Accra',
              adType: 'COMMERCIAL',
              rate: 30000,
              day: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
            },
            {
              location: 'Nationwide',
              adType: 'SOCIAL',
              rate: 15000,
              day: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
            },
          ],
        },
      ],
    } as TVMetadata,
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-03-05T10:30:00Z',
  },
  {
    id: 'rc-tv-002',
    mediaPartnerId: 'mp-004',
    mediaPartnerName: 'Metro TV',
    mediaType: 'TV',
    isActive: true,
    metadata: {
      mediaType: 'TV',
      segments: [
        {
          segmentName: 'General Programming',
          segmentType: 'SPOT_ADVERTS',
          enabledTypes: ['SPOT_ADVERTS'],
          spotAdverts: [
            {
              intervalType: 'TIME_INTERVAL',
              spotAdvertType: 'DURATION_BASED',
              timeInterval: { startTime: '06:00', endTime: '18:00' },
              rate: 15000,
              day: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
              durationBasedAdvert: {
                duration: '30_SECS',
                rate: 15000,
              },
            },
            {
              intervalType: 'PREMIUM',
              spotAdvertType: 'SQUEEZE_BACK',
              programmeType: 'Morning Show',
              timeInterval: { startTime: '06:00', endTime: '09:00' },
              rate: 10000,
              day: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
              otherSportAdvertTypeRate: 10000,
            },
            {
              intervalType: 'TIME_INTERVAL',
              spotAdvertType: 'POP_UPS',
              timeInterval: { startTime: '12:00', endTime: '18:00' },
              rate: 7000,
              day: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
              otherSportAdvertTypeRate: 7000,
            },
          ],
        },
        {
          segmentName: 'General Programming',
          segmentType: 'PREACHING',
          enabledTypes: ['PREACHING'],
          preaching: [
            {
              durationMinutes: '60_MINS',
              timeInterval: { startTime: '05:00', endTime: '07:00' },
              rate: 25000,
              day: ['SUNDAY'],
            },
          ],
        },
        {
          segmentName: 'General Programming',
          segmentType: 'AIRTIME_SALE',
          enabledTypes: ['AIRTIME_SALE'],
          airtimeSale: [
            {
              durationMinutes: '30_MINS',
              timeInterval: { startTime: '22:00', endTime: '02:00' },
              rate: 40000,
              day: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
            },
          ],
        },
        {
          segmentName: 'General Programming',
          segmentType: 'MEDIA',
          enabledTypes: ['MEDIA'],
          media: [
            {
              mediaType: 'MUSIC_VIDEOS',
              durationSeconds: 180,
              rate: 5000,
              day: ['SATURDAY', 'SUNDAY'],
            },
            {
              mediaType: 'MOVIE_PROMO',
              durationSeconds: 120,
              rate: 8000,
              day: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
            },
          ],
        },
      ],
    } as TVMetadata,
    createdAt: '2024-02-10T08:30:00Z',
    updatedAt: '2024-02-25T15:00:00Z',
  },

  // OOH (Out-of-Home) Rate Cards
  {
    id: 'rc-ooh-001',
    mediaPartnerId: 'mp-005',
    mediaPartnerName: 'Urban Billboards Ltd',
    mediaType: 'OOH',
    isActive: true,
    metadata: {
      mediaType: 'OOH',
      name: 'Premium Highway Billboard',
      placement: 'Accra-Tema Motorway, Near Spintex Junction',
      format: 'Billboard',
      dimensions: '48ft x 14ft',
      duration: 30,
      unit: 'days',
      baseRate: 85000,
      currency: 'GHS',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      minimumSpend: 85000,
      notes: 'High-traffic location with excellent visibility. Illuminated 24/7. Digital printing included.',
    } as OOHMetadata,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-02-15T11:30:00Z',
  },
  {
    id: 'rc-ooh-002',
    mediaPartnerId: 'mp-005',
    mediaPartnerName: 'Urban Billboards Ltd',
    mediaType: 'OOH',
    isActive: true,
    metadata: {
      mediaType: 'OOH',
      name: 'City Center Digital Billboard',
      placement: 'Osu Oxford Street, Opposite Republic Bar',
      format: 'Digital Billboard',
      dimensions: '20ft x 10ft',
      duration: 30,
      unit: 'days',
      baseRate: 120000,
      currency: 'GHS',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      minimumSpend: 120000,
      notes: 'Premium digital display in high-end shopping district. 10-second rotation slots. Content can be changed remotely.',
    } as OOHMetadata,
    createdAt: '2024-01-12T10:15:00Z',
    updatedAt: '2024-02-18T14:00:00Z',
  },
  {
    id: 'rc-ooh-003',
    mediaPartnerId: 'mp-006',
    mediaPartnerName: 'Metro Outdoor Advertising',
    mediaType: 'OOH',
    isActive: true,
    metadata: {
      mediaType: 'OOH',
      name: 'Bus Shelter Advertisement',
      placement: 'Various locations across Accra CBD',
      format: 'Bus Shelter Poster',
      dimensions: '6ft x 4ft',
      duration: 14,
      unit: 'days',
      baseRate: 15000,
      currency: 'GHS',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      minimumSpend: 15000,
      notes: 'Package includes 10 bus shelters in CBD area. Backlit panels for night visibility.',
    } as OOHMetadata,
    createdAt: '2024-01-18T13:20:00Z',
    updatedAt: '2024-02-22T09:45:00Z',
  },
  {
    id: 'rc-ooh-004',
    mediaPartnerId: 'mp-006',
    mediaPartnerName: 'Metro Outdoor Advertising',
    mediaType: 'OOH',
    isActive: true,
    metadata: {
      mediaType: 'OOH',
      name: 'Mall Kiosk Display',
      placement: 'Accra Mall - Ground Floor, Main Entrance',
      format: 'Kiosk Display',
      dimensions: '8ft x 4ft',
      duration: 7,
      unit: 'days',
      baseRate: 25000,
      currency: 'GHS',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      minimumSpend: 25000,
      notes: 'High foot traffic area. Perfect for product launches and promotions. Setup and teardown included.',
    } as OOHMetadata,
    createdAt: '2024-01-25T08:00:00Z',
    updatedAt: '2024-02-20T10:30:00Z',
  },

  // DIGITAL Rate Cards
  {
    id: 'rc-digital-001',
    mediaPartnerId: 'mp-007',
    mediaPartnerName: 'Digital Media Hub',
    mediaType: 'DIGITAL',
    isActive: true,
    metadata: {
      mediaType: 'DIGITAL',
    } as DIGITALMetadata,
    createdAt: '2024-02-01T12:00:00Z',
    updatedAt: '2024-02-28T16:45:00Z',
  },
  {
    id: 'rc-digital-002',
    mediaPartnerId: 'mp-008',
    mediaPartnerName: 'Social Connect Agency',
    mediaType: 'DIGITAL',
    isActive: false,
    metadata: {
      mediaType: 'DIGITAL',
    } as DIGITALMetadata,
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-03-01T11:20:00Z',
  },
];

/**
 * Get rate cards by media type
 */
export const getRateCardsByMediaType = (mediaType: 'FM' | 'TV' | 'OOH' | 'DIGITAL') => {
  return dummyRateCards.filter(card => card.mediaType === mediaType);
};

/**
 * Get active rate cards only
 */
export const getActiveRateCards = () => {
  return dummyRateCards.filter(card => card.isActive);
};

/**
 * Get rate cards by media partner ID
 */
export const getRateCardsByPartnerId = (mediaPartnerId: string) => {
  return dummyRateCards.filter(card => card.mediaPartnerId === mediaPartnerId);
};

/**
 * Get a single rate card by ID
 */
export const getRateCardById = (id: string) => {
  return dummyRateCards.find(card => card.id === id);
};
