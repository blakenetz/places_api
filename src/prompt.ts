import prompts from "prompts";
import getBusinessDetailsGoogle from "./googlePlaces";
import { BusinessResult } from "@/types";
import { log, error } from "@/utils";

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
      log("Operation cancelled");
      return null;
    }

    return response.businessName;
  } catch (err) {
    error("Error:", err);
    throw err;
  }
}

// Main function for prompt mode
export async function main() {
  try {
    const businessName = await getBusinessNamePrompt();

    if (!businessName) {
      return;
    }

    log(
      `Searching for "${businessName}" in Denver, Colorado using Google Places...\n`
    );

    const result: BusinessResult[] | null = await getBusinessDetailsGoogle(
      businessName
    );

    if (result && result.length > 0) {
      log("✅ Business found!");
      log(JSON.stringify(result, null, 2));
    } else {
      log("❌ No results found");
    }
  } catch (err) {
    error("Error:", err);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
