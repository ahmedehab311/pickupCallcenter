import React from 'react'

export default function DataOrderPrice({ OrderDetails }) {
    return (
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
    )
}
