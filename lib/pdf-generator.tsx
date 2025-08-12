import {
  Document,
  Image,
  PDFDownloadLink,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";
import React from "react";
import { PropertyRow, ValuationRow } from "../types/valuations";

// Define interfaces for valuation data
interface ValuationDataRow {
  id: number;
  section: string;
  value: string;
  display_order: number;
  valuation_id: number;
}

interface ValuationWithDetails extends ValuationRow {
  property: PropertyRow;
  valuation_data: ValuationDataRow[];
}

// Helper function to strip HTML tags and extract text content
const stripHtmlTags = (html: string): string => {
  if (!html) return "";

  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, "");

  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Clean up extra whitespace
  text = text.replace(/\s+/g, " ").trim();

  return text;
};

// Helper function to extract image URLs from HTML with better parsing
const extractImageUrls = (
  html: string
): Array<{ url: string; alt?: string }> => {
  if (!html) return [];

  const imgRegex = /<img[^>]+>/g;
  const images: Array<{ url: string; alt?: string }> = [];
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    const imgTag = match[0];

    // Extract src attribute
    const srcMatch = imgTag.match(/src=["']([^"']+)["']/);
    if (srcMatch) {
      const url = srcMatch[1];

      // Extract alt attribute if present
      const altMatch = imgTag.match(/alt=["']([^"']*)["']/);
      const alt = altMatch ? altMatch[1] : undefined;

      images.push({ url, alt });
    }
  }

  return images;
};

// Helper function to check if HTML contains significant content
const hasSignificantContent = (html: string): boolean => {
  const textContent = stripHtmlTags(html);
  const images = extractImageUrls(html);

  return textContent.length > 0 || images.length > 0;
};

// Helper function to check if URL is accessible for PDF rendering
const isValidImageUrl = (url: string): boolean => {
  if (!url || typeof url !== "string") return false;

  // Check if it's a Supabase public storage URL
  if (url.includes("supabase.co") && url.includes("storage/v1/object/public")) {
    return true;
  }

  // Check if it's a full HTTP/HTTPS URL
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return true;
  }

  // Check for common image extensions
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i;
  if (url.match(imageExtensions)) {
    return true;
  }

  return false;
};

// Helper function to get a safe image URL
const getSafeImageUrl = (src: string): string => {
  if (!src) return "";

  // If it's already a full URL, use as is
  if (src.startsWith("http")) {
    return src;
  }

  // If it's a relative Supabase storage path, make it absolute
  if (src.startsWith("/storage/")) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return supabaseUrl ? `${supabaseUrl}${src}` : src;
  }

  // Handle other relative paths
  if (src.startsWith("/")) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return supabaseUrl ? `${supabaseUrl}${src}` : src;
  }

  return src;
};

// Component to render an image with error handling
const PDFImage: React.FC<{ src: string; alt?: string }> = ({ src, alt }) => {
  // Get the safe image URL
  const imageUrl = getSafeImageUrl(src);

  // Only try to render if the URL looks valid
  if (!isValidImageUrl(imageUrl)) {
    return (
      <View style={styles.imageContainer}>
        <Text style={styles.imageReference}>
          📷 Image: {src.split("/").pop() || "Embedded Image"}
        </Text>
        <Text style={styles.imageCaption}>
          Note: Image URL not accessible for PDF rendering
        </Text>
      </View>
    );
  }

  try {
    return (
      <View style={styles.imageContainer}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image src={imageUrl} style={styles.image} />
        {alt && <Text style={styles.imageCaption}>{alt}</Text>}
        <Text style={styles.imageCaption}>
          Source: {imageUrl.split("/").pop()}
        </Text>
      </View>
    );
  } catch {
    // Fallback if image can't be loaded
    return (
      <View style={styles.imageContainer}>
        <Text style={styles.imageReference}>
          📷 Image: {src.split("/").pop() || "Embedded Image"}
        </Text>
        <Text style={styles.imageCaption}>Note: Image failed to load</Text>
      </View>
    );
  }
};

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
    fontSize: 11,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 30,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#581c87",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 5,
  },
  reportInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    fontSize: 10,
    color: "#6b7280",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#581c87",
    marginBottom: 12,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    width: "35%",
    fontWeight: "bold",
    color: "#374151",
  },
  value: {
    width: "65%",
    color: "#1f2937",
  },
  coverPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  coverTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#581c87",
    marginBottom: 20,
  },
  coverSubtitle: {
    fontSize: 18,
    color: "#6b7280",
    marginBottom: 40,
  },
  coverProperty: {
    fontSize: 16,
    marginBottom: 10,
    color: "#374151",
  },
  coverClient: {
    fontSize: 14,
    marginBottom: 5,
    color: "#6b7280",
  },
  coverDate: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 30,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#9ca3af",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
  },
  valuationDataSection: {
    marginBottom: 20,
  },
  valuationDataTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#581c87",
    marginBottom: 8,
    backgroundColor: "#f3f4f6",
    padding: 8,
  },
  valuationDataContent: {
    marginLeft: 10,
    marginBottom: 10,
  },
  pageNumber: {
    position: "absolute",
    bottom: 20,
    right: 40,
    fontSize: 10,
    color: "#9ca3af",
  },
  imageReference: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 4,
    fontWeight: "bold",
  },
  imageContainer: {
    marginTop: 12,
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#f9fafb",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  image: {
    maxWidth: 450,
    maxHeight: 350,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 4,
    objectFit: "contain",
  },
  imageCaption: {
    fontSize: 9,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 6,
    fontStyle: "italic",
    lineHeight: 1.3,
  },
});

