import getBusinessDetailsGoogle from "./googlePlaces.js";
import getBusinessDetailsYelp from "./yelpFusion.js";
import prompts from "prompts";

// CLI functionality
async function main() {
  const args = process.argv.slice(2);

  // If arguments are provided, use them (for backward compatibility)
  if (args.length >= 3) {
    const command = args[0];
    const businessName = args[1];
    const location = args[2];

    try {
      let result;

      if (command === "google") {
        result = await getBusinessDetailsGoogle(businessName, location);
      } else if (command === "yelp") {
        result = await getBusinessDetailsYelp(businessName, location);
      } else {
        console.error('Invalid command. Use "google" or "yelp"');
        process.exit(1);
      }

      if (result) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log("No results found");
      }
    } catch (error) {
      console.error("Error:", error);
      process.exit(1);
    }
    return;
  }

  // Interactive mode using prompts
  try {
    const response = await prompts([
      {
        type: "select",
        name: "service",
        message: "Which service would you like to use?",
        choices: [
          { title: "Google Places API", value: "google" },
          { title: "Yelp Fusion API", value: "yelp" },
        ],
      },
      {
        type: "text",
        name: "businessName",
        message: "Enter the business name:",
        validate: (value) =>
          value.length > 0 ? true : "Business name is required",
      },
      {
        type: "text",
        name: "location",
        message: "Enter the location (city, state, etc.):",
        validate: (value) => (value.length > 0 ? true : "Location is required"),
      },
    ]);

    if (!response.service || !response.businessName || !response.location) {
      console.log("Operation cancelled");
      return;
    }

    console.log(
      `\nSearching for "${response.businessName}" in "${
        response.location
      }" using ${
        response.service === "google" ? "Google Places" : "Yelp Fusion"
      }...\n`
    );

    let result;
    if (response.service === "google") {
      result = await getBusinessDetailsGoogle(
        response.businessName,
        response.location
      );
    } else {
      result = await getBusinessDetailsYelp(
        response.businessName,
        response.location
      );
    }

    if (result) {
      console.log("✅ Business found!");
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log("❌ No results found");
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// Run CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { getBusinessDetailsGoogle, getBusinessDetailsYelp };
