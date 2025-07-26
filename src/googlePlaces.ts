import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!GOOGLE_API_KEY) {
  throw new Error("GOOGLE_PLACES_API_KEY environment variable is required");
}

async function getBusinessDetailsGoogle(
  businessName: string,
  location: string
) {
  try {
    // 1. Get Place ID from a Text Search
    const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json`;
    const response = await fetch(textSearchUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `${businessName} ${location}`,
        key: GOOGLE_API_KEY,
      }),
    });

    const data = await response.json();

    const place = data.results[0];
    if (!place) throw new Error("Business not found");

    const placeId = place.place_id;

    // 2. Get Place Details
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json`;
    const detailsResp = await fetch(detailsUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        place_id: placeId,
        key: GOOGLE_API_KEY,
        fields: "name,formatted_address,formatted_phone_number,website",
      }),
    });

    const details = await detailsResp.json();

    return {
      name: details.name,
      address: details.formatted_address,
      phone: details.formatted_phone_number,
      website: details.website,
    };
  } catch (error) {
    console.error("Error fetching Google business details:", error);
    return null;
  }
}

export default getBusinessDetailsGoogle;
