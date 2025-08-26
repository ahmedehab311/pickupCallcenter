"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/thems";

// const UserDeviceReport = ({
//   height = 250,
//   orders,
//   isLoadingorders,
//   errororders,
// }) => {
//   const { theme: config, setTheme: setConfig, isRtl } = useThemeStore();
//   const { theme: mode } = useTheme();
//   const theme = themes.find((theme) => theme.name === config);

//   const sourceLabels = orders?.sources ? Object.keys(orders?.sources) : [];
//   const sourceCounts = orders?.sources
//     ? Object.values(orders.sources).map((arr) => arr?.length)
//     : [];

//   const series = sourceCounts;
 
//   const options = {
//     chart: { toolbar: { show: false },
//       height: height - 40,  },
//     labels: sourceLabels,
//     dataLabels: { enabled: false },
//     colors: [
//       `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].primary})`,
//       "#FF9E69",
//       "#FFD1A7",
//       "#6C5DD3",
//       "#00C9A7",
//       "#FFC700",
//     ],
//     tooltip: {
//       theme: mode === "dark" ? "dark" : "light",
//     },
//     stroke: { width: 0 },
//     plotOptions: {
//       pie: {
//         donut: {
//           size: "70%", // يمكن تعديل الحجم هنا (توسيع الدائرة)
//           labels: {
//             show: true,
//             name: {
//               show: true,
//               fontSize: "20px",
//               fontWeight: 500,
//               color: `hsl(${
//                 theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel
//               })`,
//               offsetY: -12, 
//             },
//             value: {
//               show: true,
//               fontSize: "18px",
//               fontWeight: 600,
//               color: `hsl(${
//                 theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel
//               })`,
//               offsetY: -1,
//             },
//             total: {
//               show: true,
//               label: "Total",
//               fontSize: "16px",
//               fontWeight: 600,
//               color: `hsl(${
//                 theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel
//               })`,
//               offsetY: -10,
//             },
//           },
//         },
//       },
//     },
//     legend: {
//       position: "bottom",
//       offsetY: -15,
//       labels: {
//         colors: `hsl(${
//           theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel
//         })`,
//       },
//       itemMargin: { horizontal: 9, vertical: 22 },
//       markers: {
//         width: 10,
//         height: 10,
//         radius: 10,
//         offsetX: isRtl ? 5 : -5,
//       },
//     },
//   };
//   if (isLoadingorders) {
//     return (
//       <div className="flex justify-center items-center h-[250px] animate-pulse text-[#fff] text-lg">
//         Loading...
//       </div>
//     );
//   }

//   if (errororders) {
//     return (
//       <div className="flex justify-center items-center h-[250px] text-red-500 text-lg">
//         Error loading chart
//       </div>
//     );
//   }
//   return (
//     <div className="custom-chart">

//     <Chart
//       options={options}
//       series={series}
//       type="donut"
//       height={height}
//       width={"100%"}
//     />
//     </div>
//   );
// };

// export default UserDeviceReport;
const UserDeviceReport = ({
  height = 200, // تقليل الارتفاع الافتراضي
  orders,
  isLoadingorders,
  errororders,
}) => {
  const { theme: config, setTheme: setConfig, isRtl } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);

  const sourceLabels = orders?.sources ? Object.keys(orders?.sources) : [];
  const sourceCounts = orders?.sources
    ? Object.values(orders.sources).map((arr) => arr?.length)
    : [];

  const series = sourceCounts;
 
  const options = {
    chart: { 
      toolbar: { show: false },
      height: height - 40, // تقليل ارتفاع الشارت نفسه
    },
    labels: sourceLabels,
    dataLabels: { enabled: false },
    colors: [
      `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].primary})`,
      "#FF9E69",
      "#FFD1A7",
      "#6C5DD3",
      "#00C9A7",
      "#FFC700",
    ],
    tooltip: {
      theme: mode === "dark" ? "dark" : "light",
    },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: "65%", // تقليل حجم الدائرة لتتناسب مع الارتفاع الجديد
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px", // تقليل حجم الخط
              fontWeight: 500,
              color: `hsl(${
                theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel
              })`,
              offsetY: -8, // تقليل الإزاحة
            },
            value: {
              show: true,
              fontSize: "14px", // تقليل حجم الخط
              fontWeight: 600,
              color: `hsl(${
                theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel
              })`,
              offsetY: 0, // تعديل الإزاحة
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "12px", // تقليل حجم الخط
              fontWeight: 600,
              color: `hsl(${
                theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel
              })`,
              offsetY: -5, // تقليل الإزاحة
            },
          },
        },
      },
    },
    legend: {
      position: "right",
       offsetY: 30, 
      horizontalAlign: "center",
      labels: {
        colors: `hsl(${
          theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel
        })`,
        useSeriesColors: false,
      },
      itemMargin: { horizontal: 8, vertical: 4 }, // تقليل المسافة بين العناصر
      markers: {
        width: 8, // تصغير حجم الماركر
        height: 8,
        radius: 8,
        offsetX: isRtl ? 4 : -4,
      },
     fontSize: "12px", 
     formatter: function(seriesName, opts) {
    const value = opts.w.globals.series[opts.seriesIndex];
    const total = opts.w.globals.series.reduce((a, b) => a + b, 0);
    const percentage = ((value / total) * 100).toFixed(2);
    return `${seriesName}: (${percentage}%)`;
  }
    },
  };

  if (isLoadingorders) {
    return (
      <div className="flex justify-center items-center h-[180px] animate-pulse text-[#fff] text-lg">
        Loading...
      </div>
    );
  }

  if (errororders) {
    return (
      <div className="flex justify-center items-center h-[180px] text-red-500 text-lg">
        Error loading chart
      </div>
    );
  }

  return (
    <div className="custom-chart flex flex-col justify-between items-between h-full">
      <Chart
        options={options}
        series={series}
        type="donut"
        height={height}
        width={"100%"}
      />
    </div>
  );
};
export default UserDeviceReport;