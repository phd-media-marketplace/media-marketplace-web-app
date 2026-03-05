# Rate Cards Feature

## Overview
The Rate Cards feature allows media partners to create, manage, and publish their advertising rates for both FM Radio and TV media types.

## Structure

```
rate-cards/
├── api.ts                      # API service functions
├── types.ts                    # TypeScript type definitions
├── index.ts                    # Feature exports
├── components/
│   ├── FMRateCardForm.tsx     # FM-specific rate card form
│   └── TVRateCardForm.tsx     # TV-specific rate card form
└── pages/
    ├── RateCardsList.tsx      # List/table view of all rate cards
    └── CreateRateCard.tsx     # Create new rate card page
```

## Features

### 1. **Rate Card List** (`/media-partner/rate-cards`)
- View all rate cards in a table format
- Filter by media type (FM, TV, or All)
- Edit, delete, and view rate card details
- Search and pagination support
- Status indicators (Active/Inactive)

### 2. **Create Rate Card** (`/media-partner/rate-cards/create`)
- Create new rate cards for FM or TV
- Dynamic forms based on media type selection
- Support for multiple segments/programs
- Comprehensive pricing options

## Media Types

### FM Radio
Supports the following advertising types:
- **Segments**: Programme-based time slots
- **Announcements**: Branded announcements with time intervals
- **Interviews**: Sponsored interview slots
- **Live Presenter Mentions**: Live mentions during shows
- **Jingles**: Jingle placements with duration options (10s - 60s)
- **News Coverage**: Location-based news coverage rates

### TV
Supports the following advertising types:
- **Spot Adverts**: Time-based or premium spots with multiple ad rates
  - LPM (Lower Page Message)
  - Crawlers
  - Squeeze Back
  - Pop-ups
  - Logo Display
  - Pre-Promos
  - Product Endorsement
  - Open/Close Light
- **Documentary**: Commercial and social documentaries
- **Announcements**: TV announcements by type
- **News Coverage**: Location and ad-type based coverage
- **Executive Interviews**: Duration-based rates
- **Preaching**: Religious content slots
- **Airtime Sales**: Block airtime sales
- **Media**: Music videos, soundtracks, movie promos

## API Endpoints

- `POST /rate-cards` - Create a new rate card
- `GET /rate-cards` - List all rate cards
- `GET /rate-cards/:id` - Get a specific rate card
- `PUT /rate-cards/:id` - Update a rate card
- `DELETE /rate-cards/:id` - Delete a rate card
- `GET /rate-cards/media-types` - Get available media types
- `POST /rate-cards/bulk-upload` - Bulk upload multiple rate cards

## Usage

### Creating a Rate Card

1. Navigate to **Rate Cards** → **Create New** from the sidebar
2. Fill in basic information:
   - Rate Card Name
   - Media Type (FM or TV)
   - Base Rate and Currency
   - Valid period (optional)
   - Minimum spend (optional)
3. Add media-specific details based on selected type
4. Submit the form

### Managing Rate Cards

- **Edit**: Click the edit icon on any rate card in the list
- **Delete**: Click the delete icon and confirm
- **View**: Click the eye icon to view full details
- **Filter**: Use the filter buttons to show only FM or TV rate cards

## Type Safety

All components are fully typed with TypeScript, providing:
- Compile-time type checking
- IntelliSense support
- Documentation through types
- Reduced runtime errors

## State Management

- Uses **React Query** for server state management
- Automatic caching and invalidation
- Optimistic updates
- Error handling and retry logic

## Navigation

Rate Cards appear in the Media Partner sidebar under:
- **Rate Cards**
  - All Rate Cards
  - Create New

## Dependencies

- `@tanstack/react-query` - Data fetching and caching
- `react-router-dom` - Routing
- `sonner` - Toast notifications
- `lucide-react` - Icons
- `@radix-ui` - UI components (Select, Card, etc.)
