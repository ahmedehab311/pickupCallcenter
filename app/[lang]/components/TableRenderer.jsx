import { BASE_URL } from "@/api/BaseUrl";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/tableSwitch";
import {
    Tooltip,
    TooltipArrow,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSubdomin } from "@/provider/SubdomainContext";
import { FiEdit } from "react-icons/fi";
    
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
const TableRenderer = ({
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
    isDefault, deletedAt,
    isActiveDefault,
    onViewEdit,
    onDelete, onRestore,
    offset,
    setDraggedIndex,
    filteredSections,
    setFilteredSections,
    isInternalLoading, navigate, isSection
}) => {
    if (isLoading) {
        return <p className="text-center text-gray-500">Loading {labelLoading}...</p>;
    }
    if (error) {
        return <p className="text-center text-gray-500">Error loading {labelLoading}</p>;
    }
    if (!Array.isArray(currentItems) || currentItems.length === 0) {
        return <p className="text-center text-gray-500">No {labelLoading} found</p>;
    }

    return (
        <Table className="border">
            <TableHeader>
                <TableRow>
                    <TableHead>Iamge</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {currentItems?.map((section) => {
                    let deletedAt = section?.deleted_at;
                    let isDefault = section?.default;
                    <TableRow key={section.id}>
                        <TableCell>
                            <Image
                                src={`${BASE_URL()}/${subdomain}/${section.image}`}
                                alt={section.name_en}
                                width={50}
                                height={50}
                                className="rounded-md" />

                        </TableCell>
                        <TableCell>{section.name_en}</TableCell>
                        <TableCell>
                            {section.description_en?.length > 50
                                ? section.description_en.slice(0, 50) + "..."
                                : section.description_en}
                        </TableCell>
                        <TableCell>
                            {section.status ? (
                                <span className="text-green-600">Active</span>
                            ) : (
                                <span className="text-red-600">Inactive</span>
                            )}
                        </TableCell>

                    </TableRow>
                })}
            </TableBody>
        </Table>
    );
};
export default TableRenderer;