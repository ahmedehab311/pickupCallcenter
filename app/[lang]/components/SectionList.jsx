"use client";
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/CardSections";
import { useRouter } from "next/navigation";
import "@/app/[lang]/dashboard/menus/index.css";
import TaskHeader from "@/app/[lang]/dashboard/menus/task-header.jsx";
import "@/app/[lang]/dashboard/items/main.css";
import CardGridRenderer from "./CardGridRenderer";
import {
  changeItemStatus,
  deleteItem,
  restoreItem,
  saveArrangement,
} from "@/app/[lang]/dashboard/sections/apisSection";
import PaginationAllItems from "./Pagination";
import toast from "react-hot-toast";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
function SectionList({
  lang,
  sections,
  isLoading,
  error,
  refetch,
  trans,
  subdomain,
  token,
  apiBaseUrl,
  navigate,
  pageType,
}) {
  const router = useRouter();
   const isOnline = useOnlineStatus();
  const [filteredSections, setFilteredSections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [arrangement, setArrangement] = useState([]);
  const [filterOption, setFilterOption] = useState("");
  const [pageSize, setPageSize] = useState("10");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isSettingLoading, setIsSettingDefaultLoading] = useState(false);
  const itemsCount = filteredSections?.length;
  const [isLoadingStatus, setIsLoadingStauts] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [localStatuses, setLocalStatuses] = useState({});
  const previousPageRef = useRef(0);
  const wasSearching = useRef(false);
  const itemsPerPage =
    pageSize === "all" ? filteredSections.length : parseInt(pageSize);

  const applyFiltersAndSort = () => {
    // let updatedSections = [...Menus];
    if (!Array.isArray(sections)) return;
    let updatedSections = [...sections];

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

    // filter
    if (filterOption === "active") {
      updatedSections = updatedSections.filter(
        (section) => section?.status === true
      );
    } else if (filterOption === "inactive") {
      updatedSections = updatedSections.filter(
        (section) => section?.status === false
      );
    } else if (filterOption === "deleted") {
      updatedSections = updatedSections.filter(
        (section) => section?.deleted_at !== ""
      );
    } else if (filterOption === "have_image") {
      updatedSections = updatedSections.filter((section) => section.image);
    }

    // arang
    if (sortOption === "alphabetical") {
      updatedSections.sort((a, b) => a.name_en.localeCompare(b.name_en));
    } else if (sortOption === "recent") {
      updatedSections.sort((a, b) => b.id - a.id);
    } else if (sortOption === "old") {
      updatedSections.sort((a, b) => a.id - b.id);
    }
    // pagenation
    // if (pageSize !== "all") {
    //   const size = parseInt(pageSize, 10);
    //   updatedSections = updatedSections.slice(0, size);
    // }

    setFilteredSections(updatedSections);
  };

  useEffect(() => {
    if (searchTerm && !wasSearching.current) {
      previousPageRef.current = currentPage;
      wasSearching.current = true;
      setCurrentPage(0);
    }
    if (!searchTerm && wasSearching.current) {
      setCurrentPage(previousPageRef.current); // رجع للصفحة اللي كنا فيها
      wasSearching.current = false; // خرجنا من حالة البحث
    }

    applyFiltersAndSort();
  }, [searchTerm, sortOption, filterOption, pageSize, sections]);

  const handleEnter = (sectionId) => {
    router.push(`/${lang}/dashboard/section/${sectionId}`);
  };
  const handleViewEdit = (sectionId) => {
    router.push(`/${lang}/dashboard/${navigate}/${sectionId}/view`);
  };
  const handleDelete = async (id) => {
    try {
      setIsSettingDefaultLoading(true);
      const res = await deleteItem(apiBaseUrl, token, id, navigate);
      if (res.messages?.[0]?.includes("so you can't delete")) {
        toast.error(res.messages[0]);
        return;
      }
      if (
        res?.responseStatus &&
        Array.isArray(res.messages) &&
        res.messages.length > 0
      ) {
        refetch();
        toast.success(res.messages[0]);
      }
    } catch (error) {
      toast.error(`An error occurred while deleting the ${navigate}.`);
      console.error("Error default item:", error);
    } finally {
      setIsSettingDefaultLoading(false);
    }
  };
  const handleRestore = async (id) => {
    try {
      setIsSettingDefaultLoading(true);
      const res = await restoreItem(token, apiBaseUrl, id, navigate);

      if (
        res?.responseStatus &&
        Array.isArray(res.messages) &&
        res.messages.length > 0
      ) {
        refetch();
        toast.success(res.messages[0]);
      }
    } catch (error) {
      toast.error("An error occurred while restoring the menu.");
      console.error("Error default menu:", error);
    } finally {
      setIsSettingDefaultLoading(false);
    }
  };
  const handlechangeStatus = async (id) => {
    console.log("apiBaseUrl", apiBaseUrl);
    console.log("token", token);
    console.log("id", id);
    try {
      setIsSettingDefaultLoading(true);

      const res = await changeItemStatus(apiBaseUrl, token, id, "section");
      if (res.messages?.[0]?.includes("is deleted")) {
        toast.error(res.messages[0]);
        return;
      }

      if (
        res?.responseStatus &&
        Array.isArray(res.messages) &&
        res.messages.length > 0
      ) {
        refetch();
        toast.success(res.messages[0]);
      }
    } catch (error) {
      toast.error("An error occurred while changing status the item.");
      console.error("Error changing status item:", error);
    } finally {
      setIsSettingDefaultLoading(false);
    }
  };

  const handleSaveArrange = async () => {
    setIsSettingDefaultLoading(true);
    const ids = filteredSections.map((sections) => sections.id);
    const arrangement = filteredSections.map((_, index) => index + 1);
    // console.log("ids from api", ids);
    // console.log("arrangement from api", arrangement);
    
    const body = {
      ids: ids,
      arrangement: arrangement,
    };
    try {
      const res = await saveArrangement(token, apiBaseUrl, pageType, body);
      console.log("respone data :", res);
      if (
        res?.responseStatus &&
        Array.isArray(res.messages) &&
        res.messages.length > 0
      ) {
        refetch();
        toast.success(res.messages[0]);
      }
    } catch (error) {
      toast.error("An error occurred while arrange the items.");
      console.error("error save arrangment", error);
    }finally{

      setIsSettingDefaultLoading(false);
    }
  };
  const pageCount = Math.ceil(filteredSections?.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredSections?.slice(offset, offset + itemsPerPage);
  if (!filteredSections) {
    return <div>Loading...</div>;
  }
  return (
    <Card className="gap-6 p-4 mt-3 mb-5">
      <div>
        <TaskHeader
          onSearch={(term) => setSearchTerm(term)}
          onSort={(option) => setSortOption(option)}
          onFilterChange={(option) => setFilterOption(option)}
          onPageSizeChange={(value) => setPageSize(value)}
          pageSize={pageSize}
          createButtonText={trans?.button?.section}
          // searchPlaceholder={trans?.sectionsItems.searchSections}
          pageType={pageType}
          createTargetPath={navigate}
          filters={[
            { value: "active", label: trans?.sectionsItems?.active },
            { value: "inactive", label: trans?.sectionsItems?.inactive },
            { value: "have_image", label: trans?.sectionsItems?.haveImage },
            { value: "deleted", label: "Deleted" },
            { value: "all", label: trans?.sectionsItems?.all },
          ]}
          trans={trans}
          handleSaveArrange={handleSaveArrange}
          arrange={true}
          isLoading={isLoading}
          itemsCount={itemsCount}
        />
      </div>

      {/* Check for loading state first */}

      <CardGridRenderer
        currentItems={currentItems}
        isLoading={isLoading}
        error={error}
        localStatuses={localStatuses}
        setLocalStatuses={setLocalStatuses}
        trans={trans}
        isLoadingStatus={isLoadingStatus}
        isDefaultForMenu={false}
        labelLoading={pageType}
        handleRestore={handleRestore}
        handleEnter={handleEnter}
        handleViewEdit={handleViewEdit}
        handleDelete={handleDelete}
        handlechangeStatus={handlechangeStatus}
        isSettingLoading={isSettingLoading}
        subdomain={subdomain}
        offset={offset}
        setDraggedIndex={setDraggedIndex}
        filteredSections={filteredSections}
        setFilteredSections={setFilteredSections}
        navigate={navigate}
        refetch ={refetch}
      />

      <PaginationAllItems
        currentItems={currentItems}
        isLoading={isLoading}
        pageCount={pageCount}
        offset={offset}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOnline={isOnline}
      />
    </Card>
  );
}

export default SectionList;