// Cover Page Component
const CoverPage: React.FC<{ valuation: ValuationWithDetails }> = ({
  valuation,
}) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.coverPage}>
      <Text style={styles.coverTitle}>PROPERTY VALUATION REPORT</Text>
      <Text style={styles.coverSubtitle}>
        Professional Valuation Assessment
      </Text>

      <View style={{ marginTop: 40, marginBottom: 40 }}>
        <Text style={styles.coverProperty}>
          Property: {valuation.property.address}
        </Text>
        <Text style={styles.coverProperty}>UPI: {valuation.property.upi}</Text>
        <Text style={styles.coverClient}>Client: {valuation.client_name}</Text>
        {valuation.client_contact && (
          <Text style={styles.coverClient}>
            Contact: {valuation.client_contact}
          </Text>
        )}
      </View>

      <View style={{ marginTop: 40 }}>
        <Text style={styles.coverDate}>
          Report Date: {new Date().toLocaleDateString()}
        </Text>
        <Text style={styles.coverDate}>Valuation ID: {valuation.id}</Text>
        {valuation.valuation_date && (
          <Text style={styles.coverDate}>
            Valuation Date:{" "}
            {new Date(valuation.valuation_date).toLocaleDateString()}
          </Text>
        )}
      </View>
    </View>

    <Text style={styles.footer}>
      This report has been prepared by a qualified valuer in accordance with
      professional standards
    </Text>
  </Page>
);

