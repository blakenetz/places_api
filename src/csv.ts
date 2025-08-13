import getBusinessDetailsGoogle from "./googlePlaces";
import fs from "fs";
import path from "path";

// CSV processing functionality
export async function processCSVFile(csvFilePath: string) {
  try {
    console.log(`\nProcessing CSV file: ${csvFilePath}\n`);

    const csvContent = fs.readFileSync(csvFilePath, "utf-8");
    const lines = csvContent.split("\n").filter((line) => line.trim());

    if (lines.length === 0) {
      throw new Error("CSV file is empty");
    }

    // Parse headers and validate required columns
    const headers = lines[0].split(",").map((h) => h.toLowerCase().trim());
    const requiredHeaders = ["company", "email", "phone"];

    const missingHeaders = requiredHeaders.filter(
      (header) => !headers.includes(header)
    );
    if (missingHeaders.length > 0) {
      throw new Error(
        `Missing required headers: ${missingHeaders.join(
          ", "
        )}. Required headers are: ${requiredHeaders.join(", ")}`
      );
    }

    // Get column indices
    const companyIndex = headers.indexOf("company");
    const emailIndex = headers.indexOf("email");
    const phoneIndex = headers.indexOf("phone");

    // Skip header row and process data
    const dataLines = lines.slice(1);

    console.log(`Found ${dataLines.length} business names to process\n`);

    const results: Array<{
      businessName: string;
      address: string;
      phoneNumber: string;
    }> = [];
    const batchSize = 5; // Process 5 businesses concurrently
    const delayBetweenBatches = 1000; // 1 second delay between batches

    // Process in batches
    for (let i = 0; i < dataLines.length; i += batchSize) {
      const batch = dataLines.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(dataLines.length / batchSize);

      console.log(
        `\n📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} businesses)`
      );

      // Process batch concurrently
      const batchPromises = batch.map(async (line, batchIndex) => {
        const columns = line.split(",").map((col) => col.trim());
        const businessName = columns[companyIndex] || "";

        if (!businessName) return null;

        const globalIndex = i + batchIndex;
        console.log(
          `  Processing ${globalIndex + 1}/${
            dataLines.length
          }: "${businessName}"`
        );

        try {
          const result = await getBusinessDetailsGoogle(businessName);
          if (result) {
            console.log(`    ✅ Found ${result.length} result(s)`);
            return result;
          } else {
            console.log(`    ❌ No results found`);
            return null;
          }
        } catch (error) {
          console.error(`    ❌ Error processing "${businessName}":`, error);
          return null;
        }
      });

      // Wait for all businesses in this batch to complete
      const batchResults = await Promise.all(batchPromises);

      // Add valid results to our collection
      batchResults.forEach((result) => {
        if (result) {
          results.push(...result);
        }
      });

      // Delay between batches to avoid hitting rate limits
      if (i + batchSize < dataLines.length) {
        console.log(`⏳ Waiting ${delayBetweenBatches}ms before next batch...`);
        await new Promise((resolve) =>
          setTimeout(resolve, delayBetweenBatches)
        );
      }
    }

    // Save results to a new CSV file
    const outputPath = path.join(
      path.dirname(csvFilePath),
      "google_places_results.csv"
    );
    const csvOutput = [
      "Business Name,Address,Phone Number",
      ...results.map(
        (r) => `"${r.businessName}","${r.address}","${r.phoneNumber}"`
      ),
    ].join("\n");

    fs.writeFileSync(outputPath, csvOutput);
    console.log(`\n✅ Results saved to: ${outputPath}`);
    console.log(`Total results: ${results.length}`);
  } catch (error) {
    console.error("Error processing CSV file:", error);
    throw error;
  }
}

// Main function for CSV mode
export async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2 || args[0] !== "--file") {
    console.error("Usage: csv --file <filename>");
    console.error("Example: csv --file ~/path/to/file.csv");
    process.exit(1);
  }

  const csvPath = args[1];
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV file not found: ${csvPath}`);
    process.exit(1);
  }

  try {
    await processCSVFile(csvPath);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
