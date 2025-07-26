import getBusinessDetailsGoogle from "./googlePlaces.js";
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
      } else {
        console.error('Invalid command. Use "google"');
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

    if (!response.businessName || !response.location) {
      console.log("Operation cancelled");
      return;
    }

    console.log(
      `\nSearching for "${response.businessName}" in "${response.location}" using Google Places...\n`
    );

    const result = await getBusinessDetailsGoogle(
      response.businessName,
      response.location
    );

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

export { getBusinessDetailsGoogle };