// Main Report Page Component
const ReportPage: React.FC<{
  valuation: ValuationWithDetails;
  pageNumber: number;
}> = ({ valuation, pageNumber }) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.header}>
      <Text style={styles.title}>PROPERTY VALUATION REPORT</Text>
      <Text style={styles.reportInfo}>
        <Text>Report ID: {valuation.id}</Text>
        <Text>Date: {new Date().toLocaleDateString()}</Text>
        <Text>Status: {valuation.status || "Draft"}</Text>
      </Text>
    </View>

    {/* Property Information Section */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>PROPERTY INFORMATION</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Property Address:</Text>
        <Text style={styles.value}>{valuation.property.address}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>UPI Number:</Text>
        <Text style={styles.value}>{valuation.property.upi}</Text>
      </View>

      {valuation.property.owner && (
        <View style={styles.row}>
          <Text style={styles.label}>Owner:</Text>
          <Text style={styles.value}>{valuation.property.owner}</Text>
        </View>
      )}

      <View style={styles.row}>
        <Text style={styles.label}>Location:</Text>
        <Text style={styles.value}>
          {[
            valuation.property.village,
            valuation.property.cell,
            valuation.property.sector,
            valuation.property.district,
            valuation.property.province,
            valuation.property.country,
          ]
            .filter(Boolean)
            .join(", ")}
        </Text>
      </View>

      {valuation.property_condition && (
        <View style={styles.row}>
          <Text style={styles.label}>Property Condition:</Text>
          <Text style={styles.value}>{valuation.property_condition}</Text>
        </View>
      )}
    </View>

    {/* Client Information Section */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>CLIENT INFORMATION</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Client Name:</Text>
        <Text style={styles.value}>{valuation.client_name}</Text>
      </View>

      {valuation.client_contact && (
        <View style={styles.row}>
          <Text style={styles.label}>Contact:</Text>
          <Text style={styles.value}>{valuation.client_contact}</Text>
        </View>
      )}
    </View>

    {/* Valuation Details Section */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>VALUATION DETAILS</Text>

      {valuation.purpose && (
        <View style={styles.row}>
          <Text style={styles.label}>Purpose:</Text>
          <Text style={styles.value}>{valuation.purpose}</Text>
        </View>
      )}

      {valuation.valuation_method && (
        <View style={styles.row}>
          <Text style={styles.label}>Valuation Method:</Text>
          <Text style={styles.value}>{valuation.valuation_method}</Text>
        </View>
      )}

      {valuation.instruction_date && (
        <View style={styles.row}>
          <Text style={styles.label}>Instruction Date:</Text>
          <Text style={styles.value}>
            {new Date(valuation.instruction_date).toLocaleDateString()}
          </Text>
        </View>
      )}

      {valuation.inspection_date && (
        <View style={styles.row}>
          <Text style={styles.label}>Inspection Date:</Text>
          <Text style={styles.value}>
            {new Date(valuation.inspection_date).toLocaleDateString()}
          </Text>
        </View>
      )}

      {valuation.valuation_date && (
        <View style={styles.row}>
          <Text style={styles.label}>Valuation Date:</Text>
          <Text style={styles.value}>
            {new Date(valuation.valuation_date).toLocaleDateString()}
          </Text>
        </View>
      )}

      {valuation.assessed_value && (
        <View style={styles.row}>
          <Text style={styles.label}>Assessed Value:</Text>
          <Text style={styles.value}>
            RWF {valuation.assessed_value.toLocaleString()}
          </Text>
        </View>
      )}
    </View>

    <Text style={styles.pageNumber}>Page {pageNumber}</Text>
    <Text style={styles.footer}>
      Zenger Property Valuation System • Generated on{" "}
      {new Date().toLocaleString()}
    </Text>
  </Page>
);

// Valuation Data Pages Component
const ValuationDataPages: React.FC<{
  valuation: ValuationWithDetails;
  startPageNumber: number;
}> = ({ valuation, startPageNumber }) => {
  // Filter out empty content and group valuation data by section
  const validData = valuation.valuation_data
    .filter((item) => hasSignificantContent(item.value))
    .sort((a, b) => a.display_order - b.display_order);

  if (validData.length === 0) {
    return <></>;
  }

  const groupedData = validData.reduce((groups, item) => {
    if (!groups[item.section]) {
      groups[item.section] = [];
    }
    groups[item.section].push(item);
    return groups;
  }, {} as Record<string, ValuationDataRow[]>);

  const sections = Object.entries(groupedData);
  const pages: React.ReactElement[] = [];
  let currentPageNumber = startPageNumber;

  // Split sections across pages if needed
  const sectionsPerPage = 3; // Adjust based on content length

  for (let i = 0; i < sections.length; i += sectionsPerPage) {
    const pageSections = sections.slice(i, i + sectionsPerPage);

    pages.push(
      <Page
        key={`data-page-${currentPageNumber}`}
        size="A4"
        style={styles.page}
      >
        <View style={styles.header}>
          <Text style={styles.title}>VALUATION DATA & ANALYSIS</Text>
        </View>

        {pageSections.map(([sectionName, items]) => (
          <View key={sectionName} style={styles.valuationDataSection}>
            <Text style={styles.valuationDataTitle}>
              {sectionName.toUpperCase()}
            </Text>
            {items.map((item) => {
              const textContent = stripHtmlTags(item.value);
              const images = extractImageUrls(item.value);

              return (
                <View key={item.id} style={styles.valuationDataContent}>
                  {textContent && (
                    <Text style={styles.value}>{textContent}</Text>
                  )}
                  {images.length > 0 && (
                    <View>
                      {images.map((image, index) => (
                        <PDFImage
                          key={index}
                          src={image.url}
                          alt={
                            image.alt ||
                            `Image ${index + 1} from ${item.section}`
                          }
                        />
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}

        <Text style={styles.pageNumber}>Page {currentPageNumber}</Text>
        <Text style={styles.footer}>
          Zenger Property Valuation System • Generated on{" "}
          {new Date().toLocaleString()}
        </Text>
      </Page>
    );

    currentPageNumber++;
  }

  return <>{pages}</>;
};

// Summary Page Component
const SummaryPage: React.FC<{
  valuation: ValuationWithDetails;
  pageNumber: number;
}> = ({ valuation, pageNumber }) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.header}>
      <Text style={styles.title}>VALUATION SUMMARY</Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>PROPERTY SUMMARY</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Property:</Text>
        <Text style={styles.value}>{valuation.property.address}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>UPI:</Text>
        <Text style={styles.value}>{valuation.property.upi}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Client:</Text>
        <Text style={styles.value}>{valuation.client_name}</Text>
      </View>

      {valuation.assessed_value && (
        <View style={styles.row}>
          <Text style={styles.label}>Final Assessed Value:</Text>
          <Text
            style={[
              styles.value,
              { fontSize: 14, fontWeight: "bold", color: "#581c87" },
            ]}
          >
            RWF {valuation.assessed_value.toLocaleString()}
          </Text>
        </View>
      )}
    </View>

    {valuation.general_notes &&
      hasSignificantContent(valuation.general_notes) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GENERAL NOTES</Text>
          <Text style={styles.value}>
            {stripHtmlTags(valuation.general_notes)}
          </Text>
        </View>
      )}

    {valuation.assessment_notes &&
      hasSignificantContent(valuation.assessment_notes) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ASSESSMENT NOTES</Text>
          <Text style={styles.value}>
            {stripHtmlTags(valuation.assessment_notes)}
          </Text>
        </View>
      )}

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>CERTIFICATION</Text>
      <Text style={styles.value}>
        This valuation has been prepared in accordance with professional
        valuation standards and represents our professional opinion of the
        market value of the subject property as at the valuation date.
      </Text>
    </View>

    <Text style={styles.pageNumber}>Page {pageNumber}</Text>
    <Text style={styles.footer}>
      Zenger Property Valuation System • Generated on{" "}
      {new Date().toLocaleString()}
    </Text>
  </Page>
);

// Main PDF Document Component
const ValuationPDFDocument: React.FC<{ valuation: ValuationWithDetails }> = ({
  valuation,
}) => {
  // Check if there's meaningful valuation data
  const validValuationData = valuation.valuation_data
    ? valuation.valuation_data.filter((item) =>
        hasSignificantContent(item.value)
      )
    : [];

  const hasValidValuationData = validValuationData.length > 0;
  const dataPageCount = hasValidValuationData
    ? Math.ceil(validValuationData.length / 5) // More conservative estimate
    : 0;

  return (
    <Document>
      <CoverPage valuation={valuation} />
      <ReportPage valuation={valuation} pageNumber={2} />
      {hasValidValuationData && (
        <ValuationDataPages valuation={valuation} startPageNumber={3} />
      )}
      <SummaryPage valuation={valuation} pageNumber={3 + dataPageCount} />
    </Document>
  );
};

// Export functions for generating and downloading PDFs
export const generateValuationPDF = (valuation: ValuationWithDetails) => {
  return <ValuationPDFDocument valuation={valuation} />;
};

export const downloadValuationPDF = async (valuation: ValuationWithDetails) => {
  const doc = <ValuationPDFDocument valuation={valuation} />;
  const blob = await pdf(doc).toBlob();

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `valuation-${valuation.id}-${valuation.property.upi}-${
    new Date().toISOString().split("T")[0]
  }.pdf`;
  link.click();

  // Cleanup
  URL.revokeObjectURL(url);
};

// React component for PDF download button
export const ValuationPDFDownloadButton: React.FC<{
  valuation: ValuationWithDetails;
  children: React.ReactNode;
  className?: string;
}> = ({ valuation, children, className }) => (
  <PDFDownloadLink
    document={<ValuationPDFDocument valuation={valuation} />}
    fileName={`valuation-${valuation.id}-${valuation.property.upi}-${
      new Date().toISOString().split("T")[0]
    }.pdf`}
    className={className}
  >
    {children}
  </PDFDownloadLink>
);

export default ValuationPDFDocument;
