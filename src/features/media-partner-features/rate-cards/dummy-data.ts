import type { RateCard } from '../../../../docs/types';
import type { RadioMetadata, TVMetadata } from './types';

/**
 * Dummy Rate Cards Data  
 * Sample data using new RadioMetadata and TVMetadata structures
 * Each rate card represents a different ad type for Heaven Media House
 */

export const dummyRateCards: RateCard[] = [
  // FM Radio - Announcements
  {
    id: 'rc-fm-announcements-001',
    mediaPartnerId: 'mp-heaven-001',
    mediaPartnerName: 'Heaven Media House',
    mediaType: 'FM',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-10T14:30:00Z',
    metadata: {
      mediaType: 'FM',
      adTypeRates: [
        {
          adType: 'ANNOUNCEMENTS',
          RadioSegment: [
            {
              Class: 'A1',
              ClassName: 'Prime Time',
              timeDetails: [
                {
                  daysOfWeek: 'MONDAY - FRIDAY',
                  timeInterval: ['06:00 - 10:00', '17:00 - 20:00'],
                },
              ],
              UnitRate: 5000,
              isActive: true,
            },
            {
              Class: 'A',
              ClassName: 'Standard',
              timeDetails: [
                {
                  daysOfWeek: 'MONDAY - FRIDAY',
                  timeInterval: ['10:00 - 17:00'],
                },
              ],
              UnitRate: 3000,
              isActive: true,
            },
          ],
        },
      ],
    } as RadioMetadata,
  },

  // FM Radio - Jingles
  {
    id: 'rc-fm-jingles-002',
    mediaPartnerId: 'mp-heaven-001',
    mediaPartnerName: 'Heaven Media House',
    mediaType: 'FM',
    isActive: true,
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-03-12T11:00:00Z',
    metadata: {
      mediaType: 'FM',
      adTypeRates: [
        {
          adType: 'JINGLES',
          RadioSegment: [
            {
              Class: 'A1',
              ClassName: 'Peak Jingle',
              timeDetails: [
                {
                  daysOfWeek: 'MONDAY - FRIDAY',
                  timeInterval: ['06:00 - 12:00', '16:00 - 21:00'],
                },
                {
                  daysOfWeek: 'SATURDAY - SUNDAY',
                  timeInterval: ['06:00 - 12:00', '16:00 - 21:00'],
                },
              ],
              UnitRate: 4500,
              isActive: true,
            },
            {
              Class: 'B',
              ClassName: 'Off-Peak Jingle',
              timeDetails: [
                {
                  daysOfWeek: 'MONDAY - FRIDAY',
                  timeInterval: ['21:00 - 06:00'],
                },
                {
                  daysOfWeek: 'SATURDAY - SUNDAY',
                  timeInterval: ['21:00 - 06:00'],
                },
              ],
              UnitRate: 2500,
              isActive: true,
            },
          ],
        },
      ],
    } as RadioMetadata,
  },

  // FM Radio - Interviews
  {
    id: 'rc-fm-interviews-003',
    mediaPartnerId: 'mp-heaven-001',
    mediaPartnerName: 'Heaven Media House',
    mediaType: 'FM',
    isActive: true,
    createdAt: '2024-02-01T08:30:00Z',
    updatedAt: '2024-03-15T10:20:00Z',
    metadata: {
      mediaType: 'FM',
      adTypeRates: [
        {
          adType: 'INTERVIEWS',
          RadioSegment: [
            {
              Class: 'P',
              ClassName: 'Morning Interview',
              timeDetails: [
                {
                  daysOfWeek: 'MONDAY - FRIDAY',
                  timeInterval: ['07:00 - 09:00'],
                },
              ],
              UnitRate: 8000,
              isActive: true,
            },
            {
              Class: 'P1',
              ClassName: 'Evening Interview',
              timeDetails: [
                {
                  daysOfWeek: 'MONDAY - FRIDAY',
                  timeInterval: ['18:00 - 20:00'],
                },
              ],
              UnitRate: 7000,
              isActive: true,
            },
          ],
        },
      ],
    } as RadioMetadata,
  },

  // TV - Spot Adverts
  {
    id: 'rc-tv-spot-004',
    mediaPartnerId: 'mp-heaven-001',
    mediaPartnerName: 'Heaven Media House',
    mediaType: 'TV',
    isActive: true,
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-03-14T15:00:00Z',
    metadata: {
      mediaType: 'TV',
      adTypeRates: [
        {
          adType: 'SPOT_ADVERTS',
          TVSegment: [
            {
              Class: 'PREMIUM',
              ClassName: 'Prime Time Spot',
              timeDetails: [
                {
                  daysOfWeek: 'MONDAY - FRIDAY',
                  timeInterval: ['19:00 - 22:00'],
                },
                {
                  daysOfWeek: 'SATURDAY - SUNDAY',
                  timeInterval: ['19:00 - 22:00'],
                },
              ],
              adForm: '30_SECS',
              UnitRate: 15000,
              isActive: true,
            },
            {
              Class: 'M1',
              ClassName: 'Daytime Spot',
              timeDetails: [
                {
                  daysOfWeek: 'MONDAY - FRIDAY',
                  timeInterval: ['09:00 - 17:00'],
                },
              ],
              adForm: '30_SECS',
              UnitRate: 8000,
              isActive: true,
            },
            {
              Class: 'M2',
              ClassName: 'Late Night Spot',
              timeDetails: [
                {
                  daysOfWeek: 'MONDAY - FRIDAY',
                  timeInterval: ['22:00 - 06:00'],
                },
                {
                  daysOfWeek: 'SATURDAY - SUNDAY',
                  timeInterval: ['22:00 - 06:00'],
                },
              ],
              adForm: '30_SECS',
              UnitRate: 5000,
              isActive: true,
            },
          ],
        },
      ],
    } as TVMetadata,
  },

  // TV - Documentary
  {
    id: 'rc-tv-documentary-005',
    mediaPartnerId: 'mp-heaven-001',
    mediaPartnerName: 'Heaven Media House',
    mediaType: 'TV',
    isActive: true,
    createdAt: '2024-02-05T11:00:00Z',
    updatedAt: '2024-03-16T09:30:00Z',
    metadata: {
      mediaType: 'TV',
      adTypeRates: [
        {
          adType: 'DOCUMENTARY',
          TVSegment: [
            {
              Class: 'PREMIUM',
              ClassName: 'Prime Documentary',
              timeDetails: [
                {
                  daysOfWeek: 'SATURDAY - SUNDAY',
                  timeInterval: ['20:00 - 21:30'],
                },
              ],
              adForm: '60_SECS',
              UnitRate: 25000,
              isActive: true,
            },
            {
              Class: 'M3',
              ClassName: 'Weekday Documentary',
              timeDetails: [
                {
                  daysOfWeek: 'MONDAY - FRIDAY',
                  timeInterval: ['21:00 - 22:00'],
                },
              ],
              adForm: '60_SECS',
              UnitRate: 20000,
              isActive: true,
            },
          ],
        },
      ],
    } as TVMetadata,
  },

  // TV - Announcements
  {
    id: 'rc-tv-announcements-006',
    mediaPartnerId: 'mp-heaven-001',
    mediaPartnerName: 'Heaven Media House',
    mediaType: 'TV',
    isActive: true,
    createdAt: '2024-02-10T12:00:00Z',
    updatedAt: '2024-03-18T14:00:00Z',
    metadata: {
      mediaType: 'TV',
      adTypeRates: [
        {
          adType: 'ANNOUNCEMENTS',
          TVSegment: [
            {
              Class: 'M1',
              ClassName: 'Breaking News',
              timeDetails: [
                {
                  daysOfWeek: 'MONDAY - FRIDAY',
                  timeInterval: ['07:00 - 09:00', '13:00 - 14:00', '20:00 - 21:00'],
                },
                {
                  daysOfWeek: 'SATURDAY - SUNDAY',
                  timeInterval: ['07:00 - 09:00', '13:00 - 14:00', '20:00 - 21:00'],
                },
              ],
              adForm: 'LIVE',
              UnitRate: 6000,
              isActive: true,
            },
            {
              Class: 'M2',
              ClassName: 'General',
              timeDetails: [
                {
                  daysOfWeek: 'MONDAY - FRIDAY',
                  timeInterval: ['10:00 - 16:00'],
                },
              ],
              adForm: 'SOCIAL',
              UnitRate: 3000,
              isActive: true,
            },
          ],
        },
      ],
    } as TVMetadata,
  },
];
