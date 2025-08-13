import getBusinessDetailsGoogle from "./googlePlaces";
import { getBusinessNamePrompt } from "./prompt";

// CLI functionality
async function main() {
  // Interactive mode using prompts
  try {
    const businessName = await getBusinessNamePrompt();

    if (!businessName) {
      return;
    }

    console.log(
      `\nSearching for "${businessName}" in Denver, Colorado using Google Places...\n`
    );

    const result = await getBusinessDetailsGoogle(businessName);

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
