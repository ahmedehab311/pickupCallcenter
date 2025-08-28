import { FiTrash2 } from 'react-icons/fi'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
function DeleteItemFromCartAlert({ handleRemoveItem, item }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className="flex items-center text-red-500 hover:text-red-400 gap-[2px]">
                    <FiTrash2 className="text-l" />
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-800 dark:text-gray-200">
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                        This action cannot be undone. This
                        will permanently delete this item
                        from your saved items.

                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        type="button"
                        variant="outline"
                        className="text-gray-800 dark:text-gray-200 border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-600 hover:bg-red-500 text-white"
                        onClick={() =>
                            handleRemoveItem(item.cartId)
                        }
                    >
                        Ok
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteItemFromCartAlert