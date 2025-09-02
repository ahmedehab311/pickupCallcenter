"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { useRouter } from "next/navigation";

const BasicTable = ({ OrderDetails, OrderDetailsItem, order,language }) => {
   const router = useRouter();
  const handleEditOrder = () => {
    localStorage.setItem("order", JSON.stringify(order));
    router.push(`/${language}/dashboard/edit-order`);
  };

  if (!OrderDetailsItem) return null;

  return (
    <>
      <div className="space-y container">
      {/* الهيدر فوق الجدول */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-2 gap-2">
  {/* الجزء الشمال */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-sm font-medium text-gray-700 dark:text-gray-300">
    {OrderDetails?.check_id && (
      <span>Check: {OrderDetails?.check_id}</span>
    )}
    <span>Source: {OrderDetails?.source}</span>
    <span>Status: {OrderDetails?.status}</span>
  </div>

  {/* الجزء اليمين */}
  <Button
    className="py-[6px] px-4 text-sm"
    onClick={handleEditOrder}
  >
    Edit
  </Button>
</div>

      {/* الجدول */}
      <div className="max-h-[400px] overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-900">
              <TableHead className="w-1/4">Item</TableHead>
              <TableHead className="w-2/5">Notes</TableHead>
              <TableHead className="w-1/6 text-right">Price</TableHead>
              <TableHead className="w-1/6 text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {OrderDetailsItem.map((item, index) => (
              <React.Fragment key={item.id || index}>
                {/* الصف الرئيسي */}
                <TableRow>
                  <TableCell className="font-medium">
                    {item?.count} ×{" "}
                    {item?.info?.size_en || item?.name?.item_name}
                  </TableCell>
                  <TableCell>{item?.special || "—"}</TableCell>
                  <TableCell className="text-right">
                    {parseFloat(item?.sub_total || 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {parseFloat(item?.total_price || 0).toFixed(2)}
                  </TableCell>
                </TableRow>

                {/* الصفوف الفرعية */}
                {item.size_condiments?.map((condiment, i) => {
                  const count = condiment.count || 0;
                  const price = parseFloat(condiment.price || 0);
                  const total = (count * price).toFixed(2);

                  return (
                    <TableRow
                      key={`condiment-${index}-${i}`}
                      className="bg-gray-50 dark:bg-gray-800"
                    >
                      <TableCell className="pl-6 text-sm text-gray-600 dark:text-gray-300">
                        {count} × {condiment.condiment_info?.name_en}
                      </TableCell>
                      <TableCell />
                      <TableCell className="text-sm text-right text-gray-600 dark:text-gray-300">
                        {price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm text-right text-gray-600 dark:text-gray-300">
                        {total}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
      {/* الصف الأول */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-4 mx-2 text-sm p-2 justify-items-center">
  {/* العمود الأول */}
  <div className="flex flex-col gap-4">
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
      <span className="font-semibold w-28">Payment type:</span>
      <span>{OrderDetails?.payment_method === 1 ? "Cash" : "Visa"}</span>
    </div>
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
      <span className="font-semibold w-28">Notes:</span>
      <span>{OrderDetails?.notes || "-"}</span>
    </div>
  </div>

  {/* العمود الثاني */}
  <div className="flex flex-col gap-4">
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
      <span className="font-semibold w-28">Delivery fees:</span>
      <span>
        {OrderDetails?.delivery_fees?.match(/\.\d+$/)
          ? OrderDetails.delivery_fees
          : OrderDetails?.delivery_fees?.replace(/\.$/, "")}
      </span>
    </div>
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
      <span className="font-semibold w-28">Sub Total:</span>
      <span>{OrderDetails?.sub_total?.toFixed(2)}</span>
    </div>
  </div>

  {/* العمود الثالث */}
  <div className="flex flex-col gap-4">
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
      <span className="font-semibold w-28">Tax fees:</span>
      <span>{OrderDetails?.tax_fees}</span>
    </div>
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
      <span className="font-semibold w-28">Total Amount:</span>
      <span>
        {OrderDetails?.total
          ? parseFloat(
              OrderDetails.total.replace(/\s/g, "").replace(",", ".")
            ).toFixed(2)
          : "0.00"}
      </span>
    </div>
  </div>
</div>



    </>
  );
};

export default BasicTable;
