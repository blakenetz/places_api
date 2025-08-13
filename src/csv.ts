import getBusinessDetailsGoogle from "./googlePlaces";
import { BusinessResult } from "@/types";
import { log, error, batch, processing, success, waiting } from "@/utils";
import fs from "fs";
import path from "path";

// CSV processing constants
const BATCH_SIZE = 5;
const DELAY_BETWEEN_BATCHES = 1000;

// CSV processing functionality
export async function processCSVFile(csvFilePath: string) {
  try {
    log(`Processing CSV file: ${csvFilePath}\n`);

    const csvContent = fs.readFileSync(csvFilePath, "utf-8");
    const lines = csvContent.split("\n").filter((line) => line.trim());

    if (lines.length === 0) {
      throw new Error("CSV file is empty");
    }

    // Parse headers and validate required columns
    const headerLine = lines[0];
    if (!headerLine) {
      throw new Error("CSV file has no header line");
    }

    const headers = headerLine.split(",").map((h) => h.toLowerCase().trim());
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

    // Validate that all required columns were found
    if (companyIndex === -1 || emailIndex === -1 || phoneIndex === -1) {
      throw new Error("Required columns not found in CSV headers");
    }

    // Skip header row and process data
    const dataLines = lines.slice(1);

    log(`Found ${dataLines.length} business names to process\n`);

    const results: BusinessResult[] = [];

    // Process in batches
    for (let i = 0; i < dataLines.length; i += BATCH_SIZE) {
      const batchData = dataLines.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(dataLines.length / BATCH_SIZE);

      batch(
        `Processing batch ${batchNumber}/${totalBatches} (${batchData.length} businesses)`
      );

      // Process batch concurrently
      const batchPromises = batchData.map(async (line, batchIndex) => {
        const columns = line.split(",").map((col) => col.trim());
        const businessName = columns[companyIndex] || "";

        if (!businessName) return null;

        const globalIndex = i + batchIndex;
        processing(
          `Processing ${globalIndex + 1}/${dataLines.length}: "${businessName}"`
        );

        try {
          const result = await getBusinessDetailsGoogle(businessName);
          if (result) {
            success(`Found ${result.length} result(s)`);
            return result;
          } else {
            log(`No results found`);
            return null;
          }
        } catch (err) {
          error(`Error processing "${businessName}":`, err);
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
      if (i + BATCH_SIZE < dataLines.length) {
        waiting(`Waiting ${DELAY_BETWEEN_BATCHES}ms before next batch...`);
        await new Promise((resolve) =>
          setTimeout(resolve, DELAY_BETWEEN_BATCHES)
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
    success(`Results saved to: ${outputPath}`);
    log(`Total results: ${results.length}`);
  } catch (err) {
    error("Error processing CSV file:", err);
    throw err;
  }
}

// Main function for CSV mode
export async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2 || args[0] !== "--file") {
    error("Usage: csv --file <filename>");
    error("Example: csv --file ~/path/to/file.csv");
    process.exit(1);
  }

  const csvPath = args[1];
  if (!csvPath || !fs.existsSync(csvPath)) {
    error(`CSV file not found: ${csvPath}`);
    process.exit(1);
  }

  try {
    await processCSVFile(csvPath);
  } catch (err) {
    error("Error:", err);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
