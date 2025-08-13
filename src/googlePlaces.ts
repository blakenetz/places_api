import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const maxResults = 20;

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
          "places.displayName,places.formattedAddress,places.internationalPhoneNumber",
      },
      body: JSON.stringify({
        textQuery: searchQuery,
        maxResultCount: maxResults, // Return up to 20 places
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
      throw new Error("No businesses found");
    }
    if (data.places.length === maxResults) {
      console.log("Max results reached, returning partial results");
    }

    // Return all places found
    return data.places.map((place: any) => ({
      businessName: place.displayName?.text || businessName,
      address: place.formattedAddress || "",
      phoneNumber: place.internationalPhoneNumber || "",
    }));
  } catch (error) {
    console.error("Error fetching Google business details:", error);
    return null;
  }
}

export default getBusinessDetailsGoogle;
