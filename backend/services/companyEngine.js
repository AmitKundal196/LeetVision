export function getCompanyTagsForSubmission(titleSlug) {
  // Public synchronized data does not contain company mapping metadata
  // We return an empty array to indicate that there is no verified company data in MongoDB.
  // The UI will display "No Company Data" instead.
  return [];
}
