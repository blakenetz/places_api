# Places API

API to gather information for businesses in Denver, Colorado using Google Places API.

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your API key:
     ```
     GOOGLE_PLACES_API_KEY=your_actual_google_places_api_key
     ```

## Usage

### Interactive Mode

```bash
pnpm run search
```

### Direct Commands

```bash
# Google Places API
pnpm run google "Business Name"
```

## API Keys

- **Google Places API**: Get your key from [Google Cloud Console](https://console.cloud.google.com/)
