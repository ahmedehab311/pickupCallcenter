// // "use client";

// // import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
// // import { useParams, usePathname } from "next/navigation";

// // import Link from "next/link";
// // import { useMemo } from "react";

// // const DynamicBreadcrumbs = () => {
// //   const pathname = usePathname();
// //  const { lang } = useParams();
// //   // تحديد كل المسارات
// //   const ordersMenu = [
// //     "/dashboard/menus",
// //     "/dashboard/create-menu",
// //     "/dashboard/menu/:id/view",
// //     "/dashboard/menus/:id",
// //     "/dashboard/menu/:id",
// //   ];

// //   const sectionPaths = [
// //     "/dashboard/sections",
// //     "/dashboard/create-section",
// //     "/dashboard/section/:id/view",
// //     "/dashboard/section/:id",
// //   ];

// //   const itemsPaths = [
// //     "/dashboard/items",
// //     "/dashboard/create-item",
// //     "/dashboard/item/:id/view",
// //     "/dashboard/item/:id",
// //   ];

// //   // 🧠 استخدم useMemo لحساب الـ breadcrumbs مرة واحدة

// //   const breadcrumbs = useMemo(() => {
// //     const parts = pathname.split("/").filter(Boolean);
// //     const crumbs = [];

// //     if (parts.includes("dashboard")) {
// //       crumbs.push({
// //         label: "Dashboard",
// //         href: `/${lang}/dashboard`, // 🟢 استخدام اللغة
// //       });
// //     }

// //     parts.forEach((part, index) => {
// //       const isLang = part === lang;
// //       const isId = /^\d+$/.test(part) || part.includes(":");

// //       if (!isLang && !isId && part !== "dashboard") {
// //         const label = decodeURIComponent(part).replace(/-/g, " ");
// //         const href = "/" + parts.slice(0, index + 1).join("/");
// //         crumbs.push({
// //           label: label.charAt(0).toUpperCase() + label.slice(1),
// //           href: `/${lang}${href.startsWith(`/${lang}`) ? "" : href}`, // 🟢 تأكد أن href فيه lang
// //         });
// //       }
// //     });

// //     return crumbs;
// //   }, [pathname, lang]);

// //   if (breadcrumbs.length <= 1) return null;

// //   return (
// //     <div className="mb-4">
// //       <Breadcrumbs>
// //         {breadcrumbs.map((crumb, idx) => (
// //           <BreadcrumbItem key={idx}>
// //             <Link href={crumb.href}>{crumb.label}</Link>
// //           </BreadcrumbItem>
// //         ))}
// //       </Breadcrumbs>
// //     </div>
// //   );
// // };

// // export default DynamicBreadcrumbs;

// "use client";
// import { usePathname, useParams } from "next/navigation";
// import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import {sections} from "@/app/[lang]/dashboard/sections/sectionArray";
// import { Menus } from "@/app/[lang]/dashboard/menus/apisMenu";

// const DynamicBreadcrumbs = () => {
//   const pathname = usePathname();
//   const { lang } = useParams();
//   const [breadcrumbList, setBreadcrumbList] = useState([]);

//   useEffect(() => {
//     const parts = pathname.split("/").filter(Boolean);
//     const crumbs = [];
//     let currentPath = "";

//     for (let i = 0; i < parts.length; i++) {
//       const part = parts[i];
//       currentPath += `/${part}`;

//       // Dashboard ثابت
//       if (part === "dashboard") {
//         crumbs.push({ label: "Dashboard", href: `/${lang}${currentPath}` });
//       }

//       // Menus
//       else if (part === "menu" && parts[i + 1]) {
//         const menuId = parts[i + 1];
//         const menu = Menus.find((m) => m.id === menuId);
//         if (menu) {
//           crumbs.push({
//             label: menu.name,
//             href: `/${lang}/dashboard/menu/${menu.id}`,
//           });
//         }
//       }

//       // Sections
//       else if (part === "section" && parts[i + 1]) {
//         const sectionId = parts[i + 1];
//         const section = sections.find((s) => s.id === sectionId);
//         if (section) {
//           crumbs.push({
//             label: section.name,
//             href: `/${lang}/dashboard/section/${section.id}`,
//           });
//         }
//       }

//       // Items داخل section
//       else if (part === "item" && parts[i + 1]) {
//         const itemId = parts[i + 1];
//         const allItems = sections.flatMap((s) => s.items || []);
//         const item = allItems.find((it) => it.id === itemId);
//         if (item) {
//           crumbs.push({
//             label: item.name,
//             href: `/${lang}/dashboard/item/${item.id}`,
//           });
//         }
//       }

