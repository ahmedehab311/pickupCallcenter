import { BASE_URL } from "@/api/BaseUrl";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/CardSections";
import { usePagination } from "@/hooks/usePagination";
import { saveArrangement } from "../dashboard/sections/apisSection";
import { useEffect, useState } from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import StatusHandler from "@/lib/StatusHandler";
import toast from "react-hot-toast";
import { useSession } from "@/provider/SessionContext";
function CardGridRenderer({
  currentItems,
  isLoading,
  error,
  draggedIndex,
  localStatuses,
  trans,
  isLoadingStatus,
  handleDefault,
  handleRestore,
  isSettingLoading,
  subdomain,
  handleViewEdit,
  handleDelete,
  handleEnter,
  handlechangeStatus,
  labelLoading,
  isDefaultForMenu,
  offset,
  setDraggedIndex,
  filteredSections,
  setFilteredSections,
  isInternalLoading, navigate, refetch
}) {
  const isOnline = useOnlineStatus();
  // const [wasOffline, setWasOffline] = useState(false);
  
  const { handleInvalidToken } = useSession();
  // useEffect(() => {
  //   if (!isOnline) {
  //     setWasOffline(true);
  //   } else if (isOnline && wasOffline) {
  //     toast.success("Online now!");
  //     refetch();
  //     setWasOffline(false);
  //   }
  // }, [isOnline, wasOffline]);
  useEffect(() => {
    if (error?.message === "Invalid token") {
      handleInvalidToken();
    }
  }, [error, handleInvalidToken]);
  const truncateDescription = (description, maxLength = 50) => {
    // console.log("Description received:", description);
    if (!description) return "";
    return description.length > maxLength
      ? description.slice(0, maxLength) + "..."
      : description;
  };
  const getStatus = (section) => {
    // لو المستخدم غيّر السويتش، نستخدم القيمة اللي في localStatuses
    if (section.id in localStatuses) return localStatuses[section.id];
    // وإلا نرجع القيمة الأصلية من الـ API
    return !!section.status;
  };

  const handleDragStart = (e, localIndex) => {
    const actualIndex = offset + localIndex; //  index الحقيقي من filteredSections
    setDraggedIndex(actualIndex);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === index) return;
  };
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    // نسخ filteredSections لعدم التلاعب بالـ state مباشرة
    const reorderedSections = [...filteredSections];

    // سحب العنصر الذي تم سحبه من مكانه القديم
    const [draggedItem] = reorderedSections.splice(draggedIndex, 1);

    // إدخال العنصر في المكان الجديد
    reorderedSections.splice(dropIndex, 0, draggedItem);

    // تحديث filteredSections في الـ state
    setFilteredSections(reorderedSections);
    setDraggedIndex(null);

    // حساب الترتيب الجديد بناءً على filteredSections
    const arrangement = reorderedSections.map((_, index) => index + 1);

    // إظهار الترتيب الجديد في الكونسول
    // console.log("Updated Arrangement:", arrangement);

    // تعريف الـ ids بناءً على العناصر
    const ids = reorderedSections.map((section) => section.id); // هنا نحصل على الـ ids من العناصر المعدلة

    // إظهار الـ IDs في الترتيب الجديد
    const updatedIds = arrangement.map((index) => ids[index - 1]);

    // console.log("Updated IDs:", updatedIds);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div>
      <StatusHandler
        isOnline={isOnline}
        isLoading={isLoading}
        error={error}
        isEmpty={currentItems?.length === 0}
        emptyMessage={`No ${labelLoading} found`}
        loadingMessage={`Loading ${labelLoading}...`}
        errorMessage={`Error loading ${labelLoading}`}
      >
        {
          Array.isArray(currentItems) && currentItems.length && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 ">
              {currentItems.map((section, index) => {
                let deletedAt = section?.deleted_at;
                let isDefault = section?.default;
                return (
                  <div
                    key={section.id}
                    className={`card bg-popover  border border-gray-200 dark:border-none ${draggedIndex === index ? "opacity-50" : ""
                      }`}
                  >
                    <CardHeader
                      imageUrl={`${BASE_URL()}/${subdomain}/${section.image}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, section.id)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, section.id)}
                      onDragEnd={handleDragEnd}
                    />

                    <CardContent
                      sectionName={section?.name_en}
                      description={truncateDescription(section?.description_en, 80)}
                      isActive={getStatus(section)}
                      onChangeStatus={() => handlechangeStatus(section.id)}
                      isSection={true}
                      className="card-content"
                      trans={trans}
                      deletedAt={section?.actions?.deletedAt}
                      isLoading={isLoadingStatus}
                      isSettingLoading={isSettingLoading}
                    />
                    <CardFooter
                      sectionName={section?.name}
                      onViewEdit={() => handleViewEdit(section.id)}
                      onDelete={() => handleDelete(section.id)}
                      onRestore={() => handleRestore(section.id)}
                      onEnter={() => handleEnter(section.id)}
                      // checked={getStatusDefault(section)}
                      isActiveDefault={() => handleDefault(section.id)}
                      isDefaultForMenu={isDefaultForMenu}
                      isSection={true}
                      trans={trans}
                      isLoading={isLoadingStatus}
                      isDefault={isDefault}
                      deletedAt={deletedAt}
                      isSettingLoading={isSettingLoading}
                      navigate={navigate}
                    />
                  </div>
                );
              })}
            </div>
          )}
      </StatusHandler>

    </div>
  );
}

export default CardGridRenderer;
