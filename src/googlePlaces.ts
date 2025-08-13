import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!GOOGLE_API_KEY) {
  throw new Error("GOOGLE_PLACES_API_KEY environment variable is required");
}

async function getBusinessDetailsGoogle(businessName: string) {
  try {
    // Use the new Google Places API v1 endpoint
    const searchUrl = new URL(
      "https://places.googleapis.com/v1/places:searchText"
    );
    searchUrl.searchParams.append("key", GOOGLE_API_KEY!);

    const searchQuery = `${businessName} Denver, Colorado`;

    const response = await fetch(searchUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY!,
        "X-Goog-FieldMask":
          "places.displayName,places.formattedAddress,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.types,places.businessStatus,places.openingHours",
      },
      body: JSON.stringify({
        textQuery: searchQuery,
        maxResultCount: 1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`
      );
    }

    const data = await response.json();

    if (!data.places || data.places.length === 0) {
      throw new Error("Business not found");
    }

    const place = data.places[0];

    return {
      name: place.displayName?.text || "N/A",
      address: place.formattedAddress || "N/A",
      phone: place.internationalPhoneNumber || "N/A",
      website: place.websiteUri || "N/A",
      rating: place.rating || null,
      totalRatings: place.userRatingCount || null,
      businessStatus: place.businessStatus || null,
      types: place.types || [],
      openingHours: place.openingHours?.weekdayDescriptions || null,
    };
  } catch (error) {
    console.error("Error fetching Google business details:", error);
    return null;
  }
}

export default getBusinessDetailsGoogle;
