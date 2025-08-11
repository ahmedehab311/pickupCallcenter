"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableHeader,
  TableHead,
} from "@/components/ui/table";
import Card from "@/components/ui/card-snippet";
import { Switch } from "@/components/ui/switch";
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
import { FiTrash2 } from "react-icons/fi";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
const Condiments = () => {
  const router = useRouter();
  const language =
    typeof window !== "undefined" ? localStorage.getItem("language") : null;
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  // بيانات وهمية
  const mockSections = [
    {
      id: 1,
      imageUrl: "/section1.jpg",
      sectionName: "111",
      description: "وصف القسم الأول هنا",
      isActive: true,
      sectionItems: [],
    },
    {
      id: 2,
      imageUrl: "/section2.jpg",
      sectionName: "2222",
      description: "وصف القسم الثاني هنا",
      isActive: false,
      sectionItems: [],
    },
    {
      id: 3,
      imageUrl: "/section3.jpg",
      sectionName: "3333",
      description: "وصف القسم الثالث هنا",
      isActive: true,
      sectionItems: [],
    },
    {
      id: 114,
      imageUrl: "/section3.jpg",
      sectionName: "4444",
      description: "وصف القسم الأول هنا",
      isActive: true,
      sectionItems: [],
    },
    {
      id: 214,
      imageUrl: "/section2.jpg",
      sectionName: "555",
      description: "وصف القسم الثاني هنا",
      isActive: false,
      sectionItems: [],
    },
    {
      id: 3144,
      imageUrl: "/section3.jpg",
      sectionName: "666",
      description: "وصف القسم الثالث هنا",
      isActive: true,
      sectionItems: [],
    },
    {
      id: 141,
      imageUrl: "/section1.jpg",
      sectionName: "777",
      description: "وصف القسم الأول هنا",
      isActive: true,
      sectionItems: [],
    },
    {
      id: 142,
      imageUrl: "/section2.jpg",
      sectionName: "8888",
      description: "وصف القسم الثاني هنا",
      isActive: false,
      sectionItems: [],
    },
    {
      id: 1431,
      imageUrl: "/section3.jpg",
      sectionName: "999",
      description: "وصف القسم الثالث هنا",
      isActive: true,
      sectionItems: [],
    },
    {
      id: 10143,
      imageUrl: "/section3.jpg",
      sectionName: "القسم الثالث",
      description: "وصف القسم الثالث هنا",
      isActive: true,
      sectionItems: [],
    },
    {
      id: 1413,
      imageUrl: "/section3.jpg",
      sectionName: "القسم الثالث",
      description: "وصف القسم الثالث هنا",
      isActive: true,
      sectionItems: [],
    },
    {
      id: 1,
      imageUrl: "/section1.jpg",
      sectionName: "القسم الأول",
      description: "وصف القسم الأول هنا",
      isActive: true,
      sectionItems: [],
    },
    {
      id: 2,
      imageUrl: "/section2.jpg",
      sectionName: "القسم الثاني",
      description: "وصف القسم الثاني هنا",
      isActive: false,
      sectionItems: [],
    },
    {
      id: 3,
      imageUrl: "/section3.jpg",
      sectionName: "القسم الثالث",
      description: "وصف القسم الثالث هنا",
      isActive: true,
      sectionItems: [],
    },
    {
      id: 4,
      imageUrl: "/section4.jpg",
      sectionName: "القسم الرابع",
      description: "وصف القسم الرابع هنا",
      isActive: true,
      sectionItems: [],
    },
    {
      id: 5,
      imageUrl: "/section5.jpg",
      sectionName: "القسم الخامس",
      description: "وصف القسم الخامس هنا",
      isActive: false,
      sectionItems: [],
    },
    {
      id: 6,
      imageUrl: "/section6.jpg",
      sectionName: "القسم السادس",
      description: "وصف القسم السادس هنا",
      isActive: true,
      sectionItems: [],
    },
  ];
  const tableHeaders = [
    { key: "sectionName", label: "الاسم" },
    { key: "status", label: "الحالة" },
    { key: "actions", label: "الإجراءات", align: "right" },
  ];
  const columns = [
    {
      key: "sectionName",
      label: "الاسم",
      render: (section) => section.sectionName,
    },

    {
      key: "status",
      label: "الحالة",
      render: (section) => (
        <Switch
          checked={section.isActive}
          onCheckedChange={(checked) => handleToggleActive(section.id, checked)}
        />
      ),
    },
    {
      key: "actions",
      label: "الإجراءات",
      align: "right",
      render: (section) => (
        <TooltipProvider>
          <div className="flex gap-3 jus">
            {/* زر عرض */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  color="secondary"
                  className="h-6 w-6"
                  onClick={() => handleViewEdit(section.id)}
                >
                  <Icon icon="heroicons:eye" className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View</p>
              </TooltipContent>
            </Tooltip>

            {/* زر حذف */}
            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <button className="flex items-center text-red-500 gap-[2px]">
                      <FiTrash2 className="text-xl" />
                    </button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete</p>
                </TooltipContent>
              </Tooltip>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    type="button"
                    variant="outline"
                    color="info"
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/80"
                    onClick={() => handleDelete(section.id)}
                  >
                    Ok
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </TooltipProvider>
      ),
    },
  ];
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // حساب البيانات للصفحة الحالية
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = mockSections.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(mockSections.length / itemsPerPage);

  // دوال معالجة الأحداث
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // دوال معالجة الأحداث
  const handleViewEdit = (id) => {
    router.push(`/${language}/dashboard/condiments/${id}/view`);
  };

  const handleDelete = (id) => {
    console.log("Delete section with id:", id);
    // هنا سيتم استدعاء API للحذف
  };

  const handleToggleActive = (id, checked) => {
    console.log(`Toggle section ${id} to ${checked}`);
    // هنا سيتم استدعاء API لتحديث الحالة
  };

  const handleEnterSection = (items) => {
    console.log("Enter section with items:", items);
    // للتنقل للقسم الفرعي
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <>
      <div className=" ">
        <Card>
          {/* <div className="flex justify-end ">
            <Button>Add groub</Button>
          </div> */}
          <Table>
            <TableHeader>
              <TableRow>
                {tableHeaders?.map((header) => (
                  <TableHead
                    key={header.key}
                    className={header.align === "right" ? "text-right" : ""}
                  >
                    {header.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentItems?.map((section) => (
                <TableRow key={section.id}>
                  {columns?.map((col) => (
                    <TableCell
                      key={col.key}
                      className={
                        col.align === "right"
                          ? "text-right flex justify-end"
                          : ""
                      }
                    >
                      {col.render(section)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePrev}
                isActive={currentPage > 1}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={handleNext}
                isActive={currentPage < totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default Condiments;