//       // كلمات إضافية زي "view"
//       else if (
//         part !== "en" &&
//         part !== "menu" &&
//         part !== "section" &&
//         part !== "item" &&
//         !/^\d+$/.test(part)
//       ) {
//         crumbs.push({
//           label: capitalize(part),
//           href: `/${lang}${currentPath}`,
//         });
//       }
//     }

//     setBreadcrumbList(crumbs);
//   }, [pathname]);

//   if (!breadcrumbList.length) return null;

//   return (
//     <div className="px-4 py-2">
//       <Breadcrumbs>
//         {breadcrumbList.map((crumb, i) => (
//           <BreadcrumbItem key={i}>
//             <Link href={crumb.href}>{crumb.label}</Link>
//           </BreadcrumbItem>
//         ))}
//       </Breadcrumbs>
//     </div>
//   );
// };

// const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// export default DynamicBreadcrumbs;

// "use client";
// import Link from "next/link";
// import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
// import { useBreadcrumbHistory } from "@/provider/BreadcrumbHistoryProvider";
// import { usePathname } from "next/navigation";

// const DynamicBreadcrumbs = () => {
//   const { breadcrumbs } = useBreadcrumbHistory();
//  const pathname = usePathname();
//   if (!breadcrumbs.length) return null;

//   return (
//     <div className="py-1">
//        <Breadcrumbs>
//         {breadcrumbs.map((crumb, i) => {
//           const isActive = pathname === crumb.path;
//           return (
//             <BreadcrumbItem
//               key={i}
//               className={isActive ? "text-primary font-semibold" : ""}
//               isCurrent={isActive}
//             >
//               <Link href={crumb.path}>{crumb.label}</Link>

//             </BreadcrumbItem>
//           );
//         })}
//       </Breadcrumbs>
//     </div>
//   );
// };

// export default DynamicBreadcrumbs;
// "use client";
// import Link from "next/link";
// import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
// import { useBreadcrumbHistory } from "@/provider/BreadcrumbHistoryProvider";
// import { usePathname } from "next/navigation";

// const DynamicBreadcrumbs = () => {
//   const { breadcrumbs,addCustomBreadcrumb, clearCustomBreadcrumbs } = useBreadcrumbHistory();
//   const pathname = usePathname();
//  const handleDashboardClick = () => {
//     if (selectedStatus !== "Total") {
//       setSelectedStatus("Total");
//       clearCustomBreadcrumbs();
//     }
//   };
//   if (!breadcrumbs.length) return null;

//   return (
//     <div className="py-1">
//       <Breadcrumbs>
//         {breadcrumbs.map((crumb, i) => {
//           const isActive = pathname === crumb.path || !crumb.path; // اللي مالوش path نعتبره active
//           return (
//             <BreadcrumbItem
//               key={i}
//               isCurrent={isActive}
//               className={isActive ? "text-primary font-semibold" : ""}
//             >
//               {crumb.path ? (
//                 <Link href={crumb.path}>{crumb.label}</Link>
//               ) : (
//                 <span>{crumb.label}</span>
//               )}
//             </BreadcrumbItem>
//           );
//         })}

//       </Breadcrumbs>
//     </div>
//   );
// };

// export default DynamicBreadcrumbs;

// "use client";
// import Link from "next/link";
// import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
// import { useBreadcrumbHistory } from "@/provider/BreadcrumbHistoryProvider";
// import { usePathname } from "next/navigation";
// import { useOrder } from "@/hooks/OrderContext";

// const DynamicBreadcrumbs = () => {
//   const { selectedStatus, setSelectedStatus } = useOrder(); 
//   const { breadcrumbs, clearCustomBreadcrumbs } = useBreadcrumbHistory();
//   const pathname = usePathname();

//   // دالة للضغط على Dashboard
//   const handleDashboardClick = () => {
//     if (selectedStatus !== "Total") {
//       setSelectedStatus("Total");
//       clearCustomBreadcrumbs();
//     }
//   };

//   // لا نعرض شيء إذا كان selectedStatus = "Total"
//   if (selectedStatus === "Total") return null;

//   // نجيب فقط الـ breadcrumbs العادية (اللي ليها path)
//   const normalBreadcrumbs = breadcrumbs.filter(b => b.path !== null);

//   // نجيب الـ breadcrumbs المخصصة (اللي مالهاوش path - الأوردرز)
//   const customBreadcrumbs = breadcrumbs.filter(b => b.path === null);

