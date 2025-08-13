import getBusinessDetailsGoogle from "./googlePlaces.js";
import prompts from "prompts";

// CLI functionality
async function main() {
  const args = process.argv.slice(2);

  // If arguments are provided, use them (for backward compatibility)
  if (args.length >= 2) {
    const command = args[0];
    const businessName = args[1];

    try {
      let result;

      if (command === "google") {
        result = await getBusinessDetailsGoogle(businessName);
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
    ]);

    if (!response.businessName) {
      console.log("Operation cancelled");
      return;
    }

    console.log(
      `\nSearching for "${response.businessName}" in Denver, Colorado using Google Places...\n`
    );

    const result = await getBusinessDetailsGoogle(response.businessName);

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
