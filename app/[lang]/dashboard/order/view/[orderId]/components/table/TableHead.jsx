import {
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
export default function TableHeadOrder() {
    return (
        // 
        <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-900">
                <TableHead className="w-1/4">Item</TableHead>
                <TableHead className="w-2/5">Notes</TableHead>
                <TableHead className="w-1/6 tt">Price</TableHead>
                <TableHead className="w-1/6 text-right">Total</TableHead>
            </TableRow>
        </TableHeader>
    )
}
