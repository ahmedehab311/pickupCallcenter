import { useEffect, useState } from "react";
import StatCard from "./StatCard";
import {
  Package,
  PlusSquare,
  Hourglass,
  Settings,
  Truck,
  CheckCheck,
  Ban,
  XCircle,
  ThumbsDown,
} from "lucide-react";
import { useSubdomin } from "@/provider/SubdomainContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchOrders, fetchUserByPhoneAndId } from "./apisOrders";
import UserDeviceReport from "./SourceReport";
import PickupReport from "./pickupReport";
import BranchesReport from "./BranchesReport";
import TableOrder from "./tableOrder/TableOrder";
import "./index.css";
import { useSession } from "@/provider/SessionContext";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
function OrdersType() {
  const { apiBaseUrl } = useSubdomin();
  const isOnline = useOnlineStatus();
  const [selectedStatus, setSelectedStatus] = useState("Total");
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [token, setToken] = useState(null);
  const {
    data: orders,
    isLoading: isLoadingorders,
    isError: errororders,
    error,
  } = useQuery({
    queryKey: ["ordersList", selectedDayNumber],
    queryFn: () => fetchOrders(token, apiBaseUrl, selectedDayNumber),
    enabled: !!token,
    onSuccess: (orders) => {
      const message = orders?.data?.message;

      if (
        typeof message === "string" &&
        message.toLowerCase().includes("invalid token")
      ) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      // ✅ بيانات سليمة
      setAllOrders(orders.data.data);
      setDisplayOrders(orders.data.data);
    },
  });
  const [orderIdOrPhone, setOrderIdOrPhone] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(false);
  const {
    data: searchUser,
    isLoading: isLoadingSearchUser,
    isError: errorUserSearchUser,
    refetch: refetchSearchUser,
  } = useQuery({
    queryKey: ["userSearch"],
    queryFn: () => fetchUserByPhoneAndId(orderIdOrPhone, token, apiBaseUrl),
    enabled: false,
    // cacheTime: 0,
    // staleTime: 0,
  });
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  const { handleInvalidToken } = useSession();


  if (error?.message === "Invalid token") {
    handleInvalidToken();
  }
  const language =
    typeof window !== "undefined" ? localStorage.getItem("language") : null;

  const stats = [
    {
      icon: Package,
      // number: `${orders?.total?.count}`,
      number: orders?.total?.count ?? "—",
      label: "Total Orders",
      statusKey: "Total",
      color: "text-[#231f20]",
      borderColor: "border-[#231f20]",
    },
    {
      icon: PlusSquare,
      number: orders?.countByStatus?.new?.count ?? "—",
      label: "New",
      statusKey: "New",
      color: "text-[#f39c12]",
      borderColor: "border-[#f39c12]",
    },
    {
      icon: Hourglass,
      number: orders?.countByStatus?.pending?.count ?? "—",
      label: "Pending",
      statusKey: "Pending",
      borderColor: "border-[#8e44ad]",
      color: "text-[#8e44ad]",
    },
    {
      icon: Settings,
      number: orders?.countByStatus?.processing?.count ?? "—",
      label: "Processing",
      statusKey: "Processing",
      color: "text-[#2980b9]",
      borderColor: "border-[#2980b9]",
    },
    {
      icon: Truck,
      number: orders?.countByStatus?.inWay?.count ?? "—",
      label: "In way",
      statusKey: "In-way",
      borderColor: "border-[#B53471]",
      color: "text-[#B53471]",
    },
    {
      icon: CheckCheck,
      number: orders?.countByStatus?.delivered?.count ?? "—",
      label: "Delivered",
      statusKey: "Delivered",
      borderColor: "border-[#2ecc71]",
      color: "text-[#2ecc71]",
    },
    {
      icon: XCircle,
      number: orders?.countByStatus?.canceled?.count ?? "—",
      label: "Cancelled",
      statusKey: "canceled",
      borderColor: "border-[#df1f27]",
      color: "text-[#df1f27]",
    },
    {
      icon: ThumbsDown,
      number: orders?.countByStatus?.rejected?.count ?? "—",
      label: "Rejected",
      statusKey: "rejected",
      color: "text-[#df1f27]",
      borderColor: "border-[#df1f27]",
    },

  ];

  return (
    <>

      {selectedStatus === "Total" && isOnline && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full pt-2 mb-1">
            <Card >
              <CardHeader className="border-none p-4 pb-1 text-primary font-semibold">Order Source</CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="dashtail-legend ">
                  <UserDeviceReport
                    orders={orders}
                    errororders={errororders}
                    isLoadingorders={isLoadingorders}
                  />
                </div>
              </CardContent>
            </Card>

            <Card >
              <CardHeader className="border-none p-4 pb-1 text-primary font-semibold">Delivery Types</CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="dashtail-legend">
                  <PickupReport
                    orders={orders}
                    selectedStatus={selectedStatus}
                    errororders={errororders}
                    isLoadingorders={isLoadingorders}
                    error={error}
                  />
                </div>
              </CardContent>
            </Card>

            <Card >
              <CardHeader className="border-none p-4 pb-1 text-primary font-semibold">Branches</CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="dashtail-legend">
                  <BranchesReport
                    orders={orders}
                    selectedStatus={selectedStatus}
                    errororders={errororders}
                    isLoadingorders={isLoadingorders}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {
        isOnline ? (
          <div className="w-full  my-7">
            <div className={selectedStatus === "Total" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "flex flex-wrap gap-4"}>
              {stats.map((stat, index) => (
                <StatCard
                  key={index}
                  icon={stat.icon}
                  number={stat.number}
                  label={stat.label}
                  onClick={() => setSelectedStatus(stat.statusKey)}
                  color={stat.color}
                  borderColor={stat.borderColor}
                  language={language}
                  errororders={errororders}
                  isLoadingorders={isLoadingorders}
                  selectedStatus={selectedStatus}
                  statusKey={stat.statusKey}
                />
              ))}
            </div>

          </div>
        ) : (
          <div className="flex justify-center items-center h-40 w-full text-lg  text-red-500 ">
             🚨 Internet disconnected
          </div>
        )
      }

      {/* الجدول */}
      <div>
        <Card className="h-full p-3">
          <TableOrder
            orders={orders}
            stats={stats}
            selectedStatus={selectedStatus}
            selectedDayNumber={selectedDayNumber}
            setSelectedDayNumber={setSelectedDayNumber}
            errororders={errororders}
            isLoadingorders={isLoadingorders}
            isLoadingSearchUser={isLoadingSearchUser}
            errorUserSearchUser={errorUserSearchUser}
            orderIdOrPhone={orderIdOrPhone}
            setOrderIdOrPhone={setOrderIdOrPhone}
            searchTrigger={searchTrigger}
            setSearchTrigger={setSearchTrigger}
            searchUser={searchUser}
            refetchSearchUser={refetchSearchUser}
            isOnline={isOnline}
          />
        </Card>
      </div>
    </>
  );
}

export default OrdersType;
