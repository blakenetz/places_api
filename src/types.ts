// Business result type from Google Places API
export interface BusinessResult {
  businessName: string;
  address: string;
  phoneNumber: string;
}

// Google Places API response structure
export interface GooglePlacesResponse {
  places: Array<{
    displayName?: {
      text: string;
    };
    formattedAddress?: string;
    internationalPhoneNumber?: string;
  }>;
  nextPageToken?: string;
}
