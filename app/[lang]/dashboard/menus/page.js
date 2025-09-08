"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/CardSections";
import { useRouter } from "next/navigation";
import "./index.css";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import TaskHeader from "./task-header.jsx";
import "../items/main.css";
import { setAsDefaultMenu } from "./apisMenu";
import {
  changeItemStatus,
  deleteItem,
  handleDeleteMenu,
  deleteItemTest,
  restoreItem,
} from "@/app/[lang]/dashboard/sections/apisSection";
import useTranslate from "@/hooks/useTranslate";
import { useReorderableList } from "@/hooks/useReorderableList";
import { useSubdomin } from "@/provider/SubdomainContext";
import toast from "react-hot-toast";
import CardGridRenderer from "../../components/CardGridRenderer";
import TableRenderer from "../../components/TableRenderer";
import { useToken } from "@/provider/TokenContext";
import { fetchAllSections, useSections } from "../sections/apisSection";
import StatusHandler from "@/lib/StatusHandler";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { applyFiltersAndSort } from "@/lib/applyFiltersAndSort";
// import { TokenProvider } from "@/context/TokenContext";
const Menu = ({ params: { lang } }) => {
  const router = useRouter();
  // const { token } = useToken();
  const token = localStorage.getItem("token");
  const { apiBaseUrl, subdomain } = useSubdomin();
  const isOnline = useOnlineStatus();
  const [wasOffline, setWasOffline] = useState(false);
  const [filteredMenus, setFilteredMenus] = useState();
  const [pageSize, setPageSize] = useState("10");
  const [viewMode, setViewMode] = useState("card");
  const {
    data: Menus,
    isLoading,
    error,
    refetch,
  } = useSections(token && apiBaseUrl ? token : null, apiBaseUrl, "menus");
  // if (process.env.NODE_ENV === "development") {
  //   console.log("apiBaseUrl", apiBaseUrl);
  //   console.log("Menus", Menus);
  //   console.log("token", token);
  // }

  const { trans } = useTranslate(lang);

  const itemsPerPage =
    pageSize === "all" ? filteredMenus.length : parseInt(pageSize);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [arrangement, setArrangement] = useState([]);
  // const [draggedIndex, setDraggedIndex] = useState(null);
  const itemsCount = filteredMenus?.length;
  const [isLoadingStatus, setIsLoadingStauts] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [localStatuses, setLocalStatuses] = useState({});
  const [isSettingLoading, setIsSettingDefaultLoading] = useState(false);

  const {
    draggedIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    setDraggedIndex,
  } = useReorderableList(filteredMenus);
  // const { offset, currentItems, pageCount, getVisiblePages } = usePagination(
  //   filteredMenu,
  //   itemsPerPage,
  //   currentPage
  // );

useEffect(() => {
  // reset الصفحة هنا
  setCurrentPage(0);

  const updatedSections = applyFiltersAndSort({
    data: Menus,
    searchTerm,
    filters: filterOption,
    sortOption,
    pageSize,
  });

  setFilteredMenus(updatedSections);
}, [Menus, searchTerm, filterOption, sortOption, pageSize]);

  //   const applyFiltersAndSort = () => {
  //     // let updatedSections = [...Menus];
  //     if (!Array.isArray(Menus)) return;
  //     setCurrentPage(0);
  //     let updatedSections = [...Menus];

  //     // search
  //     if (searchTerm) {
  //       updatedSections = updatedSections.filter(
  //         (section) =>
  //           section.name_en?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
  //           section?.description_en
  //             ?.toLowerCase()
  //             ?.includes(searchTerm.toLowerCase())
  //       );
  //     }


  //     if (Array.isArray(filterOption) && filterOption.length > 0) {
  //   if (filterOption.includes("all")) {
  //     // سيبها زي ماهي (يعني كل العناصر)
  //   } else {
  //     if (filterOption.includes("active")) {
  //       updatedSections = updatedSections.filter(
  //         (section) => section?.status === true
  //       );
  //     }
  //     if (filterOption.includes("inactive")) {
  //       updatedSections = updatedSections.filter(
  //         (section) => section?.status === false
  //       );
  //     }
  //     if (filterOption.includes("deleted")) {
  //       updatedSections = updatedSections.filter(
  //         (section) => section?.deleted_at !== ""
  //       );
  //     }
  //     if (filterOption.includes("have_image")) {
  //       updatedSections = updatedSections.filter((section) => section.image);
  //     }
  //   }
  // }

  //     // arang
  //     if (sortOption === "alphabetical") {
  //       updatedSections.sort((a, b) => a.name_en.localeCompare(b.name_en));
  //     } else if (sortOption === "recent") {
  //       updatedSections.sort((a, b) => b.id - a.id);
  //     } else if (sortOption === "old") {
  //       updatedSections.sort((a, b) => a.id - b.id);
  //     }

  //     setFilteredMenus(updatedSections);
  //   };
  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (isOnline && wasOffline) {
      toast.success("Online now!");
      refetch();
      setWasOffline(false);
    }
  }, [isOnline, wasOffline]);
  useEffect(() => {
    applyFiltersAndSort();
  }, [searchTerm, sortOption, filterOption, pageSize, Menus]);

  const handleEnter = (menuId) => {
    router.push(`/${lang}/dashboard/sections/${menuId}`);
  };

  const handleDelete = async (id) => {
    try {
      setIsSettingDefaultLoading(true);
      const res = await deleteItem(apiBaseUrl, token, id, "menu");
      console.log("res", res);

      if (res.message?.includes("so you can't delete")) {
        toast.error(res.message);
        return;
      }
      if (res.message?.includes("is deleted")) {
        toast.error(res.message);
        return;
      }
      if (res.success) {
        toast.success(res.message || "Deleted successfully");
        refetch();
      } else {
        toast.error(res.message || "Error deleting menu");
      }
    } catch (error) {
      // toast.error("An error occurred while deleting the menu.");
      toast.error(error.message);
      console.error("Error default menu:", error);
    } finally {
      setIsSettingDefaultLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      setIsSettingDefaultLoading(true);
      const res = await restoreItem(token, apiBaseUrl, id, "menu");
      if (res.success) {
        refetch();
        toast.success(res.message);
      } else {
        toast.error(res.message || "Error restoring menu");
      }
    } catch (error) {
      toast.error("Error restoring menu.");
      console.error("Error restoring menu:", error);
    } finally {
      setIsSettingDefaultLoading(false);
    }
  };
  const handlechangeStatus = async (id) => {
    try {
      setIsSettingDefaultLoading(true);
      const res = await changeItemStatus(apiBaseUrl, token, id, "menu");
      if (res.message?.includes("not found")) {
        toast.error(res.message);
        return;
      }
      if (
        res?.success
      ) {
        refetch();
        toast.success(res.message);
      } else {
        toast.error(res.message || "Error changing status menu.");
      }
    } catch (error) {
      toast.error("Error changing status menu.");
      console.error("Error changing status menu:", error);
    } finally {
      setIsSettingDefaultLoading(false);
    }
  };
  const handleDefault = async (id) => {
    try {
      setIsSettingDefaultLoading(true);
      const res = await setAsDefaultMenu(token, apiBaseUrl, id);

      if (
        res?.responseStatus &&
        Array.isArray(res.messages) &&
        res.messages.length > 0
      ) {
        refetch();
        toast.success(res.messages[0]);
      }
    } catch (error) {
      toast.success("An error occurred while setting the menu as default.");
      console.error("Error default menu:", error);
    } finally {
      setIsSettingDefaultLoading(false);
    }
  };

  //  edit & view
  const handleViewEdit = (menuId) => {
    router.push(`/${lang}/dashboard/menu/${menuId}/view`);
  };
  const pageCount = Math.ceil(filteredMenus?.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredMenus?.slice(offset, offset + itemsPerPage);

  const getVisiblePages = (currentPage, pageCount) => {
    const pages = [];

    if (pageCount <= 5) {
      return Array.from({ length: pageCount }, (_, i) => i);
    }

    pages.push(0); // always show first page

    if (currentPage > 2) {
      pages.push("start-ellipsis"); // ...
    }

    if (currentPage > 1 && currentPage < pageCount - 2) {
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
    } else if (currentPage <= 1) {
      pages.push(1);
      pages.push(2);
    } else if (currentPage >= pageCount - 2) {
      pages.push(pageCount - 3);
      pages.push(pageCount - 2);
    }

    if (currentPage < pageCount - 3) {
      pages.push("end-ellipsis"); // ...
    }

    pages.push(pageCount - 1); // always show last page

    return pages;
  };
  const visiblePages = getVisiblePages(currentPage, pageCount);

  return (
    <Card className="gap-6 p-4  mt-3 mb-5">
      <div>
        <TaskHeader
          onSearch={(term) => setSearchTerm(term)}
          onSort={(option) => setSortOption(option)}
          onFilterChange={(option) => setFilterOption(option)}
          onPageSizeChange={(value) => setPageSize(value)}
          pageSize={pageSize}
          pageType="menus"
          pageTypeLabel="Menus"
          createButtonText={trans?.button?.section}
          // searchPlaceholder={trans?.sectionsItems.searchSections}
          createTargetName="Menu"
          createTargetPath="menu"
          filters={[
            { value: "active", label: trans?.sectionsItems?.active },
            { value: "inactive", label: trans?.sectionsItems?.inactive },
            { value: "have_image", label: trans?.sectionsItems?.haveImage },
            { value: "deleted", label: "Deleted" },
            { value: "all", label: trans?.sectionsItems?.all },
          ]}
          // handleSaveArrange={handleSaveArrange}
          trans={trans}
          // arrange={true}
          isLoading={isLoading}
          itemsCount={itemsCount}
          isSettingLoading={isSettingLoading}
        />
        {/* <div className="flex justify-end gap-2 mb-4">
  <button
    onClick={() => setViewMode("card")}
    className={`px-3 py-1 rounded ${
      viewMode === "card" ? "bg-blue-500 text-white" : "bg-gray-200"
    }`}
  >
    Cards
  </button>
  <button
    onClick={() => setViewMode("table")}
    className={`px-3 py-1 rounded ${
      viewMode === "table" ? "bg-blue-500 text-white" : "bg-gray-200"
    }`}
  >
    Table
  </button>
</div> */}
        {/* <StatusHandler
          isOnline={isOnline}
          isLoading={isLoading}
          error={error}
          isEmpty={filteredMenus?.length === 0}
          emptyMessage="No menus found"
          loadingMessage="Loading menus..."
          errorMessage="Error loading menus"
        ></StatusHandler> */}
      </div>
      <CardGridRenderer
        labelLoading="menus"
        currentItems={currentItems}
        isLoading={isLoading}
        error={error}
        localStatuses={localStatuses}
        setLocalStatuses={setLocalStatuses}
        trans={trans}
        isDefaultForMenu={true}
        isLoadingStatus={isLoadingStatus}
        handleDefault={handleDefault}
        handleRestore={handleRestore}
        handleEnter={handleEnter}
        handleViewEdit={handleViewEdit}
        handleDelete={handleDelete}
        handlechangeStatus={handlechangeStatus}
        isSettingLoading={isSettingLoading}
        subdomain={subdomain}
        offset={offset}
        setDraggedIndex={setDraggedIndex}
        filteredSections={filteredMenus}
        setFilteredSections={setFilteredMenus}
        refetch={refetch}
      />
      {/* {viewMode === "card" ? (
  <CardGridRenderer
    labelLoading="menus"
    currentItems={currentItems}
    isLoading={isLoading}
    error={error}
    localStatuses={localStatuses}
    setLocalStatuses={setLocalStatuses}
    trans={trans}
    isDefaultForMenu={true}
    isLoadingStatus={isLoadingStatus}
    handleDefault={handleDefault}
    handleRestore={handleRestore}
    handleEnter={handleEnter}
    handleViewEdit={handleViewEdit}
    handleDelete={handleDelete}
    handlechangeStatus={handlechangeStatus}
    isSettingLoading={isSettingLoading}
    subdomain={subdomain}
    offset={offset}
    setDraggedIndex={setDraggedIndex}
    filteredSections={filteredMenus}
    setFilteredSections={setFilteredMenus}
  />
) : (
  // <TableRenderer
  //   labelLoading="menus"
  //   currentItems={currentItems}
  //   isLoading={isLoading}
  //   error={error}
  //   trans={trans}
  //   handleDefault={handleDefault}
  //   handleRestore={handleRestore}
  //   handleEnter={handleEnter}
  //   handleViewEdit={handleViewEdit}
  //   // handleDelete={handleDelete}
  //   // handlechangeStatus={handlechangeStatus}
  //   // isLoadingStatus={isLoadingStatus}
  //   // isSettingLoading={isSettingLoading}
  // />
)} */}

      {pageCount > 1 && currentItems && !isLoading && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((prev) => Math.max(prev - 1, 0));
                }}
              />
            </PaginationItem>

            {visiblePages.map((page, index) => (
              <PaginationItem key={index}>
                {page === "start-ellipsis" || page === "end-ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                  >
                    {page + 1}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((prev) => Math.min(prev + 1, pageCount - 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </Card>
  );
};

export default Menu;
