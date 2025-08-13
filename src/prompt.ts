import prompts from "prompts";
import getBusinessDetailsGoogle from "./googlePlaces";

export async function getBusinessNamePrompt(): Promise<string | null> {
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
      return null;
    }

    return response.businessName;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Main function for prompt mode
export async function main() {
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

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
