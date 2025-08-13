import prompts from "prompts";

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
