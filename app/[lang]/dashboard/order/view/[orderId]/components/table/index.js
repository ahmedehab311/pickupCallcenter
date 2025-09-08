import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableHeader,
} from "@/components/ui/table";
// import { TableHeadOrder } from "./TableHeadOrder"
export default function TableBasic({ OrderDetailsItem }) {
    const tableHeaderArray = ['Item', 'Notes', 'Price', 'Total']
    return (
        <div className="max-h-[400px] overflow-auto rounded-md border">
            <Table>
                {/* <TableHeadOrder /> */}
                <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-gray-900">
                        <TableHead className="w-1/4">Item</TableHead>
                        <TableHead className="w-2/5">Notes</TableHead>
                        <TableHead className="w-1/6 tt">Price</TableHead>
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
                                <TableCell className="text">
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
    )
}
