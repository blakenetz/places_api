const YELP_API_KEY = "YOUR_YELP_API_KEY";

async function getBusinessDetailsYelp(businessName: string, location: string) {
  try {
    const searchUrl = "https://api.yelp.com/v3/businesses/search";

    const searchResp = await fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${YELP_API_KEY}`,
      },
      body: JSON.stringify({
        term: businessName,
        location: location,
        limit: 1,
      }),
    });

    const data = await searchResp.json();

    const business = data.businesses[0];
    if (!business) throw new Error("Business not found");

    return {
      name: business.name,
      address: business.location.display_address.join(", "),
      phone: business.display_phone,
      website: business.url,
    };
  } catch (error) {
    console.error("Error fetching Yelp business details:", error);
    return null;
  }
}
