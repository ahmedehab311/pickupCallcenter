import { Button } from "@/components/ui/button";

export default function HeaderTable({ OrderDetails, handleEditOrder }) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-2 gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-sm font-medium text-gray-700 dark:text-gray-300">
                {OrderDetails?.check_id && (
                    <span>Check: {OrderDetails?.check_id}</span>
                )}
                <span>Source: {OrderDetails?.source}</span>
                <span>Status: {OrderDetails?.status}</span>
            </div>

            <Button
                className="py-[6px] px-4 text-sm"
                onClick={handleEditOrder}
            >
                Edit
            </Button>
        </div>
    )
}
