# Denver Places

A Node.js application to gather business information for companies in Denver, Colorado using the Google Places API.

## Features

- 🔍 **Interactive Search**: Search for individual businesses via CLI prompts
- 📊 **Batch CSV Processing**: Process multiple businesses from CSV files
- 🚀 **Concurrent API Calls**: Efficient batch processing with rate limiting
- 📍 **Denver Focused**: Optimized for Denver, Colorado business searches

## Prerequisites

- Node.js 18+
- pnpm package manager
- Google Places API key

## Setup

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and add your Google Places API key:

   ```env
   GOOGLE_PLACES_API_KEY=your_actual_google_places_api_key
   ```

3. **Get a Google Places API key:**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the Places API
   - Create credentials (API key)

## Usage

### Interactive Mode (CLI Prompts)

Search for a single business interactively:

```bash
pnpm prompt
```

The app will prompt you to enter a business name and search Google Places API.

### Batch CSV Processing

Process multiple businesses from a CSV file:

```bash
pnpm run csv --file path/to/your/file.csv
```

**CSV Format Required:**

```csv
Company,Email,Phone
ABC Company,abc@example.com,555-1234
XYZ Corp,xyz@example.com,555-5678
123 Business,123@example.com,555-9012
```

**Output:**

- Results are saved to `google_places_results.csv` in the same directory
- Output columns: `Business Name, Address, Phone Number`

## Project Structure

```
src/
├── index.ts          # Shared library exports
├── prompt.ts         # Interactive CLI mode
├── csv.ts           # Batch CSV processing
└── googlePlaces.ts  # Google Places API integration
```

## API Response Format

Each business search returns:

```typescript
{
  businessName: string; // Business name from Google or input
  address: string; // Formatted address
  phoneNumber: string; // International phone number
}
```

## Rate Limiting

- **Batch Size**: 5 concurrent API calls
- **Delay**: 1 second between batches
- **Optimized**: Prevents hitting Google Places API rate limits

## Development

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm prompt
pnpm run csv --file test.csv

# Build TypeScript
pnpm run build

# Run tests (if added)
pnpm test
```

## Environment Variables

| Variable                | Description           | Required |
| ----------------------- | --------------------- | -------- |
| `GOOGLE_PLACES_API_KEY` | Google Places API key | ✅ Yes   |

## License

ISC License
