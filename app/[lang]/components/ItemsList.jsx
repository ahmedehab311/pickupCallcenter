"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/CardSections";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import "@/app/[lang]/dashboard/menus/index.css";
import { useSelector, useDispatch } from "react-redux";
import TaskHeader from "@/app/[lang]/dashboard/menus/task-header.jsx";
import { getDictionary } from "@/app/dictionaries.js";
import "@/app/[lang]/dashboard/items/main.css";
// import { saveArrangement } from "./apiSections.jsx";
import ReactPaginate from "react-paginate";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import CardGridRenderer from "@/app/[lang]/components/CardGridRenderer";
import useTranslate from "@/hooks/useTranslate";
// import { deleteItem, restoreItem } from "@//menus/apisMenu";
import {
  changeItemStatus,
  deleteItem,
  restoreItem,
  saveArrangement,
  useSections,
} from "@/app/[lang]/dashboard/sections/apisSection";
import toast from "react-hot-toast";
import SubSectionView from "../dashboard/section/[id]/SubSectionView";
import PaginationAllItems from "./Pagination";
export default function ItemsList({
  lang,
  Sections,
  isLoading,
  id,
  error,
  refetch,
  subdomain,
  token,
  apiBaseUrl,
  subSections,
  isInternalLoading,
  setIsInternalLoading,
  navigate,

  pageType,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { trans } = useTranslate(lang);
  const [filteredItem, setFilteredItem] = useState([]);
  const [filteredSubSection, setFilteredSubSection] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [arrangement, setArrangement] = useState([]);
  const [filterOption, setFilterOption] = useState("");
  const [pageSize, setPageSize] = useState("10");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isSettingLoading, setIsSettingDefaultLoading] = useState(false);
  const itemsCount = filteredItem?.length;
  const [isLoadingStatus, setIsLoadingStauts] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [localStatuses, setLocalStatuses] = useState({});

  const itemsPerPage =
    pageSize === "all" ? filteredItem.length : parseInt(pageSize);

  const applyFiltersAndSort = () => {
    // let updatedSections = [...Menus];
    if (!Array.isArray(Sections)) return;
    setCurrentPage(0);
    let updatedSections = [...Sections];

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

    setFilteredItem(updatedSections);
  };
  useEffect(() => {
    if (token && apiBaseUrl && id) {
      refetch();
    }
  }, [token, apiBaseUrl, id]);
  useEffect(() => {
    applyFiltersAndSort();
  }, [searchTerm, sortOption, filterOption, pageSize, Sections]);

  const handleEnter = (itemId) => {
    router.push(`/${lang}/dashboard/sizes/${itemId}`);
  };
    const handleViewEdit = (itemId) => {
      router.push(`/${lang}/dashboard/item/${itemId}/view`);
    };
  const handleDelete = async (id) => {
    try {
      setIsSettingDefaultLoading(true);
      const res = await deleteItem(apiBaseUrl, token, id, navigate);
      if (
        res.messages?.[0]?.includes("so you can't delete") ||
        res.messages?.[0]?.includes("is deleted")
      ) {
        toast.error(res.messages[0]);
        return;
      }
      // if (res.messages?.[0]?.includes("is deleted")) {
      //   toast.error(res.messages[0]);
      //   return;
      // }
      if (
        res?.responseStatus &&
        Array.isArray(res.messages) &&
        res.messages.length > 0
      ) {
        refetch();
        toast.success(res.messages[0]);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the item.");
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
      toast.error("An error occurred while restoring the item.");
      console.error("Error default item:", error);
    } finally {
      setIsSettingDefaultLoading(false);
    }
  };
  const handlechangeStatus = async (id) => {
    try {
      setIsSettingDefaultLoading(true);
           const res = await changeItemStatus(apiBaseUrl,token, id, navigate);

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
    const ids = filteredItem.map((sections) => sections.id);
    const arrangement = filteredItem.map((_, index) => index + 1);
    // console.log("ids from api", ids);
    // console.log("arrangement from api", arrangement);

    const body = {
      ids: ids,
      arrangement: arrangement,
    };
    try {
      setIsSettingDefaultLoading(true);
      const res = await saveArrangement(token, apiBaseUrl, pageType, body);
      // console.log("respone data :", result);
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
    }
    setIsSettingDefaultLoading(false);
  };
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredItem.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredItem.length / itemsPerPage);

  const getVisiblePages = (currentPage, pageCount) => {
    const pages = [];
    if (pageCount <= 5) return Array.from({ length: pageCount }, (_, i) => i);

    pages.push(0);
    if (currentPage > 2) pages.push("start-ellipsis");
    if (currentPage > 1 && currentPage < pageCount - 2) {
      pages.push(currentPage - 1, currentPage, currentPage + 1);
    } else if (currentPage <= 1) {
      pages.push(1, 2);
    } else if (currentPage >= pageCount - 2) {
      pages.push(pageCount - 3, pageCount - 2);
    }
    if (currentPage < pageCount - 3) pages.push("end-ellipsis");
    pages.push(pageCount - 1);
    return pages;
  };

  const visiblePages = getVisiblePages(currentPage, pageCount);

  return (
    <>
      {subSections && (
        <SubSectionView lang={lang} filteredSubSection={filteredSubSection} />
      )}
      <Card className="gap-6 p-4 mt-3">
        <TaskHeader
          onSearch={(term) => setSearchTerm(term)}
          onPageSizeChange={(value) => setPageSize(value)}
          pageSize={pageSize}
          createButtonText={trans?.button?.item}
          pageType={pageType}
          createTargetPath={navigate}
          filters={[
            { value: "active", label: trans?.sectionsItems?.active },
            { value: "inactive", label: trans?.sectionsItems?.inactive },
            { value: "have_image", label: trans?.sectionsItems?.haveImage },
            { value: "deleted", label: "Deleted" },
            { value: "all", label: trans?.sectionsItems?.all },
          ]}
          handleSaveArrange={handleSaveArrange}
          arrange={true}
          trans={trans}
          isLoading={isLoading}
          itemsCount={filteredItem.length}
        />

        <CardGridRenderer
          currentItems={currentItems}
          isLoading={isLoading}
          error={error}
          localStatuses={localStatuses}
          setLocalStatuses={setLocalStatuses}
          trans={trans}
          isLoadingStatus={isLoadingStatus}
          isDefaultForMenu={false}
          labelLoading="items"
          handleRestore={handleRestore}
          handleEnter={handleEnter}
          handleViewEdit={handleViewEdit}
          handleDelete={handleDelete}
          handlechangeStatus={handlechangeStatus}
          isSettingLoading={isSettingLoading}
          subdomain={subdomain}
          offset={offset}
          setDraggedIndex={setDraggedIndex}
          filteredSections={filteredItem}
          setFilteredSections={setFilteredItem}
          isInternalLoading={isInternalLoading}
          setIsInternalLoading={setIsInternalLoading}
        />

        <PaginationAllItems
          currentItems={currentItems}
          isLoading={isLoading}
          pageCount={pageCount}
          offset={offset}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </Card>
    </>
  );
}
