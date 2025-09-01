"use client";
import { Plus, Search } from "lucide-react";
import {
  Selected,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import dialogConfig from "@/config/dialogConfig";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Cookies from "js-cookie";
import { FaSpinner } from "react-icons/fa";
const TaskHeader = ({
  onSearch,
  onSort,
  onPageSizeChange,
  onFilterChange,
  searchPlaceholder = "Search",

  createTargetPath = "item",
  createButtonText,
  pageType = "",
  pageTypeLabel = "",
  trans,
  itemsCount,
  handleSaveArrange,
  arrange,
  isLoading,
  pageSize,
  isSettingLoading,
  filters = [],
}) => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [dialogType, setDialogType] = useState("sections");
  const [searchTerm, setSearchTerm] = useState("");
  const [localCreateButtonText, setLocalCreateButtonText] = useState("");
  const [pageSizePlaceholder, setPageSizePlaceholder] = useState("");
  const allowedPageSizes = [10, 25, 50, "all"];
  const isPageSizeValid =
    allowedPageSizes.map(String).includes(pageSize?.toString()) &&
    (pageSize === "all" || parseInt(pageSize) <= itemsCount); // ← الشرط الجديد
  // const { loading, error, success } = useSelector((state) => state.sections);
  const config = dialogConfig[dialogType];
  const lang = localStorage.getItem("language") || Cookies.get("language");
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  useEffect(() => {
    let label = pageTypeLabel || pageType;

    setPageSizePlaceholder(`${label} per page`);
  }, [pageTypeLabel, pageType]);

  const formatPath =
    createTargetPath.charAt(0).toUpperCase() + createTargetPath.slice(1);
  const createButtonLink = `/${lang}/dashboard/create-${formatPath}`;

  useEffect(() => {
    if (trans?.add) {
      setLocalCreateButtonText(`${trans.add} ${formatPath}`);
    } else {
      setLocalCreateButtonText(`Add ${formatPath}`);
    }
  }, [createTargetPath, trans]);
  // console.log("pageSize:", pageSize); // مثلا "2"
  // console.log("typeof pageSize:", typeof pageSize); // string
  // console.log("allowedPageSizes:", allowedPageSizes); // [1,2,3,...]
  // console.log("allowedPageSizes.map(String):", allowedPageSizes.map(String));
  // console.log(
  //   "includes result:",
  //   allowedPageSizes.map(String).includes(pageSize?.toString())
  // );
  // console.log(
  //   "final check:",
  //   allowedPageSizes.map(String).includes(pageSize?.toString()) &&
  //     (pageSize === "all" || parseInt(pageSize) <= itemsCount)
  // );

  return (
    <div className="flex items-center flex-wrap px-4 my-1">
      <div className="flex-1 flex items-center flex-wrap gap-5">
        {/* Search */}
        <div className="relative min-w-[240px]">
          <span className="absolute top-1/2 -translate-y-1/2 ltr:left-2 rtl:right-2">
            <Search className="w-4 h-4 text-default-500" />
          </span>
          <Input
            type="text"
            placeholder={searchPlaceholder}
            className="ltr:pl-7 rtl:pr-7"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Sort */}
        <div className="relative">
          <Selected onValueChange={onSort}>
            <SelectTrigger className="min-w-[120px] whitespace-nowrap">
              <SelectValue placeholder={trans?.sectionsItems?.sortBy} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphabetical">
                {trans?.sectionsItems?.alphabetical}
              </SelectItem>
              <SelectItem value="recent">
                {trans?.sectionsItems?.newestToOldest}
              </SelectItem>
              <SelectItem value="old">
                {trans?.sectionsItems?.oldstTonewst}
              </SelectItem>
            </SelectContent>
          </Selected>
        </div>

        {/* Page Size */}
        {/* <SelectItem value="1">1</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="all">
                {trans?.sectionsItems?.all}{" "}
                {pageType === "items" ? `(${itemsCount})` : ""}
              </SelectItem> */}
        <div className="relative">
          <Selected
            value={isPageSizeValid ? pageSize?.toString() : undefined}
            onValueChange={onPageSizeChange}
          >
            <SelectTrigger className="min-w-[130px] whitespace-nowrap ">
              <SelectValue placeholder={pageSizePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {allowedPageSizes.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {" "}
                  {size === "all"
                    ? `${trans?.sectionsItems?.all} ${`(${itemsCount})`}`
                    : size}
                </SelectItem>
              ))}
            </SelectContent>
          </Selected>
        </div>
        {/* <div className="relative">
          <Selected
            value={pageSize}
            onValueChange={(value) => {
              onPageSizeChange(value); // من الأب
            }}
          >
            <SelectTrigger className="min-w-[130px] whitespace-nowrap">
              <SelectValue placeholder="Page Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="all">
                {trans?.sectionsItems?.all} ({itemsCount})
              </SelectItem>
            </SelectContent>
          </Selected>
        </div> */}

        {/* Filter */}
        {filters.length > 0 && (
          <div className="relative">
            <Selected onValueChange={onFilterChange}>
              <SelectTrigger className="min-w-[160px] whitespace-nowrap">
                <SelectValue placeholder={trans?.sectionsItems?.filterBy} />
              </SelectTrigger>
              <SelectContent>
                {filters.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Selected>
          </div>
        )}
      </div>
      {/* Create Button */}

      {arrange && (
        <>
          <Button
            onClick={handleSaveArrange}
            type="submit"
            disabled={isLoading}
            // className="mr-4"
            className="flex items-center justify-center w-full max-w-[180px] mr-4"
          >
            {/* Save Arrangement */}
            {/* {isLoading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              
            )} */}
            Save Arrangement
          </Button>
          {/* <Button
              type="submit"
              disabled={isLoadings}
              className="flex items-center justify-center w-full max-w-[180px] "
            >
              {isLoadings ? (
                <FaSpinner className="animate-spin" />
              ) : (
                `${trans?.add || "Add"} ${trans?.path?.[path] || title}`
              )}
            </Button> */}
        </>
      )}
      {/* <Link href={createButtonLink}>
          <Button>
            <Plus className="h-4 w-4 ltr:mr-1 rtl:ml-1" /> {localCreateButtonText}
          </Button>
        </Link> */}
      <Link href={createButtonLink}>
        <Button disabled={isSettingLoading}>
          <Plus className="h-4 w-4 ltr:mr-1 rtl:ml-1" /> {localCreateButtonText}
        </Button>
      </Link>
      {/* {error && <p className="text-red-500">Error: {error}</p>}
      {success && <p className="text-green-500">Section added successfully!</p>} */}
    </div>
  );
};

export default TaskHeader;