//   return (
//     <div className="py-1">
//       <Breadcrumbs>
//         {normalBreadcrumbs.map((crumb, i) => {
//           const isActive = pathname === crumb.path;
//           return (
//             <BreadcrumbItem
//               key={i}
//               isCurrent={isActive}
//               className={isActive ? "text-primary font-semibold" : ""}
//             >
//               {crumb.path === "/en/dashboard" ? (
//                 <Link 
//                   href={crumb.path} 
//                   onClick={handleDashboardClick}
//                   className="text-blue-500 hover:underline"
//                 >
//                   {crumb.label}
//                 </Link>
//               ) : (
//                 <Link href={crumb.path}>{crumb.label}</Link>
//               )}
//             </BreadcrumbItem>
//           );
//         })}

//         {/* نعرض خانة الأوردرز فقط إذا كانت موجودة */}
//         {customBreadcrumbs.map((crumb, i) => (
//           <BreadcrumbItem
//             key={`custom-${i}`}
//             isCurrent={true}
//             className="text-primary font-semibold"
//           >
//             <span>{crumb.label}</span>
//           </BreadcrumbItem>
//         ))}
//       </Breadcrumbs>
//     </div>
//   );
// };

// export default DynamicBreadcrumbs;
"use client";
import Link from "next/link";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { useBreadcrumbHistory } from "@/provider/BreadcrumbHistoryProvider";
import { usePathname } from "next/navigation";
import { useOrder } from "@/hooks/OrderContext";

const DynamicBreadcrumbs = () => {
  const { selectedStatus, setSelectedStatus } = useOrder();
  const { breadcrumbs, clearCustomBreadcrumbs } = useBreadcrumbHistory();
  const pathname = usePathname();

  const handleDashboardClick = (e) => {
    e.preventDefault();
    if (selectedStatus !== "Total") {
      setSelectedStatus("Total");
      clearCustomBreadcrumbs(); // دي هتمسح أي أوردرز
    }

  };

  // نحدد إذا كنا في صفحة الداشبورد
  const isDashboardPage = pathname === "/en/dashboard" || pathname.endsWith("/dashboard");

  // نجيب الـ breadcrumbs العادية (اللي ليها path)
  const normalBreadcrumbs = breadcrumbs.filter(b => b.path !== null);

  // نجيب الـ breadcrumbs المخصصة (اللي مالهاوش path - الأوردرز)
  const customBreadcrumbs = breadcrumbs.filter(b => b.path === null);

  // ما نعرضش حاجة إذا مفيش breadcrumbs خالص
  if (normalBreadcrumbs.length === 0 && customBreadcrumbs.length === 0) return null;

  return (
    <div>
      <Breadcrumbs>
        {normalBreadcrumbs.map((crumb, i) => {
          const isActive = pathname === crumb.path;
          const isLast = i === normalBreadcrumbs.length - 1 && customBreadcrumbs.length === 0;

          // تحديد إذا Dashboard بيكون لينك أو مجرد نص
          const isDashboardLink = crumb.path === "/en/dashboard" || crumb.path.endsWith("/dashboard");

          return (
            <BreadcrumbItem
              key={i}
              isCurrent={isLast && customBreadcrumbs.length === 0}
              className={isActive ? "text-primary font-semibold" : ""}
            >
              {isDashboardLink ? (
                // Dashboard link - بيتصرف بشكل مختلف حسب الحالة
                isDashboardPage && selectedStatus !== "Total" ? (
                  // في الداشبورد و selectedStatus != Total - بيكون لينك يضبط الحالة
                  <Link
                    href={crumb.path}
                    onClick={handleDashboardClick}
                    className="text-black font-semibold "
                  >
                    {/* {crumb.label}/Total */}

                    Total
                  </Link>
                ) : (
                  // في صفحة تانية أو selectedStatus = Total - بيكون لينك عادي
                  <Link href={crumb.path}>
                    {crumb.label}
                  </Link>
                )
              ) : (
                // أي لينك تاني غير Dashboard
                <Link href={crumb.path}>{crumb.label} </Link>
              )}
            </BreadcrumbItem>
          );
        })}

        {/* نعرض خانة الأوردرز فقط إذا كانت موجودة */}
        {customBreadcrumbs.map((crumb, i) => (
          <BreadcrumbItem
            key={`custom-${i}`}
            isCurrent={true}
            className="text-primary font-semibold"
          >
            <span>{crumb.label}</span>
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </div>
  );
};

export default DynamicBreadcrumbs;