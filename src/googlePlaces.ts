import dotenv from "dotenv";
import { BusinessResult, GooglePlacesResponse } from "@/types";
import { error } from "@/utils";

// Load environment variables
dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!GOOGLE_API_KEY) {
  throw new Error("GOOGLE_PLACES_API_KEY environment variable is required");
}

async function getBusinessDetailsGoogle(
  businessName: string
): Promise<BusinessResult[]> {
  try {
    const allPlaces: any[] = [];
    let nextPageToken: string | undefined;

    do {
      // Use the new Google Places API v1 endpoint
      const searchUrl = new URL(
        "https://places.googleapis.com/v1/places:searchText"
      );
      searchUrl.searchParams.append("key", GOOGLE_API_KEY!);

      const searchQuery = `${businessName} Denver, Colorado`;

      const requestBody: any = {
        textQuery: searchQuery,
        maxResultCount: 20, // Maximum allowed per request
      };

      // Add page token if we have one
      if (nextPageToken) {
        requestBody.pageToken = nextPageToken;
      }

      const response = await fetch(searchUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_API_KEY!,
          "X-Goog-FieldMask":
            "places.displayName,places.formattedAddress,places.internationalPhoneNumber",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${errorText}`
        );
      }

      const data: GooglePlacesResponse = await response.json();

      if (!data.places || data.places.length === 0) {
        break; // No more results
      }

      // Add places from this page to our collection
      allPlaces.push(...data.places);

      // Get the next page token for pagination
      nextPageToken = data.nextPageToken;

      // Small delay to avoid hitting rate limits
      if (nextPageToken) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } while (nextPageToken);

    if (allPlaces.length === 0) {
      throw new Error("No businesses found");
    }

    // Return all places found across all pages
    return allPlaces.map((place) => ({
      businessName: place.displayName?.text || businessName,
      address: place.formattedAddress || "",
      phoneNumber: place.internationalPhoneNumber || "",
    }));
  } catch (err) {
    error("Error fetching Google business details:", err);
    throw err;
  }
}

export default getBusinessDetailsGoogle;
