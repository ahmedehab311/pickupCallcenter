"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/thems";

const BranchesReport = ({
  height = 200,
  orders,
  isLoadingorders,
  errororders,
}) => {
  const { theme: config, setTheme: setConfig, isRtl } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);

  const allOrders = Array.isArray(orders?.sources)
    ? orders.sources.flat()
    : Object.values(orders?.sources || {}).flat();
  const branchOrdersCount = {};
  // console.log("allOrders", allOrders);

  allOrders.forEach((order) => {
    const branchName = order.branch?.[0]?.name_en;
    if (branchName) {
      branchOrdersCount[branchName] = (branchOrdersCount[branchName] || 0) + 1;
    }
  });

  const branchLabels = Object.keys(branchOrdersCount);
  const branchSeries = Object.values(branchOrdersCount);


 const options = {
    chart: {
      toolbar: { show: false },
      height: height - 40, // تقليل ارتفاع الشارت نفسه
    },
    labels: branchLabels,
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
              color: `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel
                })`,
              offsetY: -8, // تقليل الإزاحة
            },
            value: {
              show: true,
              fontSize: "14px", // تقليل حجم الخط
              fontWeight: 600,
              color: `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel
                })`,
              offsetY: 0, // تعديل الإزاحة
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "12px", // تقليل حجم الخط
              fontWeight: 600,
              color: `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel
                })`,
              offsetY: -5, // تقليل الإزاحة
            },
          },
        },
      },
    },
    legend: {
      position: "right",
        offsetY: 30, // تقليل الإزاحة
      horizontalAlign: "center",
      labels: {
        colors: `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel
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
    const hasNoResult =
    !orders ||
    !orders.sources ||
    branchLabels.length === 0 ||
    branchSeries.reduce((a, b) => a + b, 0) === 0;
  if (isLoadingorders) {
    return (
      <div className="flex justify-center items-center h-[250px] animate-pulse text-[#fff] text-lg">
        Loading...
      </div>
    );
  }

  if (errororders) {
    return (
      <div className="flex justify-center items-center h-[250px] text-red-500 text-lg">
        Error loading chart
      </div>
    );
  }
  if (hasNoResult) {
    return (
      <div className="flex justify-center items-center h-[180px] text-important text-lg">
        No results.
      </div>
    );
  }
  return (
    <div className="custom-chart flex flex-col justify-between items-between h-full">
      <Chart
        options={{
          ...options,
          labels: branchLabels,
          chart: {
            ...options.chart,
            width: "100%",
          },
        }}

        series={branchSeries}
        type="donut"
        height={height}
        width={"100%"}
      />
    </div>
  );
};

export default BranchesReport;
