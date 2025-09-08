// utils/applyFiltersAndSort.js
export function applyFiltersAndSort({
  data,
  searchTerm = "",
  filters = [],
  sortOption = "",
  pageSize = "all",
}= {}) {
  if (!Array.isArray(data)) return [];

  let updatedSections = [...data];

  // search
  if (searchTerm) {
    updatedSections = updatedSections.filter(
      (section) =>
        section.name_en?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        section?.description_en
          ?.toLowerCase()
          ?.includes(searchTerm.toLowerCase())
    );
  }

  // filters
  if (Array.isArray(filters) && filters.length > 0) {
    if (!filters.includes("all")) {
      if (filters.includes("active")) {
        updatedSections = updatedSections.filter((s) => s?.status === true);
      }
      if (filters.includes("inactive")) {
        updatedSections = updatedSections.filter((s) => s?.status === false);
      }
      if (filters.includes("deleted")) {
        updatedSections = updatedSections.filter((s) => s?.deleted_at !== "");
      }
      if (filters.includes("have_image")) {
        updatedSections = updatedSections.filter((s) => s.image);
      }
    }
  }

  // sort
  if (sortOption === "alphabetical") {
    updatedSections.sort((a, b) => a.name_en.localeCompare(b.name_en));
  } else if (sortOption === "recent") {
    updatedSections.sort((a, b) => b.id - a.id);
  } else if (sortOption === "old") {
    updatedSections.sort((a, b) => a.id - b.id);
  }

  return updatedSections;
}
