"use client";
import React from "react";
import { useRouter } from "next/navigation";
import HeaderTable from "./HeaderTable";
import DataOrderPrice from "./DataOrderPrice";
import TableBasic from "./table";

const BasicTable = ({ OrderDetails, OrderDetailsItem, order, language }) => {
  const router = useRouter();
  const handleEditOrder = () => {
    localStorage.setItem("order", JSON.stringify(order));
    router.push(`/${language}/dashboard/edit-order`);
  };

  if (!OrderDetailsItem) return null;

  return (
    <>
      <div className="container">
        {/* الهيدر فوق الجدول */}
        <HeaderTable
          handleEditOrder={handleEditOrder}
          OrderDetails={OrderDetails} />
        {/* الجدول */}
        <TableBasic OrderDetailsItem={OrderDetailsItem} />

      </div>
      <DataOrderPrice OrderDetails={OrderDetails} />
    </>
  );
};

export default BasicTable;
